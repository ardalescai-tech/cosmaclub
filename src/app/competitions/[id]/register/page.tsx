import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  OPEN: { label: "Registrations Open", bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
  UPCOMING: { label: "Coming Soon", bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  CLOSED: { label: "Closed", bg: "rgba(255,77,106,0.15)", color: "#FF4D6A" },
  ONGOING: { label: "Ongoing", bg: "rgba(255,184,0,0.15)", color: "#FFB800" },
  FINISHED: { label: "Finished", bg: "rgba(107,110,128,0.15)", color: "#6B6E80" },
};

export default async function CompetitionDetailPage({ params }: { params: { id: string } }) {
  const competition = await prisma.competition.findUnique({
    where: { id: params.id },
    include: { _count: { select: { registrations: true } } },
  });

  if (!competition) notFound();

  const status = statusConfig[competition.status] ?? statusConfig["UPCOMING"];
  const spotsLeft = competition.maxPlayers
    ? competition.maxPlayers - competition._count.registrations
    : null;

  const categories = competition.categories ?? [];
  const prizes = competition.prizes ?? null;

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/competitions"
          className="inline-flex items-center gap-2 text-sm mb-8"
          style={{ color: "#A0A3B1" }}>
          ← Back to Competitions
        </Link>

        {/* Hero image */}
        {competition.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-8 h-64 md:h-80">
            <img src={competition.imageUrl} alt={competition.title}
              className="w-full h-full object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: status.bg, color: status.color }}>
            {status.label}
          </span>
          {competition.format && (
            <span className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)", color: "#A0A3B1" }}>
              {competition.format}
            </span>
          )}
          {competition.sponsor && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "rgba(255,184,0,0.15)", color: "#FFB800" }}>
              🤝 Sponsored by {competition.sponsor}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{competition.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Description */}
            {competition.description && (
              <div className="rounded-xl p-6"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                  About
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#A0A3B1" }}>
                  {competition.description}
                </p>
              </div>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <div className="rounded-xl p-6"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: string) => (
                    <span key={cat}
                      className="text-sm px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prizes */}
            {prizes && (
              <div className="rounded-xl p-6"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#FFB800" }}>
                  🏆 Prizes
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#A0A3B1" }}>
                  {prizes}
                </p>
              </div>
            )}

            {/* Rules */}
            {competition.rules && (
              <div className="rounded-xl p-6"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                  Rules
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#A0A3B1" }}>
                  {competition.rules}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Entry fee + register */}
            <div className="rounded-xl p-6"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-4xl font-bold text-white mb-1">
                {competition.entryFee === 0 ? "Free" : `£${competition.entryFee}`}
              </p>
              <p className="text-xs mb-4" style={{ color: "#6B6E80" }}>entry fee</p>

              {competition.status === "OPEN" ? (
                <Link href={`/competitions/${competition.id}/register`}
                  className="block w-full py-3 rounded-xl text-sm font-medium text-white text-center"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  Register Now
                </Link>
              ) : (
                <button disabled
                  className="w-full py-3 rounded-xl text-sm font-medium"
                  style={{ background: "#1F2038", color: "#6B6E80", border: "1px solid #2A2B3D" }}>
                  {competition.status === "UPCOMING" ? "Opening Soon" : "Closed"}
                </button>
              )}
            </div>

            {/* Details */}
            <div className="rounded-xl p-6 flex flex-col gap-3"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#3865FF" }}>
                Details
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  <span>📅</span>
                  <span style={{ color: "#A0A3B1" }}>
                    {new Date(competition.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    {competition.endDate
                      ? ` – ${new Date(competition.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                      : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span>📍</span>
                  <span style={{ color: "#A0A3B1" }}>{competition.location}</span>
                </div>
                {spotsLeft !== null && (
                  <div className="flex gap-2">
                    <span>👥</span>
                    <span style={{ color: "#A0A3B1" }}>
                      {spotsLeft} of {competition.maxPlayers} spots left
                    </span>
                  </div>
                )}
                {competition.sponsor && (
                  <div className="flex gap-2">
                    <span>🤝</span>
                    <span style={{ color: "#A0A3B1" }}>{competition.sponsor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t mt-8" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}