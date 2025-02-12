import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { findCheckoutSession, getStripePrice } from "@/lib/stripe";
import {
  createSubscription,
  createUser,
  getSubscriptionByCustomerId,
  getSubscriptionById,
  getUserByEmail,
  getUserById,
  updateUserSubscription,
} from "@/lib/supabase/action";
import config from "@/config/global";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let eventType;
  let event;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "No signature or webhook secret" },
      { status: 400 }
    );
  }

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err}`);
    return NextResponse.json({ error: err }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product

        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const userId = stripeObject.client_reference_id;

        const price = await getStripePrice(priceId as string);

        if (price.type === "one_time" && price.metadata.isCreditPurchase) {
          const credits = price.metadata.credits;
          const user = await getUserByEmail(session?.customer_email as string);
          const subscription = await getSubscriptionById(user?.id as string);
          if (!user || !subscription) break;

          await updateUserSubscription(user?.id as string, {
            credits: Number(subscription.credits) + Number(credits),
          });
          break;
        }

        const plan = config.stripe.plans.find(
          (p) => p.priceId === priceId || p.anualPriceId === priceId
        );

        if (!plan) break;

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;

        console.log(customer);
        let user;

        if (userId) {
          user = await getUserById(userId);
          await stripe.customers.update(customerId as string, {
            email: customer.email as string,
          });
        } else if (customer.email) {
          user = await getUserByEmail(customer.email);
          if (!user) {
            user = await createUser(customer.email, customer.id, "");
          }
        } else {
          console.error("No user found");
          throw new Error("No user found");
        }

        // Update user data + Grant user access to your product. It's a boolean in the database, but could be a number of credits, etc...
        // create subscription Table
        const subscriptionData = await stripe.subscriptions.retrieve(
          session?.subscription as string
        );
        const interval = subscriptionData.items.data[0].plan.interval;

        const credits = interval === "year" ? plan.credits * 12 : plan.credits;

        await createSubscription({
          id: user?.id as string,
          plan: plan.id,
          status: "active",
          credits,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user?.id as string,
          usedCredits: 0,
          customerId: customer.id,
          priceId: priceId as string,
          interval: interval,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;
        const customerId = stripeObject.customer;

        const user = await getSubscriptionByCustomerId(customerId as string);
        await updateUserSubscription(user?.id as string, {
          status: "canceled",
        });
        break;
      }

      case "invoice.paid": {
        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;
        const customerId = stripeObject.customer;
        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;

        const subscriptionId = stripeObject.subscription;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId as string
        );
        const priceId = subscription.items.data[0].price.id;
        const plan = config.stripe.plans.find(
          (p) => p.priceId === priceId || p.anualPriceId === priceId
        );

        if (!plan) break;
        const user = await getUserByEmail(customer.email as string);
        if (!user) break;

        await updateUserSubscription(user?.id as string, {
          status: "active",
          priceId: priceId,
          credits: plan?.credits,
          interval: subscription.items.data[0].plan.interval,
          plan: plan.id,
        });

        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: ", e);
  }

  return NextResponse.json({});
}
