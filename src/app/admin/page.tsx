import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [members, donations, sponsors, sessions] = await Promise.all([
    prisma.user.count(),
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.sponsorApplication.count({ where: { status: "PENDING" } }),
    prisma.playSession.count({ where: { status: "SCHEDULED" } }),
  ]);

  const totalDonations = donations._sum.amount ?? 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
      <p className="text-sm mb-8" style={{ color: "#A0A3B1" }}>Overview of your club.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Members", value: members.toString(), icon: "👥", color: "#3865FF" },
          { label: "Active Sessions", value: sessions.toString(), icon: "🎾", color: "#00D4AA" },
          { label: "Total Donations", value: `£${totalDonations.toFixed(2)}`, icon: "💜", color: "#7B2CFF" },
          { label: "Pending Sponsors", value: sponsors.toString(), icon: "🤝", color: "#FFB800" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-5"
            style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs" style={{ color: "#6B6E80" }}>{stat.label}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-5" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h2 className="font-semibold text-white mb-4">Quick actions</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: "Add a new session", href: "/admin/sessions" },
              { label: "Add a competition", href: "/admin/competitions" },
              { label: "Add a product to shop", href: "/admin/shop" },
              { label: "View sponsor applications", href: "/admin/sponsors" },
              { label: "View donations", href: "/admin/donations" },
              { label: "Manage members", href: "/admin/members" },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
                style={{ background: "#13141F", color: "#A0A3B1", border: "1px solid #2A2B3D" }}>
                {action.label}
                <span style={{ color: "#3865FF" }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h2 className="font-semibold text-white mb-4">Recent activity</h2>
          <p className="text-sm text-center py-6" style={{ color: "#6B6E80" }}>No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
}