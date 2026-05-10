"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { label: "Sessions", href: "/sessions" },
  { label: "Coaches", href: "/coaches" },
  { label: "Competitions", href: "/competitions" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Shop", href: "/shop" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Nu afișa navbar pe paginile de admin sau login
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  return (
    <nav className="bg-[#0C447C] px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#0C447C] font-bold text-sm">CC</span>
        </div>
        <span className="text-white font-semibold text-lg">NovaClub</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors ${
              pathname === link.href
                ? "text-white font-medium border-b border-white pb-0.5"
                : "text-white/80 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <Link href="/dashboard" className="text-white/80 hover:text-white text-sm">
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-white/80 hover:text-white text-sm">
              Login
            </Link>
            <Link href="/donate" className="bg-white text-[#0C447C] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
              Donate
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}