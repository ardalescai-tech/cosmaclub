import Link from "next/link";

const sessions = [
  {
    id: "1",
    title: "Open Play — Adults",
    type: "Open Play",
    day: "Mondays",
    time: "18:00 – 20:00",
    location: "Braidhurst Sports Hall · Court 1 & 2",
    priceStd: 6,
    priceMember: 4,
    spotsLeft: 8,
    maxPlayers: 20,
  },
  {
    id: "2",
    title: "Junior Session",
    type: "Junior",
    day: "Wednesdays",
    time: "16:00 – 17:30",
    location: "Braidhurst Sports Hall · Court 3",
    priceStd: 5,
    priceMember: 3,
    spotsLeft: 4,
    maxPlayers: 12,
  },
  {
    id: "3",
    title: "Social Tennis — Mixed",
    type: "Social",
    day: "Saturdays",
    time: "10:00 – 12:00",
    location: "Braidhurst Sports Hall · All Courts",
    priceStd: 4,
    priceMember: 0,
    spotsLeft: 15,
    maxPlayers: 24,
  },
  {
    id: "4",
    title: "Coached Group Session",
    type: "Coached",
    day: "Tuesdays",
    time: "19:00 – 20:30",
    location: "Braidhurst Sports Hall · Court 1",
    priceStd: 12,
    priceMember: 9,
    spotsLeft: 3,
    maxPlayers: 8,
  },
];

const typeColors: Record<string, string> = {
  "Open Play": "#3865FF",
  "Junior": "#00D4AA",
  "Social": "#7B2CFF",
  "Coached": "#FFB800",
};

const tabs = ["All", "Open Play", "Junior", "Social", "Coached"];

export default function SessionsPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      {/* HEADER */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Sessions</h1>
        <p style={{ color: "#A0A3B1" }}>
          Book your spot in weekly sessions at Braidhurst Sports Hall, Motherwell.
        </p>
      </section>

      {/* TABS */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === "All" ? "#3865FF" : "#1A1B2E",
                color: tab === "All" ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Standard price", value: "From £4", sub: "per session" },
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

      {/* SESSIONS LIST */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-xl p-6 transition-all hover:border-opacity-50"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: `${typeColors[session.type]}20`, color: typeColors[session.type] }}>
                      {session.type}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: session.spotsLeft <= 4 ? "rgba(255,77,106,0.15)" : "rgba(0,212,170,0.15)",
                        color: session.spotsLeft <= 4 ? "#FF4D6A" : "#00D4AA",
                      }}>
                      {session.spotsLeft} spots left
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{session.title}</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm" style={{ color: "#A0A3B1" }}>📅 {session.day} &nbsp;·&nbsp; 🕐 {session.time}</p>
                    <p className="text-sm" style={{ color: "#A0A3B1" }}>📍 {session.location}</p>
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
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
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