import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
      <div className="rounded-xl p-10 max-w-md w-full text-center"
        style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
        <p className="text-5xl mb-4">💜</p>
        <h2 className="text-2xl font-bold text-white mb-2">Thank you for your donation!</h2>
        <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
          Your support means everything to NovaClub. Every donation goes directly back into the club.
        </p>
        <Link href="/"
          className="block w-full py-3 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}