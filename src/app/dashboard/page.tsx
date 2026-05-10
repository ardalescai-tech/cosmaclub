"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-10 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, {session.user?.name?.split(" ")[0]}! 👋
            </h1>
            <p style={{ color: "#A0A3B1" }}>Here's your NovaClub dashboard.</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {session.user?.name?.charAt(0) ?? "?"}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "ELO Rating", value: "1000", sub: "Starting rating", icon: "📊" },
            { label: "Matches Played", value: "0", sub: "This month", icon: "🎾" },
            { label: "Win Rate", value: "—", sub: "No matches yet", icon: "📈" },
            { label: "Club Rank", value: "—", sub: "Play to rank", icon: "🏆" },
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
          {/* QUICK ACTIONS */}
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

          {/* UPCOMING SESSION */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Upcoming Session</h2>
            <div className="rounded-xl p-5" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
                  Open Play
                </span>
              </div>
              <p className="font-semibold text-white mb-1">Open Play — Adults</p>
              <p className="text-sm mb-1" style={{ color: "#A0A3B1" }}>Today · 18:00</p>
              <p className="text-xs mb-4" style={{ color: "#6B6E80" }}>Braidhurst Sports Hall</p>

              <div className="text-center p-4 rounded-lg mb-4" style={{ background: "#13141F" }}>
                <p className="text-xs mb-1" style={{ color: "#6B6E80" }}>Starts in</p>
                <p className="text-2xl font-bold" style={{ color: "#3865FF" }}>02 : 15 : 30</p>
              </div>

              <Link href="/sessions"
                className="block w-full text-center py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                View Sessions
              </Link>
            </div>
          </div>
        </div>

        {/* RECENT MATCHES */}
        <h2 className="text-lg font-semibold text-white mb-4">Recent matches</h2>
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
      </section>
    </main>
  );
}