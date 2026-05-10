import Link from "next/link";

const coaches = [
  {
    id: "1",
    name: "James Mitchell",
    initials: "JM",
    qualification: "LTA Level 3",
    specialisms: ["Adults", "Juniors", "Competition"],
    bio: "James has been coaching tennis for over 10 years and specialises in helping players develop their competitive game.",
    pricePerHour: 35,
    rating: 4.9,
    sessions: 120,
    availability: "Mon, Wed, Fri — evenings & weekends",
  },
  {
    id: "2",
    name: "Sophie Reid",
    initials: "SR",
    qualification: "LTA Level 2",
    specialisms: ["Beginners", "Kids", "Ladies"],
    bio: "Sophie is passionate about introducing new players to tennis in a fun, encouraging environment.",
    pricePerHour: 28,
    rating: 4.8,
    sessions: 89,
    availability: "Tue, Thu — afternoons · Saturdays",
  },
  {
    id: "3",
    name: "Alex Kerr",
    initials: "AK",
    qualification: "LTA Level 3",
    specialisms: ["Advanced", "Competition", "Fitness"],
    bio: "Alex is a former competitive player who focuses on technique, tactics and match fitness.",
    pricePerHour: 40,
    rating: 4.9,
    sessions: 156,
    availability: "Mon–Fri — mornings · Weekends",
  },
];

const specializationColors = [
  { bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  { bg: "rgba(123,44,255,0.15)", color: "#7B2CFF" },
  { bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
];

export default function CoachesPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Our Coaches</h1>
        <p style={{ color: "#A0A3B1" }}>Learn from the best. Book a session with our LTA-qualified coaches.</p>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coaches.map((coach) => (
            <div key={coach.id} className="rounded-xl overflow-hidden transition-all hover:scale-105"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

              {/* Avatar area */}
              <div className="p-6 pb-4 flex items-start gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  {coach.initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{coach.name}</h3>
                  <p className="text-sm" style={{ color: "#3865FF" }}>{coach.qualification}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs" style={{ color: "#A0A3B1" }}>⭐ {coach.rating}</span>
                    <span className="text-xs" style={{ color: "#A0A3B1" }}>·</span>
                    <span className="text-xs" style={{ color: "#A0A3B1" }}>{coach.sessions} sessions</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4">
                <p className="text-sm mb-4" style={{ color: "#A0A3B1" }}>{coach.bio}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specialisms.map((s, i) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: specializationColors[i % 3].bg,
                        color: specializationColors[i % 3].color,
                      }}>
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-xs mb-4" style={{ color: "#6B6E80" }}>
                  🗓 {coach.availability}
                </p>

                <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #2A2B3D" }}>
                  <div>
                    <p className="text-2xl font-bold text-white">£{coach.pricePerHour}</p>
                    <p className="text-xs" style={{ color: "#6B6E80" }}>per hour</p>
                  </div>
                  <Link href={`/book/coach/${coach.id}`}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
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