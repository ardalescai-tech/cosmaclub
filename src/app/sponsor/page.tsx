"use client";

import Link from "next/link";
import { useState } from "react";

const tiers = [
  {
    name: "Bronze",
    price: "£100/year",
    value: "BRONZE",
    perks: ["Logo on club website", "Social media mention", "2 free guest passes"],
  },
  {
    name: "Silver",
    price: "£200/year",
    value: "SILVER",
    perks: ["Everything in Bronze", "Logo on club kit", "4 free guest passes", "Newsletter feature"],
  },
  {
    name: "Gold",
    price: "£500+/year",
    value: "GOLD",
    perks: ["Everything in Silver", "Banner at events", "8 free guest passes", "Priority partnership renewal"],
  },
  {
    name: "Equipment Donation",
    price: "In-kind",
    value: "PLATINUM",
    perks: ["Donate equipment instead of money", "Logo on donated equipment", "Social media recognition"],
  },
];

export default function SponsorPage() {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    tier: "SILVER",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.contactName || !form.email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Become a Sponsor</h1>
          <p className="text-gray-600">
            Partner with CosmaClub and support community tennis in Motherwell. Gain visibility while making a real difference.
          </p>
        </div>
      </section>

      {/* TIERS */}
      <section className="px-6 py-10 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sponsorship tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {tiers.map((tier) => (
            <div key={tier.value} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{tier.name}</h3>
                <span className="text-[#185FA5] font-semibold text-sm">{tier.price}</span>
              </div>
              <ul className="space-y-1">
                {tier.perks.map((perk) => (
                  <li key={perk} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✓</span> {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FORM */}
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Application received!</h3>
            <p className="text-green-700 text-sm">We'll be in touch within 3 business days. Thank you for supporting CosmaClub.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Apply to sponsor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Company name *</label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Acme Ltd."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact name *</label>
                <input
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone (optional)</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+44 7700 000000"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Website (optional)</label>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sponsorship tier</label>
                <select
                  name="tier"
                  value={form.tier}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
                >
                  {tiers.map((t) => (
                    <option key={t.value} value={t.value}>{t.name} — {t.price}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">Message (optional)</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us how you'd like to support the club..."
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#185FA5] resize-none h-24"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !form.companyName || !form.contactName || !form.email}
              className="w-full bg-[#185FA5] text-white py-3 rounded-lg font-medium hover:bg-[#0C447C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit application"}
            </button>
          </div>
        )}
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