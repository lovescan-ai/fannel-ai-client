import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { findCheckoutSession, getStripePrice } from "@/lib/stripe";
import {
  createSubscription,
  getSubscriptionById,
  getUserByEmail,
  updateUserSubscription,
} from "@/lib/supabase/action";
import config from "@/config/global";
import { readUserInfoKv, saveCreatorInfoKv } from "@/lib/kv/actions";

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
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price?.id;

        const price = await getStripePrice(priceId as string);
        const readUserKv = await readUserInfoKv();
        const currentUser = await getUserByEmail(readUserKv.email);

        if (readUserKv.tierType === "tier-agencies") {
          console.log(
            "🟠 Proceeded with creating subscription for tier-agencies"
          );
          await createSubscription({
            id: currentUser?.id as string,
            plan: readUserKv.tierType,
            status: "active",
            credits: readUserKv.credits,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: currentUser?.id as string,
            usedCredits: 0,
            customerId: customerId as string,
            priceId: priceId as string,
            interval: "month",
          });
          console.log("✅ Subscription created");
        }

        if (
          readUserKv.tierType === "tier-creator" ||
          readUserKv.tierType === "tier-small-agencies"
        ) {
          console.log(
            "🟠 Proceeded with creating subscription for tier-creator or tier-small-agencies"
          );
          const plan = config.stripe.plans.find(
            (p) => p.priceId === priceId || p.anualPriceId === priceId
          );

          if (!plan) break;

          const customer = (await stripe.customers.retrieve(
            customerId as string
          )) as Stripe.Customer;

          const subscriptionData = await stripe.subscriptions.retrieve(
            session?.subscription as string
          );
          const interval = subscriptionData.items.data[0].plan.interval;

          const credits =
            interval === "year" ? plan.credits * 12 : plan.credits;

          await createSubscription({
            id: currentUser?.id as string,
            plan: readUserKv.tierType,
            status: "active",
            credits,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: currentUser?.id as string,
            usedCredits: 0,
            customerId: customer.id,
            priceId: priceId as string,
            interval: interval,
          });
          console.log("✅ Subscription created");
        }

        if (readUserKv.tierType === "one-time") {
          console.log("🟠 Proceeded with updating credits for one-time");
          const credits = price.metadata.credits;
          const subscription = await getSubscriptionById(
            currentUser?.id as string
          );
          if (!subscription) {
            throw new Error("Subscription not found");
          }

          await updateUserSubscription(currentUser?.id as string, {
            credits: Number(subscription.credits) + Number(credits),
          });
          console.log("✅ Credits updated");
        }

        break;
      }

      case "customer.subscription.deleted": {
        console.log("🟠 Proceeded with deleting subscription");
        const readUserKv = await readUserInfoKv();
        const currentUser = await getUserByEmail(readUserKv.email);

        await updateUserSubscription(currentUser?.id as string, {
          status: "canceled",
        });
        console.log("✅ Subscription deleted");
        break;
      }

      case "invoice.paid": {
        try {
          console.log("🟠 Proceeded with updating subscription");
          const stripeObject: Stripe.Invoice = event.data
            .object as Stripe.Invoice;
          const customerId = stripeObject.customer;

          if (!customerId) {
            console.error("Missing customer ID in invoice.paid event");
            break;
          }

          const customer = (await stripe.customers.retrieve(
            customerId as string
          )) as Stripe.Customer;

          if (!customer) {
            console.error(`Customer not found or deleted: ${customerId}`);
            break;
          }

          const subscriptionId = stripeObject.subscription;
          if (!subscriptionId) {
            console.error("Missing subscription ID in invoice.paid event");
            break;
          }

          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId as string
          );
          const priceId = subscription.items.data[0].price.id;
          const plan = config.stripe.plans.find(
            (p) => p.priceId === priceId || p.anualPriceId === priceId
          );

          if (!plan) {
            console.error(`No plan found for price ID: ${priceId}`);
            break;
          }

          if (!customer.email) {
            console.error(`Customer has no email: ${customerId}`);
            break;
          }

          const user = await getUserByEmail(customer.email as string);
          if (!user) {
            console.error(`No user found for email: ${customer.email}`);
            break;
          }

          console.log(
            `🟠 Proceeded with updating subscription for user: ${user.id}`
          );

          console.log(`🟠 Found plan: ${plan.name}, credits: ${plan.credits}`);

          await updateUserSubscription(user.id, {
            status: "active",
            priceId,
            credits: plan.credits,
          });

          await saveCreatorInfoKv({
            subscribed: true,
            credits: plan.credits,
            priceId,
            status: "success",
          });

          console.log("✅ Subscription updated");
        } catch (error) {
          console.error("Error handling invoice.paid event:", error);
          await saveCreatorInfoKv({
            subscribed: false,
            credits: 0,
            priceId: "",
            status: "failed",
          });
        }
        break;
      }

      default:
    }
  } catch (e) {
    console.error("stripe error: ", e);
    await saveCreatorInfoKv({
      subscribed: false,
      credits: 0,
      priceId: "",
      status: "failed",
    });
  }

  return NextResponse.json({});
}
