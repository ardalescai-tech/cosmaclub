"use client";

import Link from "next/link";
import { useState } from "react";

const presetAmounts = [5, 10, 25, 50];

const impactItems = [
  { amount: 5, description: "Covers a pack of tennis balls for a session" },
  { amount: 10, description: "Helps fund a junior's session" },
  { amount: 25, description: "Contributes to net maintenance" },
  { amount: 50, description: "Funds a full open play session for the community" },
];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePreset = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
  };

  const handleCustom = (value: string) => {
    setCustomAmount(value);
    setIsCustom(true);
    setSelectedAmount(0);
  };

  const finalAmount = isCustom ? parseFloat(customAmount) : selectedAmount;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, message, isAnonymous }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-[#0C447C] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#0C447C] font-bold text-sm">CC</span>
          </div>
          <span className="text-white font-semibold text-lg">CosmaClub</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/sessions" className="text-white/80 hover:text-white text-sm">Sessions</Link>
          <Link href="/coaches" className="text-white/80 hover:text-white text-sm">Coaches</Link>
          <Link href="/competitions" className="text-white/80 hover:text-white text-sm">Competitions</Link>
          <Link href="/shop" className="text-white/80 hover:text-white text-sm">Shop</Link>
          <Link href="/donate" className="bg-white text-[#0C447C] px-4 py-2 rounded-lg text-sm font-medium">Donate</Link>
        </div>
      </nav>

      {/* HEADER */}
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Support CosmaClub</h1>
          <p className="text-gray-600">
            Every donation goes directly back into the club — equipment, sessions, and keeping tennis accessible for everyone in the community.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose an amount</h2>

          {/* PRESET AMOUNTS */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePreset(amount)}
                className={`py-3 rounded-lg font-medium text-sm border transition-colors ${
                  selectedAmount === amount && !isCustom
                    ? "bg-[#185FA5] text-white border-[#185FA5]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#185FA5]"
                }`}
              >
                £{amount}
              </button>
            ))}
          </div>

          {/* CUSTOM AMOUNT */}
          <div className="mb-6">
            <input
              type="number"
              placeholder="Or enter a custom amount (£)"
              value={customAmount}
              onChange={(e) => handleCustom(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>

          {/* MESSAGE */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Leave a message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thank you for what you do for the community..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#185FA5] resize-none h-24"
            />
          </div>

          {/* ANONYMOUS */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 accent-[#185FA5]"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">Donate anonymously</label>
          </div>

          {/* DONATE BUTTON */}
          <button
            onClick={handleDonate}
            disabled={!finalAmount || finalAmount < 1 || loading}
            className="w-full bg-[#185FA5] text-white py-3 rounded-lg font-medium hover:bg-[#0C447C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting..." : `Donate ${finalAmount >= 1 ? `£${finalAmount}` : ""}`}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Payments processed securely via Stripe. CosmaClub never stores your card details.
          </p>
        </div>

        {/* IMPACT */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">What your donation covers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {impactItems.map((item) => (
            <div key={item.amount} className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-xl p-4">
              <p className="text-xl font-semibold text-[#0C447C] mb-1">£{item.amount}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-semibold">CosmaClub</p>
            <p className="text-white/50 text-sm">Non-profit community tennis club · Scotland</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
            <Link href="/cookies" className="text-white/50 text-sm hover:text-white">Cookies</Link>
            <Link href="/contact" className="text-white/50 text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}