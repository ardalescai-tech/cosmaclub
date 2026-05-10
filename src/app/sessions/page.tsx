import Link from "next/link";
import { prisma } from "@/lib/prisma";

const typeColors: Record<string, string> = {
  OPEN_PLAY: "#3865FF",
  JUNIOR: "#00D4AA",
  SOCIAL: "#7B2CFF",
  COACHED: "#FFB800",
};

const typeLabels: Record<string, string> = {
  OPEN_PLAY: "Open Play",
  JUNIOR: "Junior",
  SOCIAL: "Social",
  COACHED: "Coached",
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function SessionsPage() {
  const sessions = await prisma.playSession.findMany({
    where: { status: "SCHEDULED" },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    include: {
      _count: {
        select: {
          bookings: {
            where: { status: { in: ["PENDING", "CONFIRMED"] } },
          },
        },
      },
    },
  });

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Sessions</h1>
        <p style={{ color: "#A0A3B1" }}>
          Book your spot in weekly sessions at Braidhurst Sports Hall, Motherwell.
        </p>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Standard price", value: "From £5", sub: "per session" },
            { label: "Member price", value: "From £0", sub: "£25/month membership" },
            { label: "Junior price", value: "From £3", sub: "ages 8–16" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl p-5 text-center"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-sm mb-1" style={{ color: "#A0A3B1" }}>{item.label}</p>
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-xs mt-1" style={{ color: "#6B6E80" }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {sessions.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">🎾</p>
            <p className="text-white font-semibold mb-2">No sessions scheduled yet</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Check back soon — sessions will be added shortly.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((session) => {
              const spotsLeft = session.maxPlayers
                ? session.maxPlayers - session._count.bookings
                : null;

              return (
                <div key={session.id} className="rounded-xl p-6"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: `${typeColors[session.type]}20`,
                            color: typeColors[session.type],
                          }}>
                          {typeLabels[session.type]}
                        </span>
                        {spotsLeft !== null && (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: spotsLeft <= 4 ? "rgba(255,77,106,0.15)" : "rgba(0,212,170,0.15)",
                              color: spotsLeft <= 4 ? "#FF4D6A" : "#00D4AA",
                            }}>
                            {spotsLeft} spots left
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{session.title}</h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm" style={{ color: "#A0A3B1" }}>
                          📅 {DAY_NAMES[session.dayOfWeek]}s &nbsp;·&nbsp; 🕐 {session.startTime} – {session.endTime}
                        </p>
                        <p className="text-sm" style={{ color: "#A0A3B1" }}>
                          📍 {session.location} {session.court ? `· ${session.court}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <div className="text-left md:text-right">
                        <p className="text-3xl font-bold text-white">£{session.priceStd}</p>
                        <p className="text-xs" style={{ color: "#A0A3B1" }}>standard / person</p>
                        <p className="text-sm font-medium mt-1" style={{ color: "#3865FF" }}>
                          Members: {session.priceMember === 0 ? "Free" : `£${session.priceMember}`}
                        </p>
                      </div>
                      <Link href={`/book/${session.id}`}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        Book Now
                      </Link>
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