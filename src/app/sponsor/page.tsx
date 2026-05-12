"use client";

import { useState } from "react";
import Link from "next/link";

const tiers = [
  {
    name: "Bronze",
    price: "£100/year",
    value: "BRONZE",
    color: "#CD7F32",
    perks: ["Logo on club website", "Social media mention", "2 free guest passes"],
  },
  {
    name: "Silver",
    price: "£200/year",
    value: "SILVER",
    color: "#A0A3B1",
    perks: ["Everything in Bronze", "Logo on club kit", "4 free guest passes", "Newsletter feature"],
  },
  {
    name: "Gold",
    price: "£500+/year",
    value: "GOLD",
    color: "#FFB800",
    perks: ["Everything in Silver", "Banner at events", "8 free guest passes", "Priority partnership renewal"],
  },
  {
    name: "Equipment Donation",
    price: "In-kind",
    value: "PLATINUM",
    color: "#7B2CFF",
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
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.contactName || !form.email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "#13141F",
    border: "1px solid #2A2B3D",
    color: "#fff",
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      {/* Header */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Become a Sponsor</h1>
        <p style={{ color: "#A0A3B1" }}>
          Partner with NovaClub and support community tennis in Motherwell. Gain visibility while making a real difference.
        </p>
      </section>

      {/* Tiers */}
      <section className="px-6 max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Sponsorship tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map((tier) => (
            <div key={tier.value} className="rounded-xl p-5"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">{tier.name}</h3>
                <span className="text-sm font-semibold" style={{ color: tier.color }}>{tier.price}</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {tier.perks.map((perk) => (
                  <li key={perk} className="text-sm flex items-center gap-2" style={{ color: "#A0A3B1" }}>
                    <span style={{ color: "#00D4AA" }}>✓</span> {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        {submitted ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">🎉</p>
            <h3 className="text-xl font-semibold text-white mb-2">Application received!</h3>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>We'll be in touch within 3 business days.</p>
          </div>
        ) : (
          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Apply to sponsor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Company name *</label>
                <input name="companyName" value={form.companyName} onChange={handleChange}
                  placeholder="Acme Ltd." style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Contact name *</label>
                <input name="contactName" value={form.contactName} onChange={handleChange}
                  placeholder="John Smith" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="contact@company.com" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Phone (optional)</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+44 7700 000000" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Website (optional)</label>
                <input name="website" value={form.website} onChange={handleChange}
                  placeholder="https://yourcompany.com" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Sponsorship tier</label>
                <select name="tier" value={form.tier} onChange={handleChange} style={inputStyle}>
                  {tiers.map((t) => (
                    <option key={t.value} value={t.value}>{t.name} — {t.price}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Message (optional)</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Tell us how you'd like to support the club..."
                rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            {error && (
              <p className="text-sm mb-4" style={{ color: "#FF4D6A" }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !form.companyName || !form.contactName || !form.email}
              className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              {loading ? "Submitting..." : "Submit application"}
            </button>
          </div>
        )}
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
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