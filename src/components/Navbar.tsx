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
  const role = (session?.user as any)?.role;
if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;
  

  const isCaptainOrAbove = ["CAPTAIN", "ADMIN", "OWNER"].includes(role);
  const isAdminOrOwner = ["ADMIN", "OWNER"].includes(role);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(12,13,20,0.95)", backdropFilter: "blur(12px)", borderColor: "#2A2B3D" }}>
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
                {isCaptainOrAbove && (
                  <Link href="/captain"
                    className="text-sm px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
                    ⚖️ Captain
                  </Link>
                )}
                {isAdminOrOwner && (
                  <Link href="/admin"
                    className="text-sm px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: "rgba(123,44,255,0.15)", color: "#7B2CFF" }}>
                    Admin
                  </Link>
                )}
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
            className="md:hidden w-10 h-10 rounded-xl flex flex-col justify-center items-center gap-1.5"
            style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}
            onClick={() => setMenuOpen(!menuOpen)}>
            <span className="block w-4 h-0.5 rounded-full transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #3865FF, #7B2CFF)",
                transform: menuOpen ? "rotate(45deg) translate(2px, 2px)" : "none",
              }} />
            <span className="block w-4 h-0.5 rounded-full transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #3865FF, #7B2CFF)",
                opacity: menuOpen ? 0 : 1,
              }} />
            <span className="block w-4 h-0.5 rounded-full transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #3865FF, #7B2CFF)",
                transform: menuOpen ? "rotate(-45deg) translate(2px, -2px)" : "none",
              }} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col"
          style={{ background: "#0C0D14", top: "73px" }}>
          <div className="flex flex-col px-6 py-8 gap-1 flex-1 overflow-y-auto">

            {[{ label: "Home", href: "/" }, ...navLinks].map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-4 rounded-xl transition-all"
                style={{
                  background: pathname === link.href ? "rgba(56,101,255,0.1)" : "transparent",
                  border: pathname === link.href ? "1px solid rgba(56,101,255,0.2)" : "1px solid transparent",
                }}>
                <span className="text-base font-medium"
                  style={{ color: pathname === link.href ? "#3865FF" : "#ffffff" }}>
                  {link.label}
                </span>
                {pathname === link.href && <span style={{ color: "#3865FF" }}>→</span>}
              </Link>
            ))}

            <div className="my-4" style={{ borderTop: "1px solid #2A2B3D" }} />

            {session ? (
              <>
                <Link href="/donate" onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-4 rounded-xl"
                  style={{ color: "#A0A3B1" }}>
                  <span className="text-base">Donate</span>
                </Link>
                {isCaptainOrAbove && (
                  <Link href="/captain" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-4 rounded-xl"
                    style={{ background: "rgba(56,101,255,0.1)", border: "1px solid rgba(56,101,255,0.2)", color: "#3865FF" }}>
                    <span className="text-base font-medium">⚖️ Captain Panel</span>
                  </Link>
                )}
                {isAdminOrOwner && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-4 rounded-xl"
                    style={{ background: "rgba(123,44,255,0.1)", border: "1px solid rgba(123,44,255,0.2)", color: "#7B2CFF" }}>
                    <span className="text-base font-medium">Admin Panel</span>
                  </Link>
                )}
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-4 rounded-xl"
                  style={{ color: "#A0A3B1" }}>
                  <span className="text-base">Dashboard</span>
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="flex items-center px-4 py-4 rounded-xl mt-2 w-full"
                  style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.2)", color: "#FF4D6A" }}>
                  <span className="text-base font-medium">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/donate" onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-4 rounded-xl"
                  style={{ color: "#A0A3B1" }}>
                  <span className="text-base">Donate</span>
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center px-4 py-4 rounded-xl"
                  style={{ color: "#A0A3B1" }}>
                  <span className="text-base">Login</span>
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-4 rounded-xl mt-2 text-white font-medium text-base"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}