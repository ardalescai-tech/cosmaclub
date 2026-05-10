import Link from "next/link";

const competitions = [
  {
    id: "1",
    title: "Summer Club Championship 2025",
    format: "Singles",
    description: "Our annual summer singles championship. Round robin group stage followed by knockout rounds.",
    location: "Braidhurst Sports Hall, Motherwell",
    date: "12 Jul – 14 Jul 2025",
    entryFee: 5,
    maxPlayers: 32,
    spotsLeft: 14,
    status: "OPEN",
    prize: "Trophy + £100",
  },
  {
    id: "2",
    title: "Junior Tournament — U14",
    format: "Singles U14",
    description: "A fun and competitive tournament for junior players under 14. All abilities welcome.",
    location: "Braidhurst Sports Hall, Motherwell",
    date: "5 Aug 2025",
    entryFee: 3,
    maxPlayers: 16,
    spotsLeft: 9,
    status: "OPEN",
    prize: "Medal + Certificate",
  },
  {
    id: "3",
    title: "Mixed Doubles Social Cup",
    format: "Mixed Doubles",
    description: "A relaxed mixed doubles competition. Partners assigned randomly on the day.",
    location: "Braidhurst Sports Hall, Motherwell",
    date: "20 Sep 2025",
    entryFee: 4,
    maxPlayers: 24,
    spotsLeft: 24,
    status: "UPCOMING",
    prize: "Trophy",
  },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  OPEN: { label: "Registrations Open", bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
  UPCOMING: { label: "Coming Soon", bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  CLOSED: { label: "Closed", bg: "rgba(255,77,106,0.15)", color: "#FF4D6A" },
};

const tabs = ["All", "Upcoming", "Ongoing", "Completed"];

export default function CompetitionsPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Competitions</h1>
        <p style={{ color: "#A0A3B1" }}>Join tournaments and show your skills.</p>
      </section>

      {/* TABS */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === "All" ? "#3865FF" : "#1A1B2E",
                color: tab === "All" ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          {competitions.map((comp) => {
            const status = statusConfig[comp.status];
            return (
              <div key={comp.id} className="rounded-xl p-6"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#A0A3B1" }}>
                        {comp.format}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{comp.title}</h3>
                    <p className="text-sm mb-4" style={{ color: "#A0A3B1" }}>{comp.description}</p>

                    <div className="flex flex-col gap-1 text-sm" style={{ color: "#A0A3B1" }}>
                      <p>📅 {comp.date}</p>
                      <p>📍 {comp.location}</p>
                      <p>👥 {comp.spotsLeft} of {comp.maxPlayers} spots available</p>
                      <p>🏆 Prize: {comp.prize}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-3xl font-bold text-white">
                        {comp.entryFee === 0 ? "Free" : `£${comp.entryFee}`}
                      </p>
                      <p className="text-xs" style={{ color: "#6B6E80" }}>entry fee</p>
                    </div>

                    {comp.status === "OPEN" ? (
                      <Link href={`/competitions/${comp.id}/register`}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        Register Now
                      </Link>
                    ) : (
                      <button disabled
                        className="px-6 py-2.5 rounded-xl text-sm font-medium"
                        style={{ background: "#1F2038", color: "#6B6E80", border: "1px solid #2A2B3D" }}>
                        Opening Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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