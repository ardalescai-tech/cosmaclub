"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  return (
    <nav className="sticky top-0 z-50 border-b"
      style={{ background: "rgba(12,13,20,0.95)", backdropFilter: "blur(12px)", borderColor: "#2A2B3D" }}>

      {/* Main bar */}
      <div className="flex items-center justify-between px-6 py-4">

        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            N
          </div>
          <span className="font-semibold text-white text-lg">NovaClub</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="text-sm transition-colors"
              style={{
                color: pathname === link.href ? "#3865FF" : "#A0A3B1",
                fontWeight: pathname === link.href ? "500" : "400",
              }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/donate" className="text-sm" style={{ color: "#A0A3B1" }}>Donate</Link>
              <Link href="/dashboard" className="text-sm" style={{ color: "#A0A3B1" }}>Dashboard</Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/donate" className="text-sm" style={{ color: "#A0A3B1" }}>Donate</Link>
              <Link href="/login" className="text-sm" style={{ color: "#A0A3B1" }}>Login</Link>
              <Link href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}>
          <span className="block w-5 h-0.5 transition-all"
            style={{
              background: "#fff",
              transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
            }} />
          <span className="block w-5 h-0.5 transition-all"
            style={{
              background: "#fff",
              opacity: menuOpen ? 0 : 1,
            }} />
          <span className="block w-5 h-0.5 transition-all"
            style={{
              background: "#fff",
              transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
            }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ borderTop: "1px solid #2A2B3D" }}>

          <Link href="/" onClick={() => setMenuOpen(false)}
            className="text-sm font-medium pt-4"
            style={{ color: pathname === "/" ? "#3865FF" : "#A0A3B1" }}>
            Home
          </Link>

          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm"
              style={{
                color: pathname === link.href ? "#3865FF" : "#A0A3B1",
                fontWeight: pathname === link.href ? "500" : "400",
              }}>
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 pt-2" style={{ borderTop: "1px solid #2A2B3D" }}>
            {session ? (
              <>
                <Link href="/donate" onClick={() => setMenuOpen(false)}
                  className="text-sm" style={{ color: "#A0A3B1" }}>Donate</Link>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="text-sm" style={{ color: "#A0A3B1" }}>Dashboard</Link>
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="text-left text-sm" style={{ color: "#FF4D6A" }}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/donate" onClick={() => setMenuOpen(false)}
                  className="text-sm" style={{ color: "#A0A3B1" }}>Donate</Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="text-sm" style={{ color: "#A0A3B1" }}>Login</Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white text-center"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}