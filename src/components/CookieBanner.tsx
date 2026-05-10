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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4"
      style={{ background: "#13141F", borderTop: "1px solid #2A2B3D" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm leading-relaxed" style={{ color: "#A0A3B1" }}>
          We use cookies to improve your experience. Your data is never sold.{" "}
          <Link href="/cookies" style={{ color: "#3865FF" }}>Cookie Policy</Link>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={handleDecline}
            className="px-4 py-2 text-sm rounded-xl transition-all"
            style={{ background: "#1A1B2E", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
            Decline
          </button>
          <button onClick={handleAccept}
            className="px-4 py-2 text-sm rounded-xl font-medium text-white transition-all"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}