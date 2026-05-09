"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = async () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analytics: true, marketing: false }),
    });
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#042C53] border-t border-white/10 px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-white/80 text-sm leading-relaxed">
          We use cookies to improve your experience and understand how the site is used. Your data is never sold.{" "}
          <Link href="/cookies" className="text-white underline hover:text-white/80">
            Cookie Policy
          </Link>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-white/60 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm bg-[#378ADD] text-white rounded-lg hover:bg-[#185FA5] transition-colors font-medium"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}