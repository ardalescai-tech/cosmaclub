"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Competition = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  startDate: string;
  endDate: string | null;
  entryFee: number;
  maxPlayers: number | null;
  format: string | null;
  status: string;
  _count: { registrations: number };
};

export default function RegisterCompetitionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    fetch(`/api/competitions/${competitionId}`)
      .then((r) => r.json())
      .then((data) => {
        setCompetition(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [competitionId, status, router]);

  const handleRegister = async () => {
    if (!session?.user?.id || !competition) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/competitions/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitionId: competition.id,
          userId: session.user.id,
          notes: notes || null,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Loading...</p>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Competition not found.</p>
      </div>
    );
  }

  if (competition.status !== "OPEN") {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-8 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-4xl mb-3">🔒</p>
          <h2 className="text-xl font-bold text-white mb-2">Registrations closed</h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            This competition is not currently open for registration.
          </p>
          <Link href="/competitions"
            className="block w-full py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            View all competitions
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-8 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">🏆</p>
          <h2 className="text-xl font-bold text-white mb-2">You're registered!</h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            You've successfully registered for {competition.title}. Good luck!
          </p>
          <Link href="/dashboard"
            className="block w-full py-3 rounded-xl text-sm font-medium text-white mb-2"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Go to Dashboard
          </Link>
          <Link href="/competitions"
            className="block w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
            View all competitions
          </Link>
        </div>
      </main>
    );
  }

  const spotsLeft = competition.maxPlayers
    ? competition.maxPlayers - competition._count.registrations
    : null;

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <Link href="/competitions" className="text-sm mb-6 inline-block" style={{ color: "#3865FF" }}>
          ← Back to competitions
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
        <p className="mb-8" style={{ color: "#A0A3B1" }}>Confirm your registration details below.</p>

        {/* Competition info */}
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h3 className="font-semibold text-white mb-3">{competition.title}</h3>
          {competition.description && (
            <p className="text-sm mb-3" style={{ color: "#A0A3B1" }}>{competition.description}</p>
          )}
          <div className="flex flex-col gap-1 text-sm" style={{ color: "#A0A3B1" }}>
            <p>📅 {new Date(competition.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              {competition.endDate ? ` – ${new Date(competition.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}
            </p>
            <p>📍 {competition.location}</p>
            {competition.format && <p>🎾 {competition.format}</p>}
            {spotsLeft !== null && (
              <p>👥 {spotsLeft} of {competition.maxPlayers} spots remaining</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <label className="block text-sm font-medium text-white mb-3">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional information for the organiser..."
            rows={3}
            style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical" }}
          />
        </div>

        {/* Entry fee */}
        <div className="rounded-xl p-6 flex items-center justify-between mb-6"
          style={{ background: "linear-gradient(135deg, rgba(56,101,255,0.2), rgba(123,44,255,0.2))", border: "1px solid rgba(56,101,255,0.3)" }}>
          <div>
            <p className="text-xs" style={{ color: "#A0A3B1" }}>Entry fee</p>
            <p className="text-3xl font-bold text-white">
              {competition.entryFee === 0 ? "Free" : `£${competition.entryFee}`}
            </p>
          </div>
          {competition.entryFee === 0 && (
            <span className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: "rgba(0,212,170,0.15)", color: "#00D4AA" }}>
              No payment required
            </span>
          )}
        </div>

        {error && (
          <p className="text-sm mb-4" style={{ color: "#FF4D6A" }}>{error}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={submitting}
          className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          {submitting ? "Registering..." : competition.entryFee === 0 ? "Register for Free" : `Register — £${competition.entryFee}`}
        </button>
      </section>
    </main>
  );
}