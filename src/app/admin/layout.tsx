"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Sessions", href: "/admin/sessions", icon: "🎾" },
  { label: "Coaches", href: "/admin/coaches", icon: "👨‍🏫" },
  { label: "Competitions", href: "/admin/competitions", icon: "🏆" },
  { label: "Shop", href: "/admin/shop", icon: "🛍️" },
  { label: "Members", href: "/admin/members", icon: "👥" },
  { label: "Donations", href: "/admin/donations", icon: "💜" },
  { label: "Sponsors", href: "/admin/sponsors", icon: "🤝" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ background: "#0C0D14" }}>
      {/* SIDEBAR */}
      <aside className="w-56 flex flex-col fixed h-full"
        style={{ background: "#13141F", borderRight: "1px solid #2A2B3D" }}>
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #2A2B3D" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              N
            </div>
            <span className="text-white font-semibold text-sm">NovaClub Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all"
              style={{
                background: pathname === item.href ? "rgba(56,101,255,0.15)" : "transparent",
                color: pathname === item.href ? "#3865FF" : "#A0A3B1",
                fontWeight: pathname === item.href ? "500" : "400",
              }}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: "1px solid #2A2B3D" }}>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all"
            style={{ color: "#6B6E80" }}>
            🚪 Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-56" style={{ background: "#0C0D14" }}>
        {children}
      </main>
    </div>
  );
}