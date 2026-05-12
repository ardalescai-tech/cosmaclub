"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Stats = {
  elo: number;
  wins: number;
  losses: number;
  rank: number | null;
};

type Match = {
  id: string;
  status: string;
  scoreChallenger: number | null;
  scoreOpponent: number | null;
  eloChangeChal: number | null;
  eloChangeOpp: number | null;
  createdAt: string;
  challenger: { userId: string };
  opponent: { userId: string };
};

type Booking = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  session: { title: string; location: string } | null;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Stats
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const player = data.find((p: any) => p.userId === session?.user?.id);
          setStats(player
            ? { elo: player.elo, wins: player.wins, losses: player.losses, rank: player.rank }
            : { elo: 1000, wins: 0, losses: 0, rank: null }
          );
        }
      })
      .catch(() => setStats({ elo: 1000, wins: 0, losses: 0, rank: null }));

    // Recent matches
    fetch(`/api/matches?playerId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const completed = data
            .filter((m: Match) => m.status === "COMPLETED")
            .slice(0, 3);
          setRecentMatches(completed);
        }
      })
      .catch(console.error);

    // Upcoming booking
    fetch(`/api/bookings?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const upcoming = data
            .filter((b: Booking) => b.status === "CONFIRMED" && new Date(b.date) >= new Date())
            .sort((a: Booking, b: Booking) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
          setUpcomingBooking(upcoming ?? null);
        }
      })
      .catch(console.error);

  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  const totalMatches = stats ? stats.wins + stats.losses : 0;
  const winRate = totalMatches > 0 ? Math.round((stats!.wins / totalMatches) * 100) : null;

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, {session.user?.name?.split(" ")[0]}! 👋
            </h1>
            <p style={{ color: "#A0A3B1" }}>Here's your NovaClub dashboard.</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {session.user?.name?.charAt(0) ?? "?"}
          </div>
        </div>

        {/* Upcoming session banner */}
        {upcomingBooking && (
          <div className="rounded-xl p-5 mb-8 flex items-center justify-between gap-4"
            style={{ background: "rgba(56,101,255,0.1)", border: "1px solid rgba(56,101,255,0.3)" }}>
            <div className="flex items-center gap-4">
              <span className="text-2xl">🎾</span>
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: "#3865FF" }}>Upcoming Session</p>
                <p className="text-white font-semibold">{upcomingBooking.session?.title ?? "Session"}</p>
                <p className="text-xs" style={{ color: "#A0A3B1" }}>
                  {new Date(upcomingBooking.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                  {" · "}{upcomingBooking.startTime} – {upcomingBooking.endTime}
                </p>
              </div>
            </div>
            <Link href="/sessions"
              className="px-4 py-2 rounded-lg text-xs font-medium text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              View Sessions
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "ELO Rating", value: stats?.elo.toString() ?? "1000", sub: "Your rating", icon: "📊" },
            { label: "Matches Played", value: totalMatches.toString(), sub: "Total", icon: "🎾" },
            { label: "Win Rate", value: winRate !== null ? `${winRate}%` : "—", sub: totalMatches > 0 ? `${stats?.wins}W ${stats?.losses}L` : "No matches yet", icon: "📈" },
            { label: "Club Rank", value: stats?.rank ? `#${stats.rank}` : "—", sub: "Play to rank", icon: "🏆" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-5"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs" style={{ color: "#6B6E80" }}>{stat.label}</p>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: "#6B6E80" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick actions */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4">Quick actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Book a Session", desc: "Reserve your spot for the next play session.", href: "/sessions", icon: "🎾" },
                { title: "Find a Coach", desc: "Book a one-to-one coaching session.", href: "/coaches", icon: "👨‍🏫" },
                { title: "Enter a Competition", desc: "Sign up for upcoming tournaments.", href: "/competitions", icon: "🏆" },
                { title: "Challenge a Player", desc: "Start a match and earn ELO points.", href: "/leaderboard", icon: "⚔️" },
              ].map((action) => (
                <Link key={action.title} href={action.href}
                  className="rounded-xl p-4 transition-all hover:scale-105"
                  style={{ background: "#13141F", border: "1px solid #2A2B3D" }}>
                  <span className="text-2xl mb-2 block">{action.icon}</span>
                  <h3 className="font-semibold text-white text-sm mb-1">{action.title}</h3>
                  <p className="text-xs" style={{ color: "#6B6E80" }}>{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Your Profile</h2>
            <div className="rounded-xl p-5" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  {session.user?.name?.charAt(0) ?? "?"}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{session.user?.name}</p>
                  <p className="text-xs" style={{ color: "#6B6E80" }}>{session.user?.email}</p>
                </div>
              </div>
              <div className="pt-4" style={{ borderTop: "1px solid #2A2B3D" }}>
                <Link href="/matches"
                  className="block w-full text-center py-2.5 rounded-xl text-sm font-medium text-white mb-2"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  View My Matches
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-center py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent matches */}
        <h2 className="text-lg font-semibold text-white mb-4">Recent Matches</h2>
        {recentMatches.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">🎾</p>
            <p className="text-white font-semibold mb-1">No matches played yet</p>
            <p className="text-sm mb-4" style={{ color: "#A0A3B1" }}>Challenge a player to get started!</p>
            <Link href="/leaderboard"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              View Leaderboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentMatches.map((match) => {
              const isChallenger = match.challenger.userId === session?.user?.id;
              const myScore = isChallenger ? match.scoreChallenger : match.scoreOpponent;
              const theirScore = isChallenger ? match.scoreOpponent : match.scoreChallenger;
              const myEloChange = isChallenger ? match.eloChangeChal : match.eloChangeOpp;
              const won = myScore !== null && theirScore !== null && myScore > theirScore;

              return (
                <div key={match.id} className="rounded-xl p-5 flex items-center justify-between"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{won ? "🏆" : "😔"}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{won ? "Victory" : "Defeat"}</p>
                      <p className="text-xs" style={{ color: "#6B6E80" }}>
                        {new Date(match.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{myScore} — {theirScore}</p>
                    {myEloChange !== null && (
                      <p className="text-xs font-medium"
                        style={{ color: myEloChange > 0 ? "#00D4AA" : "#FF4D6A" }}>
                        {myEloChange > 0 ? "+" : ""}{myEloChange} ELO
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            <Link href="/matches"
              className="text-center text-sm py-2"
              style={{ color: "#3865FF" }}>
              View all matches →
            </Link>
          </div>
        )}

      </section>
    </main>
  );
}