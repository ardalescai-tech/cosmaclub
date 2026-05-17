"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompetitionRegisterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [competition, setCompetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/competitions/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setCompetition(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleRegister = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/competitions/${params.id}/register`, {
        method: "POST",
      });
      if (res.ok) {
        router.push("/competitions?registered=true");
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

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-lg mx-auto">
        <Link href={`/competitions/${params.id}`}
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: "#A0A3B1" }}>
          ← Back to Competition
        </Link>

        <div className="rounded-xl p-8" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-4xl mb-4">🏆</p>
          <h1 className="text-2xl font-bold text-white mb-2">Register for</h1>
          <p className="text-lg font-semibold mb-1" style={{ color: "#3865FF" }}>{competition.title}</p>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            📍 {competition.location} · {new Date(competition.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <div className="p-4 rounded-xl mb-6" style={{ background: "#13141F", border: "1px solid #2A2B3D" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "#A0A3B1" }}>Entry fee</span>
              <span className="font-bold text-white">
                {competition.entryFee === 0 ? "Free" : `£${competition.entryFee}`}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)" }}>
              <p className="text-sm" style={{ color: "#FF4D6A" }}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleRegister} disabled={submitting}
            className="w-full py-3.5 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {submitting ? "Registering..." : "Confirm Registration"}
          </button>
        </div>
      </section>
    </main>
  );
}