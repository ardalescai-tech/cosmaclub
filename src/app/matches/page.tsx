"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Match = {
  id: string;
  status: string;
  scoreChallenger: number | null;
  scoreOpponent: number | null;
  eloChangeChal: number | null;
  eloChangeOpp: number | null;
  sessionDate: string | null;
  createdAt: string;
  challenger: { userId: string };
  opponent: { userId: string };
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PENDING: { label: "Pending", bg: "rgba(255,184,0,0.15)", color: "#FFB800" },
  ACCEPTED: { label: "Accepted", bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  COMPLETED: { label: "Completed", bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
  DECLINED: { label: "Declined", bg: "rgba(255,77,106,0.15)", color: "#FF4D6A" },
  CANCELLED: { label: "Cancelled", bg: "rgba(107,110,128,0.15)", color: "#6B6E80" },
};

const tabs = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "History", value: "HISTORY" },
];

export default function MatchesPage() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [scoreEntry, setScoreEntry] = useState<{ matchId: string; myScore: string; theirScore: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMatches = () => {
    if (!session?.user?.id) { setLoading(false); return; }
    fetch(`/api/matches?playerId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setMatches(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMatches(); }, [session]);

  const filtered = matches.filter((match) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "UPCOMING") return ["PENDING", "ACCEPTED"].includes(match.status);
    if (activeTab === "HISTORY") return ["COMPLETED", "DECLINED", "CANCELLED"].includes(match.status);
    return true;
  });

  const handleAction = async (matchId: string, action: "accept" | "decline") => {
    await fetch(`/api/matches/${matchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    fetchMatches();
  };

  const handleScoreSubmit = async () => {
    if (!scoreEntry) return;
    const myScore = parseInt(scoreEntry.myScore);
    const theirScore = parseInt(scoreEntry.theirScore);
    if (isNaN(myScore) || isNaN(theirScore)) {
      alert("Please enter valid scores.");
      return;
    }
    setSubmitting(true);
    try {
      const match = matches.find((m) => m.id === scoreEntry.matchId);
      if (!match) return;
      const isChallenger = match.challenger.userId === session?.user?.id;
      const res = await fetch(`/api/matches/${scoreEntry.matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          scoreChallenger: isChallenger ? myScore : theirScore,
          scoreOpponent: isChallenger ? theirScore : myScore,
        }),
      });
      if (res.ok) {
        setScoreEntry(null);
        fetchMatches();
      } else {
        alert("Failed to submit score.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">My Matches</h1>
        <p style={{ color: "#A0A3B1" }}>Track your challenges and results.</p>
      </section>

      {/* Tabs */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.value ? "#3865FF" : "#1A1B2E",
                color: activeTab === tab.value ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {!session ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-white font-semibold mb-2">Sign in to see your matches</p>
            <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>Challenge players and track your ELO progress.</p>
            <Link href="/login"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center py-12" style={{ color: "#A0A3B1" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-4">🎾</p>
            <p className="text-white font-semibold mb-2">No matches found</p>
            <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
              {activeTab === "ALL" ? "Challenge someone from the leaderboard to get started!" : "Nothing in this category yet."}
            </p>
            <Link href="/leaderboard"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              View Leaderboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((match) => {
              const isChallenger = match.challenger.userId === session?.user?.id;
              const myScore = isChallenger ? match.scoreChallenger : match.scoreOpponent;
              const theirScore = isChallenger ? match.scoreOpponent : match.scoreChallenger;
              const myEloChange = isChallenger ? match.eloChangeChal : match.eloChangeOpp;
              const won = myScore !== null && theirScore !== null && myScore > theirScore;
              const status = statusConfig[match.status];
              const isScoreEntry = scoreEntry?.matchId === match.id;

              return (
                <div key={match.id} className="rounded-xl p-5"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                        {match.status === "COMPLETED" && (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: won ? "rgba(0,212,170,0.15)" : "rgba(255,77,106,0.15)",
                              color: won ? "#00D4AA" : "#FF4D6A",
                            }}>
                            {won ? "WIN" : "LOSS"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "#A0A3B1" }}>
                        {isChallenger ? "You challenged" : "Challenge received"} &nbsp;·&nbsp;
                        {match.sessionDate
                          ? new Date(match.sessionDate).toLocaleDateString("en-GB")
                          : new Date(match.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      {/* Completed */}
                      {match.status === "COMPLETED" && myScore !== null && (
                        <>
                          <p className="text-2xl font-bold text-white">{myScore} — {theirScore}</p>
                          {myEloChange !== null && (
                            <p className="text-sm font-medium"
                              style={{ color: myEloChange > 0 ? "#00D4AA" : "#FF4D6A" }}>
                              {myEloChange > 0 ? "+" : ""}{myEloChange} ELO
                            </p>
                          )}
                        </>
                      )}

                      {/* Pending — opponent sees accept/decline */}
                      {match.status === "PENDING" && !isChallenger && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(match.id, "accept")}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                            style={{ background: "#00D4AA" }}>
                            Accept
                          </button>
                          <button onClick={() => handleAction(match.id, "decline")}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ background: "rgba(255,77,106,0.15)", color: "#FF4D6A" }}>
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Accepted — show Enter Score button */}
                      {match.status === "ACCEPTED" && (
                        <button
                          onClick={() => setScoreEntry(
                            isScoreEntry ? null : { matchId: match.id, myScore: "", theirScore: "" }
                          )}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                          {isScoreEntry ? "Cancel" : "Enter Score"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Score entry form */}
                  {isScoreEntry && (
                    <div className="mt-4 pt-4 flex items-center gap-3 flex-wrap"
                      style={{ borderTop: "1px solid #2A2B3D" }}>
                      <div className="flex items-center gap-2">
                        <label className="text-xs" style={{ color: "#A0A3B1" }}>Your score</label>
                        <input
                          type="number" min="0"
                          value={scoreEntry.myScore}
                          onChange={(e) => setScoreEntry({ ...scoreEntry, myScore: e.target.value })}
                          style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "64px", padding: "6px 10px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                        />
                      </div>
                      <span className="text-white font-bold">—</span>
                      <div className="flex items-center gap-2">
                        <label className="text-xs" style={{ color: "#A0A3B1" }}>Their score</label>
                        <input
                          type="number" min="0"
                          value={scoreEntry.theirScore}
                          onChange={(e) => setScoreEntry({ ...scoreEntry, theirScore: e.target.value })}
                          style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "64px", padding: "6px 10px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
                        />
                      </div>
                      <button
                        onClick={handleScoreSubmit}
                        disabled={submitting}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        {submitting ? "Saving..." : "Submit"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}