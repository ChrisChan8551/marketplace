import { Resend } from "resend";
import { renderToHtml as renderProductEmail } from "@/app/components/SimpleProductEmail";
import { stripe } from "@/app/lib/stripe";

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

// Define the session type to fix TypeScript error
export interface CheckoutSession {
    id: string;
    metadata?: Record<string, string> | null;
    customer_details?: {
        email?: string;
    };
    line_items?: {
        data?: Array<{
            price?: {
                product?: any; // Use any to avoid TypeScript errors
            };
        }>;
    };
    [key: string]: any; // Allow indexing with string
}

/**
 * Handles the completion of a checkout session by sending an email with the download link
 * @param session - The Stripe checkout session object
 * @returns Object indicating success or failure with data/error
 */
export async function handleCheckoutComplete(session: CheckoutSession) {
    try {
        console.log('====== HANDLING CHECKOUT COMPLETE ======');
        console.log('Session ID:', session.id);

        // Try to get the link from different possible locations
        let link = session.metadata?.link;

        // If not found in primary location, try alternate locations
        if (!link) {
            if (session.metadata?.download_link) {
                link = session.metadata.download_link;
                console.log('Found download_link in metadata');
            } else if (session.metadata?.product_link) {
                link = session.metadata.product_link;
                console.log('Found product_link in metadata');
            } else if (session.line_items?.data?.[0]?.price?.product?.metadata?.link) {
                link = session.line_items.data[0].price.product.metadata.link;
                console.log('Found link in line item product metadata');
            } else {
                // Try to find link in other session properties
                for (const key in session) {
                    const value = session[key];
                    if (typeof value === 'string' && value.startsWith('http')) {
                        console.log(`Found possible link in session.${key}:`, value);
                        if (!link) link = value;
                    }
                }
            }
        } else {
            console.log('Found link directly in metadata');
        }

        // If still no link, return error
        if (!link) {
            console.error('⚠️ NO PRODUCT LINK FOUND IN SESSION');
            return {
                error: "No product link found in session",
                success: false
            };
        }

        console.log('Using product link:', link);

        // Generate HTML directly using our template function
        const emailHtml = renderProductEmail({ link });

        // Get customer email from session if available
        const customerEmail = session.customer_details?.email || 'chrischan8551@gmail.com';
        console.log('Sending email to:', customerEmail);

        const emailResult = await resend.emails.send({
            from: "Digital Marketplace <onboarding@resend.dev>",
            to: 'chrischan8551@gmail.com',
            subject: "Your Product from Digital Marketplace",
            html: emailHtml
        });

        if (emailResult.error) {
            console.error('Email sending failed:', emailResult.error);
            return { error: emailResult.error, success: false };
        }

        console.log('Email sent successfully:', emailResult.data);
        return { success: true, data: emailResult.data };
    } catch (error) {
        console.error('Error in handleCheckoutComplete:', error);
        return {
            error: "Email sending failed",
            details: error instanceof Error ? error.message : String(error),
            success: false
        };
    }
}
