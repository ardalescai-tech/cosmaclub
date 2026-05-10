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

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  DECLINED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export default function MatchesPage() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

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
    <main className="min-h-screen">
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Match History</h1>
          <p className="text-gray-600">All your matches — pending, completed and past challenges.</p>
        </div>
      </section>

      <section className="px-6 py-10 max-w-4xl mx-auto">
        {!session ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-4">Sign in to see your match history.</p>
            <Link href="/login" className="bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors">
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="text-center text-gray-400 text-sm py-8">Loading...</div>
        ) : matches.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-4">No matches yet. Challenge someone from the leaderboard!</p>
            <Link href="/leaderboard" className="bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors">
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

              return (
                <div key={match.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[match.status]}`}>
                          {match.status}
                        </span>
                        {match.status === "COMPLETED" && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${won ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {won ? "WIN" : "LOSS"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {isChallenger ? "You challenged" : "Challenge received"} &nbsp;·&nbsp;
                        {match.sessionDate
                          ? new Date(match.sessionDate).toLocaleDateString("en-GB")
                          : "No date set"}
                      </p>
                    </div>

                    <div className="text-right">
                      {match.status === "COMPLETED" && myScore !== null ? (
                        <>
                          <p className="text-xl font-semibold text-gray-800">
                            {myScore} — {theirScore}
                          </p>
                          {myEloChange !== null && (
                            <p className={`text-sm font-medium ${myEloChange > 0 ? "text-green-600" : "text-red-600"}`}>
                              {myEloChange > 0 ? "+" : ""}{myEloChange} ELO
                            </p>
                          )}
                        </>
                      ) : match.status === "PENDING" ? (
                        <div className="flex gap-2">
                          {!isChallenger && (
                            <>
                              <button
                                onClick={async () => {
                                  await fetch(`/api/matches/${match.id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ action: "accept" }),
                                  });
                                  window.location.reload();
                                }}
                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700"
                              >
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
                                className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200"
                              >
                                Decline
                              </button>
                            </>
                          )}
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

      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-semibold">NovaClub</p>
            <p className="text-white/50 text-sm">Non-profit community tennis club · Scotland</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
            <Link href="/contact" className="text-white/50 text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}