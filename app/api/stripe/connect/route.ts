import prisma from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";

import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get("Stripe-Signature") as string;
  // create event to check if request is coming from stripe and if it's safe to use.
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string,
    );
  } catch (error: unknown) {
    return new Response("Invalid request", { status: 400 });
  }
  // listening for events from stripe
  switch (event.type) {
    case "account.updated": {
      const account = event.data.object;

      // find user by connected account id
      await prisma.user.update({
        where: {
          connectedAccountId: account.id,
        },
        data: {
          stripeConnectedLinked:
            account.capabilities?.transfers === "pending" ||
            account.capabilities?.transfers === "inactive"
              ? false
              : true,
        },
      });
      break;
    }
    default: {
      console.log("Unhandled event");
    }
  }

  return new Response(null, { status: 200 });
}
