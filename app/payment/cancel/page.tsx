"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("form_id");

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-amber-600" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Payment Cancelled
      </h1>

      <p className="text-slate-600 mb-6">
        No worries! Your form has been saved. You can complete your payment
        whenever you&apos;re ready.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => router.push(`/form?formId=${formId}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Return to Form
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        }
      >
        <PaymentCancelContent />
      </Suspense>
    </div>
  );
}
