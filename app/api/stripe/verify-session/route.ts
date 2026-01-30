import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, formId } = body;

    if (!sessionId || !formId) {
      return NextResponse.json(
        { error: "Session ID and Form ID required" },
        { status: 400 }
      );
    }

    // Verify the Stripe session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 400 }
      );
    }

    // Check payment status
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed", status: session.payment_status },
        { status: 400 }
      );
    }

    // Verify the form_id matches
    if (session.metadata?.form_id !== formId) {
      return NextResponse.json(
        { error: "Form ID mismatch" },
        { status: 400 }
      );
    }

    // Update the form's payment status in Supabase
    const { error: updateError } = await supabase
      .from("n400_forms")
      .update({
        payment_status: "paid",
        stripe_session_id: sessionId,
        paid_at: new Date().toISOString(),
      })
      .eq("id", formId);

    if (updateError) {
      console.error("Error updating payment status:", updateError);
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentStatus: "paid",
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    );
  }
}
