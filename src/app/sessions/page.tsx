import Link from "next/link";
import { formatPrice, formatTime, DAY_NAMES } from "@/lib/utils";

const sessions = [
  {
    id: "1",
    title: "Open Play — Adults",
    type: "OPEN_PLAY",
    dayOfWeek: 1,
    startTime: "18:00",
    endTime: "20:00",
    court: "Court 1 & 2",
    priceStd: 6,
    priceMember: 4,
    maxPlayers: 20,
    spotsLeft: 8,
  },
  {
    id: "2",
    title: "Junior Session (8–16 yrs)",
    type: "JUNIOR",
    dayOfWeek: 3,
    startTime: "16:00",
    endTime: "17:30",
    court: "Court 3",
    priceStd: 5,
    priceMember: 3,
    priceJunior: 3,
    maxPlayers: 12,
    spotsLeft: 4,
  },
  {
    id: "3",
    title: "Social Tennis — Mixed",
    type: "SOCIAL",
    dayOfWeek: 6,
    startTime: "10:00",
    endTime: "12:00",
    court: "All Courts",
    priceStd: 4,
    priceMember: 0,
    maxPlayers: 24,
    spotsLeft: 15,
  },
  {
    id: "4",
    title: "Coached Group Session",
    type: "COACHED",
    dayOfWeek: 2,
    startTime: "19:00",
    endTime: "20:30",
    court: "Court 1",
    priceStd: 12,
    priceMember: 9,
    maxPlayers: 8,
    spotsLeft: 3,
  },
];

const typeColors: Record<string, string> = {
  OPEN_PLAY: "bg-blue-100 text-blue-800",
  JUNIOR: "bg-green-100 text-green-800",
  SOCIAL: "bg-purple-100 text-purple-800",
  COACHED: "bg-orange-100 text-orange-800",
};

const typeLabels: Record<string, string> = {
  OPEN_PLAY: "Open Play",
  JUNIOR: "Junior",
  SOCIAL: "Social",
  COACHED: "Coached",
};

export default function SessionsPage() {
  return (
    <main className="min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-[#0C447C] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#0C447C] font-bold text-sm">CC</span>
          </div>
          <span className="text-white font-semibold text-lg">CosmaClub</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/sessions" className="text-white text-sm font-medium border-b border-white pb-0.5">Sessions</Link>
          <Link href="/coaches" className="text-white/80 hover:text-white text-sm">Coaches</Link>
          <Link href="/competitions" className="text-white/80 hover:text-white text-sm">Competitions</Link>
          <Link href="/shop" className="text-white/80 hover:text-white text-sm">Shop</Link>
          <Link href="/donate" className="bg-white text-[#0C447C] px-4 py-2 rounded-lg text-sm font-medium">Donate</Link>
        </div>
      </nav>

      {/* HEADER */}
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Sessions</h1>
          <p className="text-gray-600">
            All sessions are held at the <strong>School Sports Hall</strong>. Prices vary by session type and membership status.
          </p>
        </div>
      </section>

      {/* PRICING INFO */}
      <section className="px-6 py-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Standard price</p>
            <p className="text-xl font-semibold text-[#0C447C]">From £4</p>
          </div>
          <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Member price</p>
            <p className="text-xl font-semibold text-[#0C447C]">From £0</p>
          </div>
          <div className="bg-[#E6F1FB] border border-[#B5D4F4] rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Junior price</p>
            <p className="text-xl font-semibold text-[#0C447C]">From £3</p>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[session.type]}`}>
                      {typeLabels[session.type]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      session.spotsLeft <= 4 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}>
                      {session.spotsLeft} spots left
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{session.title}</h3>
                  <p className="text-sm text-gray-500">
                    📅 {DAY_NAMES[session.dayOfWeek]}s &nbsp;·&nbsp;
                    🕐 {formatTime(session.startTime)} – {formatTime(session.endTime)} &nbsp;·&nbsp;
                    📍 {session.court}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-[#0C447C]">{formatPrice(session.priceStd)}</p>
                    <p className="text-sm text-gray-400">standard / person</p>
                    <p className="text-sm text-[#185FA5]">Members: {session.priceMember === 0 ? "Free" : formatPrice(session.priceMember)}</p>
                  </div>
                  <Link
                    href={`/book/${session.id}`}
                    className="bg-[#185FA5] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-semibold">CosmaClub</p>
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