import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const coaches = [
  {
    id: "1",
    name: "James Mitchell",
    initials: "JM",
    qualification: "LTA Level 3",
    specialisms: ["Adults", "Juniors", "Competition"],
    bio: "James has been coaching tennis for over 10 years and specialises in helping players develop their competitive game. He works with all ages and abilities.",
    pricePerHour: 35,
    availability: "Mon, Wed, Fri — evenings & weekends",
  },
  {
    id: "2",
    name: "Sophie Reid",
    initials: "SR",
    qualification: "LTA Level 2",
    specialisms: ["Beginners", "Kids", "Ladies"],
    bio: "Sophie is passionate about introducing new players to tennis. She specialises in beginner and junior coaching in a fun, encouraging environment.",
    pricePerHour: 28,
    availability: "Tue, Thu — afternoons · Saturdays",
  },
  {
    id: "3",
    name: "Alex Kerr",
    initials: "AK",
    qualification: "LTA Level 3",
    specialisms: ["Advanced", "Competition", "Fitness"],
    bio: "Alex is a former competitive player who now coaches advanced and competition-level players. He focuses on technique, tactics and match fitness.",
    pricePerHour: 40,
    availability: "Mon–Fri — mornings · Weekends",
  },
];

export default function CoachesPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Coaches</h1>
          <p className="text-gray-600">
            Book a one-to-one or group session with one of our LTA-qualified coaches. Payment is taken in full at the time of booking.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          {coaches.map((coach) => (
            <div key={coach.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-[#B5D4F4] flex items-center justify-center">
                    <span className="text-[#0C447C] font-semibold text-xl">{coach.initials}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{coach.name}</h3>
                      <p className="text-sm text-[#185FA5] font-medium">{coach.qualification}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-2xl font-semibold text-[#0C447C]">{formatPrice(coach.pricePerHour)}</p>
                      <p className="text-sm text-gray-400">per hour</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{coach.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialisms.map((s) => (
                      <span key={s} className="bg-[#E6F1FB] text-[#0C447C] text-xs px-3 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">🗓 Available: {coach.availability}</p>
                  <Link
                    href={`/book/coach/${coach.id}`}
                    className="inline-block bg-[#185FA5] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
                  >
                    Book a Session
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-semibold">NovaClub</p>
            <p className="text-white/50 text-sm">Non-profit community tennis club · Scotland</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
            <Link href="/cookies" className="text-white/50 text-sm hover:text-white">Cookies</Link>
            <Link href="/contact" className="text-white/50 text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}