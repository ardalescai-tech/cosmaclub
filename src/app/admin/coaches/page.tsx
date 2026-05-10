import Link from "next/link";
import { prisma } from "@/lib/prisma";

const specializationColors = [
  { bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  { bg: "rgba(123,44,255,0.15)", color: "#7B2CFF" },
  { bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
];

export default async function CoachesPage() {
  const coaches = await prisma.coach.findMany({
    where: { isActive: true },
    include: {
      user: {
        select: { name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Our Coaches</h1>
        <p style={{ color: "#A0A3B1" }}>Learn from the best. Book a session with our LTA-qualified coaches.</p>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {coaches.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">👨‍🏫</p>
            <p className="text-white font-semibold mb-2">No coaches yet</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Coaches will appear here once they register with the club.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coaches.map((coach) => {
              const initials = coach.user.name
                ? coach.user.name.split(" ").map((n) => n[0]).join("")
                : "?";

              return (
                <div key={coach.id} className="rounded-xl overflow-hidden transition-all hover:scale-105"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <div className="p-6 pb-4 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                      {initials}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">{coach.user.name ?? "Coach"}</h3>
                      <p className="text-sm" style={{ color: "#3865FF" }}>{coach.qualification ?? "LTA Qualified"}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    {coach.bio && (
                      <p className="text-sm mb-4" style={{ color: "#A0A3B1" }}>{coach.bio}</p>
                    )}

                    {coach.specialisms.length > 0 && (
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
                    )}

                    <div className="flex items-center justify-between pt-4"
                      style={{ borderTop: "1px solid #2A2B3D" }}>
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