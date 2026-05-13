"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Opponent = {
  id: string;
  name: string | null;
  email: string;
  player: { elo: number; wins: number; losses: number } | null;
};

export default function ChallengePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const opponentUserId = params.id as string;

  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      if (session?.user?.id === opponentUserId) { router.push("/leaderboard"); return; }
      fetchOpponent();
    }
  }, [status, session]);

  const fetchOpponent = async () => {
    try {
      const res = await fetch(`/api/users/${opponentUserId}`);
      if (res.ok) setOpponent(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) { setError("Please select a date and time."); return; }
    setSubmitting(true);
    setError("");
    try {
      const sessionDate = new Date(`${selectedDate}T${selectedTime}`).toISOString();
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengerId: session?.user?.id,
          opponentId: opponentUserId,
          sessionDate,
        }),
      });
      if (res.ok) { setSubmitted(true); }
      else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (e) { setError("Network error."); }
    finally { setSubmitting(false); }
  };

  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  const timeSlots = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

  if (submitted) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-10 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">⚔️</p>
          <h2 className="text-xl font-bold text-white mb-2">Challenge sent!</h2>
          <p className="text-sm mb-2" style={{ color: "#A0A3B1" }}>
            Your challenge has been sent to {opponent?.name ?? "your opponent"}.
          </p>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            Proposed: {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long"
            })} at {selectedTime}
          </p>
          <Link href="/matches"
            className="block w-full py-3 rounded-xl text-sm font-medium text-white mb-2"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            View My Matches
          </Link>
          <Link href="/leaderboard"
            className="block w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
            Back to Leaderboard
          </Link>
        </div>
      </main>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
      <p style={{ color: "#A0A3B1" }}>Loading...</p>
    </div>
  );

  if (!opponent) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
      <p style={{ color: "#A0A3B1" }}>Player not found.</p>
    </div>
  );

  const initials = opponent.name?.split(" ").map((n) => n[0]).join("") ?? "?";
  const totalMatches = (opponent.player?.wins ?? 0) + (opponent.player?.losses ?? 0);
  const winRate = totalMatches > 0 ? Math.round(((opponent.player?.wins ?? 0) / totalMatches) * 100) : null;

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <Link href="/leaderboard" className="text-sm mb-6 inline-block" style={{ color: "#A0A3B1" }}>
          ← Back to leaderboard
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Send a Challenge</h1>
          <p style={{ color: "#A0A3B1" }}>Propose a match date and time.</p>
        </div>

        {/* Opponent card */}
        <div className="rounded-xl p-5 mb-6 flex items-center gap-4"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{opponent.name ?? "Unknown"}</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs" style={{ color: "#3865FF" }}>ELO {opponent.player?.elo ?? 1000}</span>
              <span className="text-xs" style={{ color: "#A0A3B1" }}>{opponent.player?.wins ?? 0}W · {opponent.player?.losses ?? 0}L</span>
              {winRate !== null && <span className="text-xs" style={{ color: "#A0A3B1" }}>{winRate}% win rate</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{opponent.player?.elo ?? 1000}</p>
            <p className="text-xs" style={{ color: "#6B6E80" }}>ELO</p>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

          {/* Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">Proposed date *</label>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
              <option value="">Select a date...</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">Proposed time *</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button key={time} onClick={() => setSelectedTime(time)}
                  className="py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selectedTime === time ? "rgba(56,101,255,0.2)" : "#13141F",
                    border: selectedTime === time ? "1px solid #3865FF" : "1px solid #2A2B3D",
                    color: selectedTime === time ? "#3865FF" : "#A0A3B1",
                  }}>
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="rounded-xl p-4 mb-6"
              style={{ background: "rgba(56,101,255,0.1)", border: "1px solid rgba(56,101,255,0.3)" }}>
              <p className="text-sm text-white">
                ⚔️ Challenge <strong>{opponent.name}</strong> on{" "}
                <strong>{new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</strong> at <strong>{selectedTime}</strong>
              </p>
            </div>
          )}

          {error && <p className="text-sm mb-4" style={{ color: "#FF4D6A" }}>{error}</p>}

          <button onClick={handleSubmit} disabled={submitting || !selectedDate || !selectedTime}
            className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {submitting ? "Sending..." : "Send Challenge ⚔️"}
          </button>
        </div>
      </section>
    </main>
  );
}