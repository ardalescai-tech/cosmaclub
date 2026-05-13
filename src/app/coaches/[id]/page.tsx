import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const specializationColors = [
  { bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  { bg: "rgba(123,44,255,0.15)", color: "#7B2CFF" },
  { bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
];

export default async function CoachProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const coach = await prisma.coach.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
  });

  if (!coach || !coach.isActive) notFound();

  const initials = coach.user.name
    ? coach.user.name.split(" ").map((n) => n[0]).join("")
    : "?";

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-4xl mx-auto">

        <Link href="/coaches" className="text-sm mb-8 inline-block" style={{ color: "#A0A3B1" }}>
          ← Back to coaches
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left — profile card */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-6 text-center"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-3xl mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                {initials}
              </div>
              <h1 className="text-xl font-bold text-white mb-1">{coach.user.name ?? "Coach"}</h1>
              <p className="text-sm mb-3" style={{ color: "#3865FF" }}>{coach.qualification ?? "LTA Qualified"}</p>

              {coach.specialisms.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
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

              <div className="pt-4 mb-4" style={{ borderTop: "1px solid #2A2B3D" }}>
                <p className="text-3xl font-bold text-white">£{coach.pricePerHour}</p>
                <p className="text-xs" style={{ color: "#6B6E80" }}>per hour</p>
              </div>

              <Link href={`/book/coach/${coach.id}`}
                className="block w-full py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                Book a Session
              </Link>
            </div>

            {/* Contact info */}
            <div className="rounded-2xl p-5"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                Contact
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2" style={{ color: "#A0A3B1" }}>
                  <span>✉️</span>
                  <span>{coach.user.email}</span>
                </div>
                {coach.phone && (
                  <div className="flex items-center gap-2" style={{ color: "#A0A3B1" }}>
                    <span>📞</span>
                    <span>{coach.phone}</span>
                  </div>
                )}
                {coach.instagram && (
                  <div className="flex items-center gap-2" style={{ color: "#A0A3B1" }}>
                    <span>📸</span>
                    <span>@{coach.instagram}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — details */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {coach.bio && (
              <div className="rounded-2xl p-6"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                  About
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#A0A3B1" }}>{coach.bio}</p>
              </div>
            )}

            <div className="rounded-2xl p-6"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Price per hour", value: `£${coach.pricePerHour}` },
                  { label: "Experience", value: coach.experience ? `${coach.experience} years` : "—" },
                  { label: "Qualification", value: coach.qualification ?? "—" },
                  { label: "Specialisms", value: coach.specialisms.length > 0 ? coach.specialisms.join(", ") : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl p-4"
                    style={{ background: "#13141F", border: "1px solid #2A2B3D" }}>
                    <p className="text-xs mb-1" style={{ color: "#6B6E80" }}>{label}</p>
                    <p className="text-sm font-medium text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6"
              style={{ background: "linear-gradient(135deg, rgba(56,101,255,0.1), rgba(123,44,255,0.1))", border: "1px solid rgba(56,101,255,0.3)" }}>
              <p className="text-white font-semibold mb-2">Ready to improve your game?</p>
              <p className="text-sm mb-4" style={{ color: "#A0A3B1" }}>
                Book a session with {coach.user.name?.split(" ")[0] ?? "this coach"} and start your tennis journey today.
              </p>
              <Link href={`/book/coach/${coach.id}`}
                className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                Book Now — £{coach.pricePerHour}/hr
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
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