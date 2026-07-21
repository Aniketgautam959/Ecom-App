"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, CreditCard, RotateCcw, HelpCircle } from "lucide-react";
import EcomNavbar from "@/components/Layout/EcomNavbar";
import EcomFooter from "@/components/Layout/EcomFooter";

function OrderFailedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number");
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <EcomNavbar />
      <main className="flex-1 pt-16">
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t process your payment. Your order{" "}
            {orderNumber ? (
              <span className="font-semibold text-gray-900 dark:text-white">{orderNumber}</span>
            ) : (
              ""
            )}{" "}
            is still pending.
          </p>

          <div className="border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg p-5 text-left mb-8">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  What happened?
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error || "Your payment could not be completed. This can happen due to insufficient funds, transaction timeout, or the payment being cancelled."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cart"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </Link>
            <Link
              href="/orders"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors inline-flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" /> View Orders
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            If the amount was deducted, it will be refunded within 5-7 business days.
          </p>
        </div>
      </main>
      <EcomFooter />
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <EcomNavbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </main>
        <EcomFooter />
      </div>
    }>
      <OrderFailedContent />
    </Suspense>
  );
}
