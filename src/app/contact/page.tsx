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
    <main className="min-h-screen">
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Contact Us</h1>
          <p className="text-gray-600">Get in touch with the NovaClub team.</p>
        </div>
      </section>

      <section className="px-6 py-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Get in touch</h2>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E6F1FB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Venue</p>
                  <p className="text-gray-500 text-sm">Braidhurst High School Sports Hall<br />Motherwell, Scotland</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E6F1FB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✉️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Email</p>
                  <a href="mailto:hello@novaclub.org" className="text-[#185FA5] text-sm hover:underline">hello@novaclub.org</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E6F1FB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🕐</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Session days</p>
                  <p className="text-gray-500 text-sm">Check the sessions page for current schedule</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-[#E6F1FB] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎾</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">About the club</p>
                  <p className="text-gray-500 text-sm">Non-profit community tennis club serving Motherwell and the surrounding area.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <p className="text-4xl mb-3">✅</p>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Message sent!</h3>
                <p className="text-green-700 text-sm">We'll get back to you within 2 business days.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Send a message</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]">
                      <option value="">Select a subject</option>
                      <option value="general">General enquiry</option>
                      <option value="membership">Membership</option>
                      <option value="sessions">Sessions & bookings</option>
                      <option value="coaching">Coaching</option>
                      <option value="sponsorship">Sponsorship</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#185FA5] resize-none h-28" />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message || loading}
                    className="w-full bg-[#185FA5] text-white py-3 rounded-lg font-medium hover:bg-[#0C447C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send message"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-semibold">NovaClub</p>
            <p className="text-white/50 text-sm">Non-profit community tennis club · Scotland</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
            <Link href="/cookies" className="text-white/50 text-sm hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}