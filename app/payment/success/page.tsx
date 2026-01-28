"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("form_id");
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<"confirming" | "paid" | "unpaid" | "error">("confirming");

  useEffect(() => {
    let isActive = true

    async function confirmPayment() {
      if (!formId || !sessionId) {
        if (isActive) setStatus("error")
        return
      }

      try {
        const response = await fetch("/api/stripe/confirm-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form_id: formId, session_id: sessionId }),
        })

        const json = await response.json().catch(() => null)
        if (!isActive) return

        if (!response.ok) {
          console.error("Confirm checkout failed:", json)
          setStatus("error")
          return
        }

        if (json?.status === "paid") {
          setStatus("paid")
          return
        }

        setStatus("unpaid")
      } catch (error) {
        if (!isActive) return
        console.error("Confirm checkout request failed:", error)
        setStatus("error")
      }
    }

    confirmPayment()

    return () => {
      isActive = false
    }
  }, [formId, sessionId])

  useEffect(() => {
    if (status !== "paid") return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/form?formId=${formId}&download=true`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [formId, router, status]);

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Payment Successful!
      </h1>

      <p className="text-slate-600 mb-6">
        {status === "confirming"
          ? "Confirming your payment..."
          : status === "paid"
          ? "Thank you for your purchase. Your N-400 form is ready to download."
          : status === "unpaid"
          ? "Your payment is still processing. Please wait a moment and try again."
          : "We couldn't confirm your payment. Please contact support."}
      </p>

      <div className="flex items-center justify-center gap-2 text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{status === "paid" ? `Redirecting in ${countdown} seconds...` : "Standing by..."}</span>
      </div>

      <button
        onClick={() => router.push(`/form?formId=${formId}&download=true`)}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        disabled={status !== "paid"}
      >
        Download Now
      </button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
