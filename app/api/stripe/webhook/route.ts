import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const formId = session.metadata?.form_id;
    const userId = session.metadata?.user_id;

    if (!formId || !userId) {
      console.error("Missing metadata in checkout session");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Update form payment status
    const { error: updateError } = await supabase
      .from("n400_forms")
      .update({
        payment_status: "paid",
        payment_id: session.payment_intent as string,
        payment_amount: session.amount_total,
        payment_date: new Date().toISOString(),
      })
      .eq("id", formId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Failed to update payment status:", updateError);
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      );
    }

    console.log(`Payment successful for form ${formId}`);
  }

  return NextResponse.json({ received: true });
}
