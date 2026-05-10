import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Welcome to the NovaClub admin panel.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Total Members</p>
          <p className="text-3xl font-semibold text-blue-600">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Sessions This Week</p>
          <p className="text-3xl font-semibold text-green-600">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Donations This Month</p>
          <p className="text-3xl font-semibold text-purple-600">£0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Pending Sponsors</p>
          <p className="text-3xl font-semibold text-orange-600">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Quick actions</h2>
          <div className="space-y-2">
            <Link href="/admin/sessions" className="block px-4 py-2.5 bg-gray-50 hover:bg-[#E6F1FB] rounded-lg text-sm text-gray-700 hover:text-[#0C447C] transition-colors">Add a new session →</Link>
            <Link href="/admin/competitions" className="block px-4 py-2.5 bg-gray-50 hover:bg-[#E6F1FB] rounded-lg text-sm text-gray-700 hover:text-[#0C447C] transition-colors">Add a competition →</Link>
            <Link href="/admin/shop" className="block px-4 py-2.5 bg-gray-50 hover:bg-[#E6F1FB] rounded-lg text-sm text-gray-700 hover:text-[#0C447C] transition-colors">Add a product to shop →</Link>
            <Link href="/admin/sponsors" className="block px-4 py-2.5 bg-gray-50 hover:bg-[#E6F1FB] rounded-lg text-sm text-gray-700 hover:text-[#0C447C] transition-colors">View sponsor applications →</Link>
            <Link href="/admin/donations" className="block px-4 py-2.5 bg-gray-50 hover:bg-[#E6F1FB] rounded-lg text-sm text-gray-700 hover:text-[#0C447C] transition-colors">View donations →</Link>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Recent activity</h2>
          <p className="text-sm text-gray-400 text-center py-6">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
}