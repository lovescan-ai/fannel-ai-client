import { saveUserInfoKv } from "@/lib/kv/actions";
import { createCheckout } from "@/lib/stripe";
import { readUserData } from "@/lib/supabase/readUser";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.priceId) {
    return NextResponse.json({ error: "Price is required" }, { status: 400 });
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
    return NextResponse.json(
      {
        error:
          "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
      },
      { status: 400 }
    );
  }

  try {
    const user = await readUserData();
    const {
      data: { user: userData },
    } = user;
    const {
      priceId,
      mode,
      successUrl,
      cancelUrl,
      interval,
      tierType,
      credits,
      price,
    } = body;

    await saveUserInfoKv({
      tierType,
      credits,
      price,
      id: userData?.id?.toString() || "",
      email: userData?.email || "",
      name: userData?.user_metadata?.name || "",
    });

    const stripeSessionURL = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      clientReferenceId: userData?.id?.toString(),
      interval,
      user: {
        email: userData?.email,
      },
    });

    console.log("stripeSessionURL", stripeSessionURL);

    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
