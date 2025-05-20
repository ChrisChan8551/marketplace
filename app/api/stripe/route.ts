import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import { Resend } from "resend";
import Stripe from 'stripe';
import { handleCheckoutComplete, type CheckoutSession } from "@/app/lib/email";

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
