import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";

const competitions = [
  {
    id: "1",
    title: "Summer Club Championship 2025",
    format: "Singles",
    description: "Our annual summer singles championship open to all club members. Round robin group stage followed by knockout rounds.",
    location: "Braidhurst High School Sports Hall, Motherwell",
    startDate: new Date("2025-07-12"),
    endDate: new Date("2025-07-14"),
    entryFee: 5,
    maxPlayers: 32,
    spotsLeft: 14,
    status: "OPEN",
  },
  {
    id: "2",
    title: "Junior Tournament — U14",
    format: "Singles U14",
    description: "A fun and competitive tournament for junior players under 14. All abilities welcome.",
    location: "Braidhurst High School Sports Hall, Motherwell",
    startDate: new Date("2025-08-05"),
    endDate: null,
    entryFee: 3,
    maxPlayers: 16,
    spotsLeft: 9,
    status: "OPEN",
  },
  {
    id: "3",
    title: "Mixed Doubles Social Cup",
    format: "Mixed Doubles",
    description: "A relaxed mixed doubles competition. Partners will be assigned randomly on the day.",
    location: "Braidhurst High School Sports Hall, Motherwell",
    startDate: new Date("2025-09-20"),
    endDate: null,
    entryFee: 4,
    maxPlayers: 24,
    spotsLeft: 24,
    status: "UPCOMING",
  },
];

const statusStyles: Record<string, string> = {
  OPEN: "bg-green-100 text-green-800",
  UPCOMING: "bg-blue-100 text-blue-800",
  CLOSED: "bg-red-100 text-red-800",
  FINISHED: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  OPEN: "Registrations Open",
  UPCOMING: "Coming Soon",
  CLOSED: "Registrations Closed",
  FINISHED: "Finished",
};

export default function CompetitionsPage() {
  return (
    <main className="min-h-screen">
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Competitions</h1>
          <p className="text-gray-600">
            Enter club tournaments for all ages and skill levels. All competitions are held at Braidhurst High School Sports Hall, Motherwell.
          </p>
        </div>
      </section>

      <section className="px-6 py-10 max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          {competitions.map((comp) => (
            <div key={comp.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[comp.status]}`}>
                      {statusLabels[comp.status]}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {comp.format}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{comp.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{comp.description}</p>
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <p>📅 {formatDate(comp.startDate)}{comp.endDate ? ` – ${formatDate(comp.endDate)}` : ""}</p>
                    <p>📍 {comp.location}</p>
                    <p>👥 {comp.spotsLeft} of {comp.maxPlayers} spots available</p>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3">
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-semibold text-[#0C447C]">
                      {comp.entryFee === 0 ? "Free" : formatPrice(comp.entryFee)}
                    </p>
                    <p className="text-sm text-gray-400">entry fee</p>
                  </div>
                  {comp.status === "OPEN" ? (
                    <Link
                      href={`/competitions/${comp.id}/register`}
                      className="bg-[#185FA5] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
                    >
                      Register Now
                    </Link>
                  ) : (
                    <button disabled className="bg-gray-100 text-gray-400 px-6 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                      Opening Soon
                    </button>
                  )}
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