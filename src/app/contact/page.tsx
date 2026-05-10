"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
        <p style={{ color: "#A0A3B1" }}>Get in touch with the NovaClub team.</p>
      </section>

      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* INFO */}
          <div>
            <h2 className="font-semibold text-white mb-6">Get in touch</h2>
            <div className="flex flex-col gap-4">
              {[
                { icon: "📍", title: "Venue", value: "Braidhurst High School Sports Hall\nMotherwell, Scotland" },
                { icon: "✉️", title: "Email", value: "hello@novaclub.org" },
                { icon: "🕐", title: "Session days", value: "Check the sessions page for current schedule" },
                { icon: "🎾", title: "About", value: "Non-profit community tennis club serving Motherwell." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 rounded-xl"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium text-white text-sm">{item.title}</p>
                    <p className="text-sm mt-0.5 whitespace-pre-line" style={{ color: "#A0A3B1" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div>
            {submitted ? (
              <div className="rounded-xl p-8 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <p className="text-4xl mb-3">✅</p>
                <h3 className="font-semibold text-white mb-2">Message sent!</h3>
                <p className="text-sm" style={{ color: "#A0A3B1" }}>We'll get back to you within 2 business days.</p>
              </div>
            ) : (
              <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <h2 className="font-semibold text-white mb-4">Send a message</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff" }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff" }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff" }}>
                      <option value="">Select a subject</option>
                      <option value="general">General enquiry</option>
                      <option value="membership">Membership</option>
                      <option value="sessions">Sessions & bookings</option>
                      <option value="coaching">Coaching</option>
                      <option value="sponsorship">Sponsorship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", height: "100px" }} />
                  </div>
                  <button onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message || loading}
                    className="w-full py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                    {loading ? "Sending..." : "Send message"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}