import Link from "next/link";

export default function DonateCallout() {
  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #FF6B00 0%, #FF8C00 40%, #3a8f6a 75%, #2D6A4F 100%)",
      }}
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "white", transform: "translate(-40%, -40%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "white", transform: "translate(40%, 40%)" }}
      />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        {/* 80G badge */}
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/40 text-sm font-semibold"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <span className="text-base">🏆</span>
            <span>80G Registered · Tax Benefits Available</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Every Rupee{" "}
          <span
            className="relative inline-block"
            style={{
              background: "rgba(255,255,255,0.25)",
              borderRadius: "12px",
              padding: "0 12px",
            }}
          >
            Saves a Cow
          </span>
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your donation ensures cows are rescued, fed, and cared for. Contributions
          are eligible for{" "}
          <strong className="text-white underline decoration-dotted">
            80G tax deduction
          </strong>
          .
        </p>

        {/* What your money does */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          {[
            { amount: "₹500", impact: "Feeds a cow for a week" },
            { amount: "₹2,500", impact: "Monthly care for one cow" },
            { amount: "₹10,000", impact: "Full rescue operation" },
          ].map((item) => (
            <div
              key={item.amount}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <div className="text-2xl font-extrabold mb-1">{item.amount}</div>
              <div className="text-white/80 text-sm">{item.impact}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/donate"
            className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg shadow-2xl bg-white hover:bg-orange-50 transition-all duration-300 hover:scale-105"
            style={{ color: "#FF6B00" }}
          >
            <span>Donate Once</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/donate?type=monthly"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-green-800 transition-all duration-300 hover:scale-105"
          >
            <span>Donate Monthly</span>
            <span className="text-sm opacity-75">♻</span>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">🔒</span>
            <span>Secure Payment</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <span className="text-base">📄</span>
            <span>Instant 80G Certificate</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            <span>Registered NGO</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <span>Transparent Usage</span>
          </div>
        </div>
      </div>
    </section>
  );
}
