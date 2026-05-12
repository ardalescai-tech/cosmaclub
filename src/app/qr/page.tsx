"use client";

import { useEffect, useRef } from "react";

const QR_CODES = [
  {
    id: "adult",
    label: "Adult Session",
    price: "£5",
    url: "https://cosmaclub.vercel.app/pay/adult",
    color: "#3865FF",
    emoji: "🎾",
    description: "Scan to pay for an adult session",
  },
  {
    id: "junior",
    label: "Junior Session",
    price: "£3",
    url: "https://cosmaclub.vercel.app/pay/junior",
    color: "#00D4AA",
    emoji: "⭐",
    description: "Scan to pay for a junior session (under 18)",
  },
  {
    id: "register",
    label: "Join NovaClub",
    price: "Free",
    url: "https://cosmaclub.vercel.app/register",
    color: "#7B2CFF",
    emoji: "🏆",
    description: "Scan to become a member",
  },
];

function QRCard({ item }: { item: typeof QR_CODES[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Use QR Server API to generate QR code
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(item.url)}&color=000000&bgcolor=ffffff&margin=10`;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 300, 300);
    };
  }, [item.url]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `novaclub-qr-${item.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

      {/* Header */}
      <div className="p-6 text-center"
        style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`, borderBottom: "1px solid #2A2B3D" }}>
        <span className="text-4xl block mb-2">{item.emoji}</span>
        <h2 className="text-xl font-bold text-white">{item.label}</h2>
        <p className="text-3xl font-bold mt-1" style={{ color: item.color }}>{item.price}</p>
        <p className="text-sm mt-1" style={{ color: "#A0A3B1" }}>{item.description}</p>
      </div>

      {/* QR Code */}
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="rounded-2xl p-3 bg-white">
          <canvas ref={canvasRef} width={300} height={300} style={{ width: "200px", height: "200px", display: "block" }} />
        </div>

        {/* Branding below QR */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              N
            </div>
            <span className="font-semibold text-white text-sm">NovaClub</span>
          </div>
          <p className="text-xs" style={{ color: "#6B6E80" }}>cosmaclub.vercel.app</p>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: `linear-gradient(135deg, ${item.color}, #7B2CFF)` }}>
          Download QR Code
        </button>
      </div>
    </div>
  );
}

export default function QRPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">QR Codes</h1>
          <p style={{ color: "#A0A3B1" }}>Download and print these for the sports hall.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QR_CODES.map((item) => (
            <QRCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 rounded-xl p-5 text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>
            💡 Tip: Download each QR code and print it at A5 or A4 size for best results in the sports hall.
          </p>
        </div>
      </section>
    </main>
  );
}