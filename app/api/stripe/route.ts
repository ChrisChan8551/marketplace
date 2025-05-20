import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import { Resend } from "resend";
import Stripe from 'stripe';
import { renderToHtml as renderProductEmail } from "@/app/components/SimpleProductEmail";

// Define the session type to fix TypeScript error
interface CheckoutSession {
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

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

export async function POST(req: Request) {
    console.log('\n\n====== STRIPE WEBHOOK TRIGGERED ======', new Date().toISOString());

    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature");

    if (!signature) {
        console.error('❌ No Stripe signature in request headers');
        return new Response("Missing Stripe signature", { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_WEBHOOK) {
        console.error('❌ STRIPE_SECRET_WEBHOOK environment variable is missing');
        return new Response("Webhook secret not configured", { status: 500 });
    }

    try {
        const body = await req.text();

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_SECRET_WEBHOOK
            );
            console.log('✅ STRIPE EVENT RECEIVED:', event.type);
        } catch (verificationError) {
            console.error('❌ Webhook signature verification failed:', verificationError);
            return new Response("Webhook signature verification failed", { status: 400 });
        }

        // Process based on event type
        if (event.type === "checkout.session.completed") {
            console.log('✅ CHECKOUT COMPLETED EVENT DETECTED');

            // Log important session properties specifically
            const session = event.data.object;
            console.log('Session ID:', session.id);

            // Try to get the complete session with expanded data directly from Stripe
            try {
                console.log('Fetching complete session data from Stripe API...');
                const completeSession = await stripe.checkout.sessions.retrieve(
                    session.id,
                    {
                        expand: ['line_items.data.price.product'],
                    }
                );

                // Use the expanded session data for processing
                const typedSession = completeSession as unknown as CheckoutSession;
                const handlerResult = await handleCheckoutComplete(typedSession);

                if (handlerResult.success) {
                    console.log('✅ Email sent successfully for checkout session', session.id);
                } else {
                    console.error('❌ Failed to process checkout session:', handlerResult.error);
                }
            } catch (e) {
                console.error('Error retrieving complete session:', e);

                // Fall back to using the basic session
                try {
                    // Cast to our CheckoutSession type
                    const typedSession = session as unknown as CheckoutSession;
                    const handlerResult = await handleCheckoutComplete(typedSession);

                    if (handlerResult.success) {
                        console.log('✅ Email sent successfully with basic session', session.id);
                    } else {
                        console.error('❌ Failed to process basic session:', handlerResult.error);
                    }
                } catch (basicSessionError) {
                    console.error('💥 Error processing basic session:', basicSessionError);
                }
            }
        } else {
            console.log("⚠️ Unhandled event type:", event.type);
        }

        return new Response(JSON.stringify({ received: true, eventType: event.type }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('💥 Unexpected error in webhook handler:', error);
        return new Response(JSON.stringify({
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Export the function so it can be used by the simulation endpoint
export async function handleCheckoutComplete(session: CheckoutSession) {
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

    // If still no link, use a fallback
    if (!link) {
        console.error('⚠️ NO PRODUCT LINK FOUND IN SESSION');
        return {
            error: "No product link found in session",
            success: false
        };
    }

    console.log('Using product link:', link);

    try {
        console.log('Starting email send process...');

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
    } catch (emailError) {
        console.error('Error sending email:', emailError);
        return {
            error: "Email sending failed",
            details: emailError instanceof Error ? emailError.message : String(emailError),
            success: false
        };
    }
}
