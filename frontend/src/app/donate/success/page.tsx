"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Animated Checkmark ───────────────────────────────────────────────────────

function CheckmarkAnimation() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-50"
      }`}
    >
      <div className="w-28 h-28 mx-auto bg-green-100 rounded-full flex items-center justify-center shadow-lg">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-md">
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Inner Component (uses useSearchParams) ───────────────────────────────────

function DonateSuccessInner() {
  const params = useSearchParams();
  const txnId = params.get("txn_id") ?? params.get("txnId") ?? params.get("payment_id") ?? "—";
  const amount = params.get("amount") ?? params.get("amt") ?? "—";

  const today = new Date();
  const dateStr = today.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Green Header */}
          <div className="bg-gradient-to-br from-green-600 to-green-500 p-8 text-center text-white">
            <CheckmarkAnimation />
            <h1 className="text-3xl font-extrabold mt-6 mb-1">
              दान सफल हुआ!
            </h1>
            <p className="text-green-100 text-lg">
              आपका हृदय से आभार
            </p>
            <p className="text-4xl mt-2">🙏</p>
          </div>

          {/* Transaction Details */}
          <div className="p-7">
            <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
              {/* Transaction ID */}
              {txnId !== "—" && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-gray-500 font-medium shrink-0">
                    लेन-देन ID
                  </span>
                  <span className="text-sm font-bold text-gray-800 font-mono break-all text-right">
                    {txnId}
                  </span>
                </div>
              )}

              {/* Amount */}
              {amount !== "—" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    राशि
                  </span>
                  <span className="text-lg font-extrabold text-green-600">
                    ₹{amount}
                  </span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">
                  तिथि
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {dateStr}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">
                  स्थिति
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
                  सफल
                </span>
              </div>
            </div>

            {/* 80G Message */}
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-amber-800 font-semibold text-sm">
                📧 आपका 80G प्रमाणपत्र आपके ईमेल पर भेज दिया गया है।
              </p>
              <p className="text-amber-600 text-xs mt-1">
                यदि ईमेल न मिले तो स्पैम फ़ोल्डर जाँचें।
              </p>
            </div>

            {/* Cow Protection Quote */}
            <div className="mt-5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-center text-white">
              <p className="text-2xl mb-2">🐄</p>
              <p className="font-serif text-base italic leading-relaxed">
                "गावो विश्वस्य मातरः"
              </p>
              <p className="text-orange-100 text-sm mt-1">
                — गाय सम्पूर्ण विश्व की माता है
              </p>
              <p className="text-orange-100 text-xs mt-2">
                आपका दान गोसेवा एवं धर्मरक्षा में सहायक है।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-5 rounded-full text-sm transition-colors"
              >
                🏠 मुख्य पृष्ठ
              </Link>
              <Link
                href="/donate"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-5 rounded-full text-sm transition-all shadow-md hover:shadow-lg"
              >
                ❤️ पुनः दान करें
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Dhyan Foundation Guwahati · NGO Reg. No. — · 80G Approved
        </p>
      </div>
    </div>
  );
}

// ─── Default Export with Suspense ─────────────────────────────────────────────

export default function DonateSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">लोड हो रहा है…</p>
        </div>
      }
    >
      <DonateSuccessInner />
    </Suspense>
  );
}
