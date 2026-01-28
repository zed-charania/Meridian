import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getStripe } from "@/lib/stripe"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as { session_id?: string; form_id?: string } | null
    const sessionId = body?.session_id
    const formId = body?.form_id

    if (!sessionId || !formId) {
      return NextResponse.json({ error: "session_id and form_id are required" }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const sessionFormId = session.metadata?.form_id
    const userId = session.metadata?.user_id

    if (!sessionFormId || !userId) {
      return NextResponse.json({ error: "Missing metadata on checkout session" }, { status: 400 })
    }

    if (sessionFormId !== formId) {
      return NextResponse.json({ error: "form_id mismatch" }, { status: 400 })
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { status: "unpaid", payment_status: session.payment_status },
        { status: 200 }
      )
    }

    const { error: updateError } = await supabase
      .from("n400_forms")
      .update({
        payment_status: "paid",
        payment_id: (session.payment_intent as string) ?? null,
        payment_amount: session.amount_total ?? null,
        payment_date: new Date().toISOString(),
      })
      .eq("id", formId)
      .eq("user_id", userId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ status: "paid" }, { status: 200 })
  } catch (error) {
    console.error("Confirm checkout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}


