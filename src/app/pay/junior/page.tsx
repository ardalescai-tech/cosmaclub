"use client";

import Link from "next/link";

export default function PayJuniorPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            N
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">NovaClub</h1>
          <p style={{ color: "#A0A3B1" }}>Motherwell Community Tennis</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 mb-4"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <div className="text-center mb-6">
            <span className="text-5xl">⭐</span>
            <h2 className="text-xl font-bold text-white mt-3 mb-1">Junior Session</h2>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Pay for your court session (under 18)</p>
          </div>

          <div className="rounded-xl p-5 mb-6 text-center"
            style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(56,101,255,0.15))", border: "1px solid rgba(0,212,170,0.3)" }}>
            <p className="text-xs mb-1" style={{ color: "#A0A3B1" }}>Session fee</p>
            <p className="text-5xl font-bold text-white">£3</p>
            <p className="text-xs mt-1" style={{ color: "#A0A3B1" }}>per session · junior (under 18)</p>
          </div>

          <div className="flex flex-col gap-2 mb-6 text-sm" style={{ color: "#A0A3B1" }}>
            {["Access to all courts during session", "Equipment available on request", "Junior coaching available separately", "Must be accompanied by adult if under 12"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span style={{ color: "#00D4AA" }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            disabled
            className="w-full py-4 rounded-xl font-semibold text-white text-lg opacity-70"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Pay £3 — Coming Soon
          </button>
          <p className="text-xs text-center mt-3" style={{ color: "#6B6E80" }}>
            Online payments coming soon. Please pay at the desk.
          </p>
        </div>

        <div className="text-center">
          <Link href="/register"
            className="text-sm" style={{ color: "#3865FF" }}>
            Not a member yet? Join NovaClub →
          </Link>
        </div>
      </div>
    </main>
  );
}