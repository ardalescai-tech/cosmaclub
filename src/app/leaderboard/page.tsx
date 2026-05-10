import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LeaderboardPage() {
  const players = await prisma.player.findMany({
    orderBy: { elo: "desc" },
  });

  const playersWithUsers = await Promise.all(
    players.map(async (player, index) => {
      const user = await prisma.user.findUnique({
        where: { id: player.userId },
        select: { name: true, email: true },
      });
      const totalMatches = player.wins + player.losses;
      const winRate = totalMatches > 0 ? Math.round((player.wins / totalMatches) * 100) : 0;
      return {
        rank: index + 1,
        id: player.id,
        userId: player.userId,
        name: user?.name ?? "Unknown",
        initials: user?.name ? user.name.split(" ").map((n) => n[0]).join("") : "?",
        elo: player.elo,
        wins: player.wins,
        losses: player.losses,
        winRate,
      };
    })
  );

  const tabs = ["Global", "Friends", "Club"];

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
        <p style={{ color: "#A0A3B1" }}>Top players in the NovaClub community.</p>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab}
              className="px-4 py-2 rounded-lg text-sm font-medium"
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

      {playersWithUsers.length === 0 ? (
        <section className="px-6 max-w-6xl mx-auto pb-16">
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-white font-semibold mb-2">No players yet</p>
            <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>Be the first to challenge someone and start climbing!</p>
            <Link href="/login"
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              Join Now
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* TOP 3 */}
          {playersWithUsers.length >= 3 && (
            <section className="px-6 max-w-6xl mx-auto mb-8">
              <div className="grid grid-cols-3 gap-4">
                {playersWithUsers.slice(0, 3).map((player) => (
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
          )}

          {/* FULL TABLE */}
          <section className="px-6 pb-16 max-w-6xl mx-auto">
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #2A2B3D" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#13141F" }}>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}>Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}>Player</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}>ELO</th>
                    <th className="px-4 py-3 text-left text-xs font-medium hidden md:table-cell" style={{ color: "#6B6E80" }}>W</th>
                    <th className="px-4 py-3 text-left text-xs font-medium hidden md:table-cell" style={{ color: "#6B6E80" }}>L</th>
                    <th className="px-4 py-3 text-left text-xs font-medium hidden md:table-cell" style={{ color: "#6B6E80" }}>Win Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#6B6E80" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {playersWithUsers.map((player, i) => (
                    <tr key={player.rank}
                      style={{ borderTop: "1px solid #2A2B3D", background: i % 2 === 0 ? "#1A1B2E" : "#13141F" }}>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: "#A0A3B1" }}>
                        {player.rank <= 3 ? ["🥇", "🥈", "🥉"][player.rank - 1] : `#${player.rank}`}
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
                      <td className="px-4 py-3 text-sm hidden md:table-cell" style={{ color: "#A0A3B1" }}>{player.wins}</td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell" style={{ color: "#A0A3B1" }}>{player.losses}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-20 rounded-full h-1.5" style={{ background: "#2A2B3D" }}>
                            <div className="h-1.5 rounded-full"
                              style={{ width: `${player.winRate}%`, background: "linear-gradient(90deg, #3865FF, #7B2CFF)" }} />
                          </div>
                          <span className="text-xs" style={{ color: "#A0A3B1" }}>{player.winRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/challenge/${player.userId}`}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
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
        </>
      )}

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