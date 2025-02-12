import { createCustomerPortal } from "@/lib/stripe";
import { getSubscriptionById, getUserById } from "@/lib/supabase/action";
import { readUserData } from "@/lib/supabase/readUser";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      data: { user },
    } = await readUserData();
    const body = await req.json();
    const currentUser = await getUserById(user?.id as string);
    const subscription = await getSubscriptionById(currentUser?.id as string);

    console.log("-------------------------");
    console.log(subscription);
    if (!subscription?.customerId) {
      return NextResponse.json(
        {
          error: "You don't have a billing account yet. Make a purchase first.",
        },
        { status: 400 }
      );
    } else if (!body.returnUrl) {
      return NextResponse.json(
        { error: "Return URL is required" },
        { status: 400 }
      );
    }

    const stripePortalUrl = await createCustomerPortal({
      customerId: subscription.customerId,
      returnUrl: body.returnUrl,
    });

    return NextResponse.json({
      url: stripePortalUrl,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
