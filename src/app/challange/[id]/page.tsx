"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChallengePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sessionDate, setSessionDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChallenge = async () => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengerId: session.user.id,
          opponentId: params.id,
          sessionDate: sessionDate || null,
        }),
      });

      if (res.ok) {
        setSent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#E6F1FB] flex flex-col items-center justify-center px-6">
      <div className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-sm">
        {sent ? (
          <div className="text-center">
            <p className="text-4xl mb-4">🎾</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Challenge sent!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your opponent will be notified and can accept or decline the match.
            </p>
            <Link
              href="/leaderboard"
              className="bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
            >
              Back to Leaderboard
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Challenge a Player</h2>
            <p className="text-gray-500 text-sm mb-6">
              Send a match challenge. Your ELO will be updated after the match is completed.
            </p>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Preferred session date (optional)
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
              />
              <p className="text-xs text-gray-400 mt-1">
                Must be on a club session day. Final date confirmed with your opponent.
              </p>
            </div>

            <div className="bg-[#E6F1FB] rounded-lg p-4 mb-6 text-sm text-gray-600">
              <p className="font-medium text-[#0C447C] mb-1">How ELO works</p>
              <p>Win against a higher-rated player → gain more ELO</p>
              <p>Lose against a lower-rated player → lose more ELO</p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/leaderboard"
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleChallenge}
                disabled={loading}
                className="flex-1 bg-[#185FA5] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Challenge"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}