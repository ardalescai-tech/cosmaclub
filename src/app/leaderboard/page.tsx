import Link from "next/link";

const players = [
  { rank: 1, name: "Alex Morgan", initials: "AM", elo: 2450, wins: 18, losses: 4, winRate: 82, streak: 5 },
  { rank: 2, name: "David Roberts", initials: "DR", elo: 2300, wins: 14, losses: 6, winRate: 70, streak: 3 },
  { rank: 3, name: "Sophie Reid", initials: "SR", elo: 2100, wins: 12, losses: 5, winRate: 71, streak: 2 },
  { rank: 4, name: "Daniel Lee", initials: "DL", elo: 1960, wins: 9, losses: 8, winRate: 53, streak: 0 },
  { rank: 5, name: "Michael Chen", initials: "MC", elo: 1850, wins: 7, losses: 7, winRate: 50, streak: 1 },
  { rank: 6, name: "Arda Example", initials: "AE", elo: 1800, wins: 6, losses: 9, winRate: 40, streak: 0 },
  { rank: 7, name: "James Wilson", initials: "JW", elo: 1750, wins: 5, losses: 10, winRate: 33, streak: 0 },
];

const tabs = ["Global", "Friends", "Club"];

export default function LeaderboardPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
        <p style={{ color: "#A0A3B1" }}>Top players in the NovaClub community.</p>
      </section>

      {/* TABS */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === "Global" ? "#3865FF" : "#1A1B2E",
                color: tab === "Global" ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* TOP 3 */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-4">
          {players.slice(0, 3).map((player) => (
            <div key={player.rank} className="rounded-xl p-5 text-center"
              style={{
                background: "#1A1B2E",
                border: player.rank === 1 ? "1px solid rgba(56,101,255,0.5)" : "1px solid #2A2B3D",
              }}>
              <p className="text-2xl mb-2">
                {player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉"}
              </p>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                {player.initials}
              </div>
              <p className="font-semibold text-white text-sm">{player.name}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: "#3865FF" }}>{player.elo}</p>
              <p className="text-xs mt-1" style={{ color: "#6B6E80" }}>{player.wins}W · {player.losses}L</p>
            </div>
          ))}
        </div>
      </section>

      {/* FULL TABLE */}
      <section className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #2A2B3D" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#13141F" }}>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}>Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}>Player</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}>ELO</th>
                <th className="px-4 py-3 text-left text-xs font-medium hidden md:table-cell" style={{ color: "#6B6E80" }}>Win Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium hidden md:table-cell" style={{ color: "#6B6E80" }}>Streak</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}></th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, i) => (
                <tr key={player.rank}
                  style={{ borderTop: "1px solid #2A2B3D", background: i % 2 === 0 ? "#1A1B2E" : "#13141F" }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#A0A3B1" }}>
                    {player.rank <= 3
                      ? ["🥇", "🥈", "🥉"][player.rank - 1]
                      : `#${player.rank}`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        {player.initials}
                      </div>
                      <span className="text-sm font-medium text-white">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: "#3865FF" }}>{player.elo}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-20 rounded-full h-1.5" style={{ background: "#2A2B3D" }}>
                        <div className="h-1.5 rounded-full" style={{ width: `${player.winRate}%`, background: "linear-gradient(90deg, #3865FF, #7B2CFF)" }} />
                      </div>
                      <span className="text-xs" style={{ color: "#A0A3B1" }}>{player.winRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm" style={{ color: player.streak > 0 ? "#00D4AA" : "#6B6E80" }}>
                      {player.streak > 0 ? `🔥 ${player.streak}` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/challenge/${player.rank}`}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
                      Challenge
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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