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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="px-6 py-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Welcome back, {session.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 text-sm mb-8">Here's your NovaClub dashboard.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "ELO Rating", value: "1000", sub: "Starting rating" },
            { label: "Matches Played", value: "0", sub: "This month" },
            { label: "Win Rate", value: "—", sub: "No matches yet" },
            { label: "Club Rank", value: "—", sub: "Play to rank" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-[#0C447C]">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: "Book a Session", desc: "Reserve your spot for the next play session.", href: "/sessions", btn: "View Sessions" },
            { title: "Find a Coach", desc: "Book a one-to-one coaching session.", href: "/coaches", btn: "View Coaches" },
            { title: "Enter a Competition", desc: "Sign up for upcoming tournaments.", href: "/competitions", btn: "View Competitions" },
          ].map((action) => (
            <div key={action.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{action.desc}</p>
              <Link href={action.href} className="inline-block bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors">
                {action.btn}
              </Link>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent matches</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
          <p className="text-gray-400 text-sm">No matches played yet.</p>
          <p className="text-gray-400 text-sm mt-1">Challenge a player to get started!</p>
          <Link href="/leaderboard" className="inline-block mt-4 bg-[#E6F1FB] text-[#0C447C] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#B5D4F4] transition-colors">
            View Leaderboard
          </Link>
        </div>
      </section>
    </main>
  );
}