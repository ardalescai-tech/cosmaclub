import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function HomePage() {
  const [memberCount, sessionCount, competitionCount, coachCount] = await Promise.all([
    prisma.user.count(),
    prisma.playSession.count({ where: { status: "SCHEDULED" } }),
    prisma.competition.count(),
    prisma.coach.count({ where: { isActive: true } }),
  ]);

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      {/* HERO MOBILE */}
<section className="md:hidden relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="/hero-mobile.png"
      alt="Table tennis player"
      className="w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0"
      style={{ background: "linear-gradient(to bottom, rgba(12,13,20,0.1) 0%, rgba(12,13,20,0.6) 50%, rgba(12,13,20,0.98) 100%)" }} />
  </div>
  <div className="relative z-10 px-6 pb-10 pt-32">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
      style={{ background: "rgba(56,101,255,0.15)", border: "1px solid rgba(56,101,255,0.3)", color: "#3865FF" }}>
      🎾 Non-profit · Motherwell, Scotland
    </div>
    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
      Play.<br />Compete.<br />
      <span style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Belong.
      </span>
    </h1>
    <p className="text-base mb-6" style={{ color: "#A0A3B1" }}>
      The next generation community tennis club. Book sessions, challenge players, climb the leaderboard.
    </p>
    <div className="flex gap-3 flex-wrap">
      <Link href="/sessions"
        className="px-5 py-3 rounded-xl font-medium text-white text-sm"
        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
        Book a Session
      </Link>
      <Link href="/competitions"
        className="px-5 py-3 rounded-xl font-medium text-sm"
        style={{ background: "rgba(26,27,46,0.8)", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
        View Competitions
      </Link>
    </div>
  </div>
</section>

      {/* HERO DESKTOP */}
      <section className="hidden md:flex relative min-h-[700px] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero.png"
            alt="Table tennis player"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(12,13,20,0.95) 0%, rgba(12,13,20,0.7) 50%, rgba(12,13,20,0.2) 100%)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(12,13,20,1) 0%, transparent 40%)" }} />
        </div>
        <div className="relative z-10 px-6 py-32 max-w-6xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(56,101,255,0.15)", border: "1px solid rgba(56,101,255,0.3)", color: "#3865FF" }}>
              🎾 Non-profit · Motherwell, Scotland
            </div>
            <h1 className="text-6xl font-bold text-white leading-tight mb-6">
              Play.<br />Compete.<br />
              <span style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Belong.
              </span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "#A0A3B1" }}>
              The next generation community tennis club. Book sessions, challenge players, climb the leaderboard.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/sessions"
                className="px-6 py-3 rounded-xl font-medium text-white"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                Book a Session
              </Link>
              <Link href="/competitions"
                className="px-6 py-3 rounded-xl font-medium"
                style={{ background: "rgba(26,27,46,0.8)", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
                View Competitions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 max-w-6xl mx-auto md:-mt-8 relative z-10 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: memberCount.toString(), label: "Members" },
            { value: sessionCount.toString(), label: "Active Sessions" },
            { value: competitionCount.toString(), label: "Competitions" },
            { value: coachCount.toString(), label: "Coaches" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4 text-center"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: "#A0A3B1" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-4">Everything in one place</h2>
        <p className="text-center mb-12" style={{ color: "#A0A3B1" }}>
          Join, play, improve and compete with players of all levels.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🎾", title: "Book Sessions", desc: "Reserve your spot in weekly open play, junior or social sessions.", href: "/sessions" },
            { icon: "👨‍🏫", title: "Hire a Coach", desc: "One-on-one or group coaching with certified coaches.", href: "/coaches" },
            { icon: "🏆", title: "Competitions", desc: "Enter tournaments for all ages and skill levels.", href: "/competitions" },
            { icon: "📊", title: "Track Progress", desc: "See your stats, match history and climb the leaderboard.", href: "/leaderboard" },
          ].map((item) => (
            <Link key={item.title} href={item.href}
              className="rounded-xl p-6 transition-all hover:scale-105"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm" style={{ color: "#A0A3B1" }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="rounded-2xl p-10 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(56,101,255,0.2), rgba(123,44,255,0.2))", border: "1px solid rgba(56,101,255,0.3)" }}>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take your game to the next level?</h2>
          <p className="mb-8" style={{ color: "#A0A3B1" }}>Join NovaClub today.</p>
          <Link href="/register"
            className="inline-block px-8 py-3 rounded-xl font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Join Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-white">NovaClub</p>
            <p className="text-sm" style={{ color: "#6B6E80" }}>Non-profit community tennis club · Scotland</p>
          </div>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm transition-colors hover:text-white" style={{ color: "#6B6E80" }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}