import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#E6F1FB] flex flex-col items-center justify-center px-6">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[#0C447C] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">CC</span>
        </div>
        <span className="text-[#0C447C] font-semibold text-xl">CosmaClub</span>
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-10 w-full max-w-md shadow-sm text-center">
        <p className="text-5xl mb-4">🎾</p>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Thank you!</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Your donation has been received. Every contribution goes directly back into the club and helps keep tennis accessible for everyone in the community.
        </p>
        <div className="bg-[#E6F1FB] rounded-lg p-4 mb-6">
          <p className="text-sm text-[#0C447C] font-medium">A confirmation email is on its way to you.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/sessions"
            className="bg-[#185FA5] text-white py-3 rounded-lg font-medium hover:bg-[#0C447C] transition-colors text-sm"
          >
            Browse sessions
          </Link>
          <Link
            href="/"
            className="border border-gray-200 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}