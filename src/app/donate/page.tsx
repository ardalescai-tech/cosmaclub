"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const presetAmounts = [5, 10, 25, 50];

const impactItems = [
  { amount: 5, description: "Covers a pack of tennis balls for a session", icon: "🎾" },
  { amount: 10, description: "Helps fund a junior's session", icon: "👦" },
  { amount: 25, description: "Contributes to net maintenance", icon: "🏓" },
  { amount: 50, description: "Funds a full open play session", icon: "🏆" },
];

type DonationGoal = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  targetAmount: number;
  raised: number;
};

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<DonationGoal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");

  useEffect(() => {
    fetch("/api/donation-goals")
      .then((r) => r.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handlePreset = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount("");
  };

  const finalAmount = isCustom ? parseFloat(customAmount) : selectedAmount;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) return;
    setLoading(true);
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          message,
          isAnonymous,
          goalId: selectedGoalId || null,
        }),
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
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Support NovaClub</h1>
        <p style={{ color: "#A0A3B1" }}>Every donation goes directly back into the club.</p>
      </section>

      {/* DONATION GOALS */}
      {goals.length > 0 && (
        <section className="px-6 pb-10 max-w-4xl mx-auto">
          <h2 className="font-semibold text-white mb-4">Current Fundraising Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const percent = Math.min(Math.round((goal.raised / goal.targetAmount) * 100), 100);
              return (
                <div key={goal.id} className="rounded-xl p-5"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">{goal.title}</p>
                      {goal.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
                          {goal.category}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#3865FF" }}>{percent}%</span>
                  </div>
                  {goal.description && (
                    <p className="text-xs mb-3" style={{ color: "#A0A3B1" }}>{goal.description}</p>
                  )}
                  <div className="w-full rounded-full h-2 mb-2" style={{ background: "#2A2B3D" }}>
                    <div className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        background: "linear-gradient(90deg, #3865FF, #7B2CFF)",
                      }} />
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: "#6B6E80" }}>
                    <span>£{goal.raised.toFixed(2)} raised</span>
                    <span>£{goal.targetAmount.toFixed(2)} goal</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* DONATION FORM */}
          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-4">Choose an amount</h2>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {presetAmounts.map((amount) => (
                <button key={amount} onClick={() => handlePreset(amount)}
                  className="py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selectedAmount === amount && !isCustom ? "linear-gradient(135deg, #3865FF, #7B2CFF)" : "#13141F",
                    color: selectedAmount === amount && !isCustom ? "#fff" : "#A0A3B1",
                    border: selectedAmount === amount && !isCustom ? "none" : "1px solid #2A2B3D",
                  }}>
                  £{amount}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Or enter a custom amount (£)"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setIsCustom(true); setSelectedAmount(0); }}
              className="w-full px-4 py-3 rounded-xl text-sm mb-4 outline-none"
              style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff" }}
            />

            {goals.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>
                  Donate towards a specific goal (optional)
                </label>
                <select
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff" }}>
                  <option value="">No specific goal</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message (optional)"
              className="w-full px-4 py-3 rounded-xl text-sm mb-4 resize-none outline-none"
              style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", height: "80px" }}
            />

            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" id="anon" checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4" style={{ accentColor: "#3865FF" }} />
              <label htmlFor="anon" className="text-sm" style={{ color: "#A0A3B1" }}>Donate anonymously</label>
            </div>

            <button onClick={handleDonate}
              disabled={!finalAmount || finalAmount < 1 || loading}
              className="w-full py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              {loading ? "Redirecting..." : `Donate ${finalAmount >= 1 ? `£${finalAmount}` : ""}`}
            </button>

            <p className="text-xs text-center mt-3" style={{ color: "#6B6E80" }}>
              Payments processed securely via Stripe.
            </p>
          </div>

          {/* IMPACT */}
          <div>
            <h2 className="font-semibold text-white mb-4">What your donation covers</h2>
            <div className="flex flex-col gap-3">
              {impactItems.map((item) => (
                <div key={item.amount} className="rounded-xl p-4 flex items-center gap-4"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-white">£{item.amount}</p>
                    <p className="text-sm" style={{ color: "#A0A3B1" }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}