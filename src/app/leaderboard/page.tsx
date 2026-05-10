import Link from "next/link";

const players = [
  { rank: 1, name: "James Mitchell", elo: 1240, wins: 18, losses: 4, winRate: 82 },
  { rank: 2, name: "Sophie Reid", elo: 1185, wins: 14, losses: 6, winRate: 70 },
  { rank: 3, name: "Alex Kerr", elo: 1160, wins: 12, losses: 5, winRate: 71 },
  { rank: 4, name: "David Brown", elo: 1095, wins: 9, losses: 8, winRate: 53 },
  { rank: 5, name: "Emma Wilson", elo: 1050, wins: 7, losses: 7, winRate: 50 },
  { rank: 6, name: "Liam Thomson", elo: 1020, wins: 6, losses: 9, winRate: 40 },
  { rank: 7, name: "Chloe Stewart", elo: 990, wins: 4, losses: 8, winRate: 33 },
  { rank: 8, name: "Ryan MacDonald", elo: 965, wins: 3, losses: 10, winRate: 23 },
];

const medalColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-orange-400",
};

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen">
      
      {/* HEADER */}
      <section className="bg-[#E6F1FB] px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Leaderboard</h1>
          <p className="text-gray-600">Players ranked by ELO rating. Win matches to climb the rankings.</p>
        </div>
      </section>

      {/* TOP 3 */}
      <section className="px-6 py-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {players.slice(0, 3).map((player) => (
            <div key={player.rank} className={`bg-white border rounded-xl p-5 text-center shadow-sm ${player.rank === 1 ? "border-yellow-300" : "border-gray-200"}`}>
              <p className={`text-3xl mb-2 ${medalColors[player.rank]}`}>
                {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}
              </p>
              <div className="w-12 h-12 bg-[#B5D4F4] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-[#0C447C] font-semibold text-sm">
                  {player.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{player.name}</p>
              <p className="text-2xl font-bold text-[#0C447C] mt-1">{player.elo}</p>
              <p className="text-xs text-gray-400">ELO</p>
              <p className="text-xs text-gray-500 mt-1">{player.wins}W · {player.losses}L</p>
            </div>
          ))}
        </div>

        {/* FULL TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E6F1FB] text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">#</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Player</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">ELO</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">W</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">L</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Win Rate</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.rank} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-500">
                    <span className={medalColors[player.rank] ?? "text-gray-400"}>
                      {player.rank <= 3 ? ["🥇","🥈","🥉"][player.rank-1] : `#${player.rank}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#B5D4F4] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#0C447C] font-semibold text-xs">
                          {player.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0C447C]">{player.elo}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{player.wins}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{player.losses}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-[#185FA5] h-1.5 rounded-full"
                          style={{ width: `${player.winRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{player.winRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/challenge/${player.rank}`}
                      className="text-xs bg-[#E6F1FB] text-[#0C447C] px-3 py-1 rounded-lg hover:bg-[#B5D4F4] transition-colors"
                    >
                      Challenge
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FOOTER */}
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