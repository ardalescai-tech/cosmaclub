"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type SessionData = {
  id: string;
  title: string;
  type: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location: string;
  court: string | null;
  priceStd: number;
  priceMember: number;
  priceJunior: number | null;
  maxPlayers: number | null;
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function BookSessionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [priceType, setPriceType] = useState<"std" | "member" | "junior">("std");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setSessionData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId, status, router]);

  const getNextDateForDay = (dayOfWeek: number) => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === dayOfWeek) {
        days.push(d.toISOString().split("T")[0]);
      }
    }
    return days;
  };

  const handleBook = async () => {
    if (!sessionData || !sessionDate || !session?.user?.id) return;
    setBooking(true);
    const price =
      priceType === "member"
        ? sessionData.priceMember
        : priceType === "junior"
        ? sessionData.priceJunior ?? sessionData.priceStd
        : sessionData.priceStd;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionData.id,
          userId: session.user.id,
          sessionDate,
          priceType,
          price,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Loading...</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Session not found.</p>
      </div>
    );
  }

  const availableDates = getNextDateForDay(sessionData.dayOfWeek);

  if (success) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-8 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-white mb-2">Booking confirmed!</h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            Your spot for {sessionData.title} on {new Date(sessionDate).toLocaleDateString("en-GB")} is reserved.
          </p>
          <Link href="/dashboard"
            className="block w-full py-3 rounded-xl text-sm font-medium text-white mb-2"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Go to Dashboard
          </Link>
          <Link href="/sessions"
            className="block w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
            Book another
          </Link>
        </div>
      </main>
    );
  }

  const price =
    priceType === "member"
      ? sessionData.priceMember
      : priceType === "junior"
      ? sessionData.priceJunior ?? sessionData.priceStd
      : sessionData.priceStd;

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <Link href="/sessions" className="text-sm mb-6 inline-block" style={{ color: "#3865FF" }}>
          ← Back to sessions
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Book Session</h1>
        <p className="mb-8" style={{ color: "#A0A3B1" }}>Confirm your booking details below.</p>

        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h3 className="font-semibold text-white mb-3">{sessionData.title}</h3>
          <div className="flex flex-col gap-1 text-sm" style={{ color: "#A0A3B1" }}>
            <p>📅 {DAY_NAMES[sessionData.dayOfWeek]}s · {sessionData.startTime} – {sessionData.endTime}</p>
            <p>📍 {sessionData.location} {sessionData.court ? `· ${sessionData.court}` : ""}</p>
          </div>
        </div>

        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <label className="block text-sm font-medium text-white mb-3">Choose a date</label>
          <select value={sessionDate} onChange={(e) => setSessionDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff" }}>
            <option value="">Select a date...</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <label className="block text-sm font-medium text-white mb-3">Price type</label>
          <div className="flex flex-col gap-2">
            <button onClick={() => setPriceType("std")}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: priceType === "std" ? "rgba(56,101,255,0.15)" : "#13141F",
                border: priceType === "std" ? "1px solid #3865FF" : "1px solid #2A2B3D",
                color: "#fff",
              }}>
              <span>Standard</span>
              <span className="font-bold">£{sessionData.priceStd}</span>
            </button>
            <button onClick={() => setPriceType("member")}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: priceType === "member" ? "rgba(56,101,255,0.15)" : "#13141F",
                border: priceType === "member" ? "1px solid #3865FF" : "1px solid #2A2B3D",
                color: "#fff",
              }}>
              <span>Member (£25/month)</span>
              <span className="font-bold">{sessionData.priceMember === 0 ? "Free" : `£${sessionData.priceMember}`}</span>
            </button>
            {sessionData.priceJunior !== null && (
              <button onClick={() => setPriceType("junior")}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
                style={{
                  background: priceType === "junior" ? "rgba(56,101,255,0.15)" : "#13141F",
                  border: priceType === "junior" ? "1px solid #3865FF" : "1px solid #2A2B3D",
                  color: "#fff",
                }}>
                <span>Junior (ages 8–16)</span>
                <span className="font-bold">£{sessionData.priceJunior}</span>
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl p-6 flex items-center justify-between mb-6"
          style={{ background: "linear-gradient(135deg, rgba(56,101,255,0.2), rgba(123,44,255,0.2))", border: "1px solid rgba(56,101,255,0.3)" }}>
          <div>
            <p className="text-xs" style={{ color: "#A0A3B1" }}>Total</p>
            <p className="text-3xl font-bold text-white">£{price}</p>
          </div>
        </div>

        <button onClick={handleBook}
          disabled={!sessionDate || booking}
          className="w-full py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          {booking ? "Booking..." : "Confirm Booking"}
        </button>
      </section>
    </main>
  );
}