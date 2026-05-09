import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-[#0C447C] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#0C447C] font-bold text-sm">CC</span>
          </div>
          <span className="text-white font-semibold text-lg">CosmaClub</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/sessions" className="text-white/80 hover:text-white text-sm">Sessions</Link>
          <Link href="/coaches" className="text-white/80 hover:text-white text-sm">Coaches</Link>
          <Link href="/competitions" className="text-white/80 hover:text-white text-sm">Competitions</Link>
          <Link href="/shop" className="text-white/80 hover:text-white text-sm">Shop</Link>
          <Link href="/donate" className="bg-white text-[#0C447C] px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
            Donate
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#0C447C] via-[#185FA5] to-[#378ADD] px-6 py-20 text-center">
        <span className="inline-block bg-white/15 text-white/90 text-xs px-3 py-1 rounded-full border border-white/30 mb-4">
          Non-profit · Scotland
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
          Tennis for the<br />whole community
        </h1>
        <p className="text-white/80 text-lg max-w-lg mx-auto mb-8">
          Join our club, book sessions with coaches, enter competitions and support the community.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/sessions" className="bg-white text-[#0C447C] px-6 py-3 rounded-lg font-medium hover:bg-blue-50">
            View Sessions
          </Link>
          <Link href="/donate" className="border border-white/50 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10">
            Donate Equipment
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-10">Everything in one place</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Book Sessions", desc: "Reserve your spot in weekly open play, junior or social sessions.", href: "/sessions" },
            { title: "Hire a Coach", desc: "One-on-one or group coaching with LTA-qualified coaches.", href: "/coaches" },
            { title: "Competitions", desc: "Enter club tournaments for all ages and skill levels.", href: "/competitions" },
            { title: "Club Shop", desc: "Buy personalised CosmaClub kit — apparel, bags and accessories.", href: "/shop" },
            { title: "Donate", desc: "Support the club with equipment or financial donations.", href: "/donate" },
            { title: "Become a Sponsor", desc: "Partner with us and gain visibility in the community.", href: "/sponsor" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="block bg-[#E6F1FB] border border-[#B5D4F4] rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-[#0C447C] mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* VENUE */}
      <section className="bg-[#E6F1FB] px-6 py-12 text-center">
        <h2 className="text-xl font-semibold text-[#0C447C] mb-2">Where we play</h2>
        <p className="text-gray-600 mb-1">School Sports Hall — local secondary school, Scotland</p>
        <p className="text-gray-500 text-sm">Sessions run weekly — check the sessions page for times and prices</p>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#042C53] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-white font-semibold">CosmaClub</p>
            <p className="text-white/50 text-sm">Non-profit community tennis club · Scotland</p>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
            <Link href="/cookies" className="text-white/50 text-sm hover:text-white">Cookies</Link>
            <Link href="/contact" className="text-white/50 text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}