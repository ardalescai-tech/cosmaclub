"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { label: "Sessions", href: "/sessions" },
  { label: "Coaches", href: "/coaches" },
  { label: "Competitions", href: "/competitions" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Matches", href: "/matches" },
  { label: "Shop", href: "/shop" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
      style={{ background: "rgba(12,13,20,0.85)", backdropFilter: "blur(12px)", borderColor: "#2A2B3D" }}>

      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          N
        </div>
        <span className="font-semibold text-white text-lg">NovaClub</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm transition-colors"
            style={{
              color: pathname === link.href ? "#3865FF" : "#A0A3B1",
              fontWeight: pathname === link.href ? "500" : "400",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <Link href="/dashboard" className="text-sm" style={{ color: "#A0A3B1" }}>
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm" style={{ color: "#A0A3B1" }}>
              Login
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}
            >
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}