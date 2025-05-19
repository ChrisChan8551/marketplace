import { stripe } from "@/app/lib/stripe";
import { sendProductEmail } from "@/app/lib/send-email";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const body = await req.text();

    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_SECRET_WEBHOOK as string
        );
    } catch (error: unknown) {
        return new Response("webhook error", { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;

            const link = session.metadata?.link;

            try {
                const result = await sendProductEmail({
                    to: ["your_email"],
                    subject: "Your Product from Digit",
                    link: link as string,
                });

                if (!result.success) {
                    console.error("Email sending failed:", result.error);
                }
            } catch (emailError) {
                console.error("Failed to send email:", emailError);
            }

            break;
        }
        default: {
            console.log("unhandled event");
        }
    }

    return new Response(null, { status: 200 });
}
