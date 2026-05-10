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

const tabs = ["All", "Upcoming", "History"];

export default function MatchesPage() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/matches?playerId=${session.user.id}`)
        .then((r) => r.json())
        .then((data) => {
          setMatches(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">My Matches</h1>
        <p style={{ color: "#A0A3B1" }}>Track your challenges and results.</p>
      </section>

      {/* TABS */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? "#3865FF" : "#1A1B2E",
                color: activeTab === tab ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {tab}
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
        ) : matches.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-4">🎾</p>
            <p className="text-white font-semibold mb-2">No matches yet</p>
            <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>Challenge someone from the leaderboard to get started!</p>
            <Link href="/leaderboard"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              View Leaderboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {matches.map((match) => {
              const isChallenger = match.challenger.userId === session?.user?.id;
              const myScore = isChallenger ? match.scoreChallenger : match.scoreOpponent;
              const theirScore = isChallenger ? match.scoreOpponent : match.scoreChallenger;
              const myEloChange = isChallenger ? match.eloChangeChal : match.eloChangeOpp;
              const won = myScore !== null && theirScore !== null && myScore > theirScore;
              const status = statusConfig[match.status];

              return (
                <div key={match.id} className="rounded-xl p-5"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                          : "No date set"}
                      </p>
                    </div>

                    <div className="text-right">
                      {match.status === "COMPLETED" && myScore !== null ? (
                        <>
                          <p className="text-2xl font-bold text-white">{myScore} — {theirScore}</p>
                          {myEloChange !== null && (
                            <p className="text-sm font-medium" style={{ color: myEloChange > 0 ? "#00D4AA" : "#FF4D6A" }}>
                              {myEloChange > 0 ? "+" : ""}{myEloChange} ELO
                            </p>
                          )}
                        </>
                      ) : match.status === "PENDING" && !isChallenger ? (
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              await fetch(`/api/matches/${match.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ action: "accept" }),
                              });
                              window.location.reload();
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                            style={{ background: "#00D4AA" }}>
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              await fetch(`/api/matches/${match.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ action: "decline" }),
                              });
                              window.location.reload();
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{ background: "rgba(255,77,106,0.15)", color: "#FF4D6A" }}>
                            Decline
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
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