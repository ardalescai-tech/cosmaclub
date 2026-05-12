"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "#0C0D14" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className="flex flex-col fixed h-full z-30 transition-transform duration-300"
        style={{
          width: "224px",
          background: "#13141F",
          borderRight: "1px solid #2A2B3D",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}>
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #2A2B3D" }}>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                N
              </div>
              <span className="text-white font-semibold text-sm">NovaClub Admin</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)}
              className="md:hidden text-sm"
              style={{ color: "#A0A3B1" }}>
              ✕
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
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
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm"
            style={{ color: "#6B6E80" }}>
            🚪 Sign out
          </button>
        </div>
      </aside>

      {/* Desktop sidebar — always visible */}
      <aside
        className="hidden md:flex flex-col fixed h-full z-30"
        style={{
          width: "224px",
          background: "#13141F",
          borderRight: "1px solid #2A2B3D",
        }}>
        <div className="px-5 py-5" style={{ borderBottom: "1px solid #2A2B3D" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              N
            </div>
            <span className="text-white font-semibold text-sm">NovaClub Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-sm"
            style={{ color: "#6B6E80" }}>
            🚪 Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-56" style={{ background: "#0C0D14" }}>

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{ background: "#13141F", borderBottom: "1px solid #2A2B3D" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              N
            </div>
            <span className="text-white font-semibold text-sm">NovaClub Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg flex flex-col justify-center items-center gap-1.5"
            style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <span className="block w-4 h-0.5 rounded-full" style={{ background: "#3865FF" }} />
            <span className="block w-4 h-0.5 rounded-full" style={{ background: "#3865FF" }} />
            <span className="block w-4 h-0.5 rounded-full" style={{ background: "#3865FF" }} />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}