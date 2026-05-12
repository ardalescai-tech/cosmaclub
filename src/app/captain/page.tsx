"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type MatchPlayer = {
  userId: string;
  user?: { name: string | null };
  elo: number;
};

type Match = {
  id: string;
  status: string;
  scoreChallenger: number | null;
  scoreOpponent: number | null;
  sessionDate: string | null;
  createdAt: string;
  challenger: MatchPlayer;
  opponent: MatchPlayer;
};

export default function CaptainPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoreEntry, setScoreEntry] = useState<{
    matchId: string;
    chalScore: string;
    oppScore: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchMatches();
    }
  }, [status]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/captain/matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScore = async () => {
    if (!scoreEntry) return;
    const chalScore = parseInt(scoreEntry.chalScore);
    const oppScore = parseInt(scoreEntry.oppScore);
    if (isNaN(chalScore) || isNaN(oppScore)) {
      alert("Please enter valid scores.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/matches/${scoreEntry.matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          scoreChallenger: chalScore,
          scoreOpponent: oppScore,
        }),
      });
      if (res.ok) {
        setScoreEntry(null);
        fetchMatches();
      } else {
        alert("Failed to submit score.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const role = (session?.user as any)?.role;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Loading...</p>
      </div>
    );
  }

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            ⚖️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Captain Panel</h1>
            <p style={{ color: "#A0A3B1" }}>
              Welcome, {session?.user?.name?.split(" ")[0]} — enter match scores below.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="rounded-xl p-5 mb-8 flex items-center gap-6"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <div>
            <p className="text-xs mb-1" style={{ color: "#A0A3B1" }}>Awaiting Score</p>
            <p className="text-2xl font-bold text-white">{matches.length}</p>
          </div>
          <div style={{ width: "1px", height: "40px", background: "#2A2B3D" }} />
          <div>
            <p className="text-xs mb-1" style={{ color: "#A0A3B1" }}>Your Role</p>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
              {role}
            </span>
          </div>
        </div>

        {/* Matches */}
        {loading ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p style={{ color: "#A0A3B1" }}>Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">✅</p>
            <p className="text-white font-semibold mb-1">No matches awaiting scores</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>All accepted matches have been scored.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {matches.map((match) => {
              const isScoreEntry = scoreEntry?.matchId === match.id;
              const chalName = match.challenger.user?.name ?? "Player 1";
              const oppName = match.opponent.user?.name ?? "Player 2";

              return (
                <div key={match.id} className="rounded-xl p-5"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
                        ACCEPTED
                      </span>
                      <span className="text-xs" style={{ color: "#6B6E80" }}>
                        {match.sessionDate
                          ? new Date(match.sessionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                          : new Date(match.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <button
                      onClick={() => setScoreEntry(
                        isScoreEntry ? null : { matchId: match.id, chalScore: "", oppScore: "" }
                      )}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                      style={{ background: isScoreEntry ? "#2A2B3D" : "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                      {isScoreEntry ? "Cancel" : "Enter Score"}
                    </button>
                  </div>

                  {/* Players */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        {chalName.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{chalName}</p>
                        <p className="text-xs" style={{ color: "#6B6E80" }}>ELO {match.challenger.elo}</p>
                      </div>
                    </div>

                    <div className="text-lg font-bold" style={{ color: "#A0A3B1" }}>VS</div>

                    <div className="flex-1 flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="text-white font-medium text-sm">{oppName}</p>
                        <p className="text-xs" style={{ color: "#6B6E80" }}>ELO {match.opponent.elo}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #7B2CFF, #3865FF)" }}>
                        {oppName.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                    </div>
                  </div>

                  {/* Score entry */}
                  {isScoreEntry && (
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid #2A2B3D" }}>
                      <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                        Enter Final Score
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-xs mb-1 truncate" style={{ color: "#A0A3B1" }}>{chalName}</p>
                          <input
                            type="number" min="0"
                            value={scoreEntry.chalScore}
                            onChange={(e) => setScoreEntry({ ...scoreEntry, chalScore: e.target.value })}
                            placeholder="0"
                            style={{
                              background: "#13141F", border: "1px solid #2A2B3D", color: "#fff",
                              width: "100%", padding: "10px 16px", borderRadius: "8px",
                              fontSize: "20px", outline: "none", textAlign: "center", fontWeight: "bold"
                            }}
                          />
                        </div>
                        <span className="text-white font-bold text-xl">—</span>
                        <div className="flex-1">
                          <p className="text-xs mb-1 truncate" style={{ color: "#A0A3B1" }}>{oppName}</p>
                          <input
                            type="number" min="0"
                            value={scoreEntry.oppScore}
                            onChange={(e) => setScoreEntry({ ...scoreEntry, oppScore: e.target.value })}
                            placeholder="0"
                            style={{
                              background: "#13141F", border: "1px solid #2A2B3D", color: "#fff",
                              width: "100%", padding: "10px 16px", borderRadius: "8px",
                              fontSize: "20px", outline: "none", textAlign: "center", fontWeight: "bold"
                            }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleSubmitScore}
                        disabled={submitting || !scoreEntry.chalScore || !scoreEntry.oppScore}
                        className="w-full mt-4 py-3 rounded-xl font-medium text-white disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        {submitting ? "Confirming..." : "Confirm Score"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}