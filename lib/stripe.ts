import Stripe from "stripe";

interface CreateCheckoutParams {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  couponId?: string | null;
  clientReferenceId?: string;
  interval?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

export const createCheckout = async ({
  user,
  mode,
  clientReferenceId,
  successUrl,
  cancelUrl,
  priceId,
  couponId,
  interval,
}: CreateCheckoutParams): Promise<string | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2023-08-16",
      typescript: true,
    });

    const extraParams: {
      customer?: string;
      customer_creation?: "always";
      customer_email?: string;
      invoice_creation?: { enabled: boolean };
      payment_intent_data?: { setup_future_usage: "on_session" };
      tax_id_collection?: { enabled: boolean };
    } = {};

    if (user?.customerId) {
      extraParams.customer = user.customerId;
    } else {
      if (user?.email) {
        extraParams.customer_email = user.email;
      }
      extraParams.tax_id_collection = { enabled: true };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode,
      allow_promotion_codes: true,
      client_reference_id: clientReferenceId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      discounts: couponId
        ? [
            {
              coupon: couponId,
            },
          ]
        : [],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...extraParams,
    });

    return stripeSession.url || null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: CreateCustomerPortalParams): Promise<string> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-08-16",
    typescript: true,
  });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return portalSession.url;
};

// This is used to get the uesr checkout session and populate the data so we get the planId the user subscribed to
export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2023-08-16",
      typescript: true,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createStripePrice = async (amount: number, credits: number) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-08-16",
    typescript: true,
  });
  const product = await stripe.products.create({
    name: "Credit",
  });
  const price = await stripe.prices.create({
    currency: "usd",
    unit_amount: amount * 100,
    product: product.id,
    metadata: {
      credits,
      isCreditPurchase: "true",
    },
  });

  return price;
};

interface BuyCreditCheckoutParams {
  priceId: string;
  mode: Stripe.Checkout.SessionCreateParams.Mode;
  successUrl: string;
  cancelUrl: string;
  couponId?: string;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

export const buyCreditCheckout = async ({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  clientReferenceId,
  user,
}: BuyCreditCheckoutParams): Promise<string | null> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-08-16",
  });

  const extraParams: Stripe.Checkout.SessionCreateParams = {};

  if (user?.customerId) {
    extraParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      mode,
      allow_promotion_codes: false,
      client_reference_id: clientReferenceId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        sSubscription: "false",
        priceId: priceId,
      },
      ...extraParams,
    });

    return stripeSession.url;
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return null;
  }
};

export const getStripePrice = async (priceId: string) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-08-16",
  });

  const price = await stripe.prices.retrieve(priceId);

  return price;
};
