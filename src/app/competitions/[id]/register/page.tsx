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
  const id = params.id as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/competitions/${id}`)
      .then((r) => r.json())
      .then((data) => { setCompetition(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/competitions/${id}/register`, {
        method: "POST",
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "#A0A3B1" }}>Loading...</p>
      </main>
    );
  }

  if (!competition) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "#FF4D6A" }}>Competition not found.</p>
      </main>
    );
  }

  if (success) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-10 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold text-white mb-2">You're registered!</h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            You've successfully registered for {competition.title}.
          </p>
          <Link href="/competitions"
            className="block w-full py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Back to Competitions
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-lg mx-auto">
        <Link href="/competitions"
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: "#A0A3B1" }}>
          ← Back to Competitions
        </Link>

        <div className="rounded-xl p-8" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-4xl mb-4">🏆</p>
          <h1 className="text-2xl font-bold text-white mb-2">Register for</h1>
          <p className="text-lg font-semibold mb-1" style={{ color: "#3865FF" }}>{competition.title}</p>
          <p className="text-sm mb-2" style={{ color: "#A0A3B1" }}>
            📍 {competition.location}
          </p>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            📅 {new Date(competition.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div className="p-4 rounded-xl mb-6" style={{ background: "#13141F", border: "1px solid #2A2B3D" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#A0A3B1" }}>Entry fee</span>
              <span className="font-bold text-white">
                {competition.entryFee === 0 ? "Free" : `£${competition.entryFee}`}
              </span>
            </div>
          </div>

          {!session && (
            <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(56,101,255,0.1)", border: "1px solid rgba(56,101,255,0.3)" }}>
              <p className="text-sm" style={{ color: "#3865FF" }}>⚠ You need to be logged in to register.</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)" }}>
              <p className="text-sm" style={{ color: "#FF4D6A" }}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleRegister} disabled={submitting || status === "loading"}
            className="w-full py-3.5 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {submitting ? "Registering..." : "Confirm Registration"}
          </button>
        </div>
      </section>
    </main>
  );
}