import ProductEmail from "@/app/components/ProductEmail";
import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string
        );
    } catch (error: unknown) {
        return new Response("webhook error", { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const link = session.metadata?.link;

            // Send email without directly using React components in API route
            const { data, error } = await resend.emails.send({
                from: "Digital Marketplace <onboarding@resend.dev>",
                to: ["your_email"],
                subject: "Your Product from Digital Marketplace",
                html: `
                <div>
                    <h1>Hi Friend,</h1>
                    <p>Thank you for buying your product at Digital Marketplace</p>
                    <div style="text-align: center; margin-top: 24px;">
                        <a href="${link}" style="background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">Your Download Link</a>
                    </div>
                    <p>Best,<br/>Digital Marketplace Team</p>
                </div>
                `,
            });

            break;
        }
        default: {
            console.log("unhandled event");
        }
    }

    return new Response(null, { status: 200 });
}
