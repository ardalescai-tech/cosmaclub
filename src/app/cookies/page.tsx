import Link from "next/link";

export default function CookiesPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Cookie Policy</h1>
        <p className="text-sm mb-10" style={{ color: "#6B6E80" }}>Last updated: June 2025</p>

        <div className="flex flex-col gap-6" style={{ color: "#A0A3B1" }}>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-3">What Are Cookies?</h2>
            <p className="text-sm leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help websites function correctly and provide information about how visitors use the site.</p>
          </div>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-4">Essential Cookies</h2>
            <p className="text-sm mb-3">These are required for the website to function and cannot be disabled.</p>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                  <th className="text-left py-2 pr-4 font-medium text-white">Cookie</th>
                  <th className="text-left py-2 pr-4 font-medium text-white">Purpose</th>
                  <th className="text-left py-2 font-medium text-white">Duration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["next-auth.session-token", "Keeps you logged in", "30 days"],
                  ["next-auth.csrf-token", "Security token", "Session"],
                  ["cookie-consent", "Stores your preferences", "1 year"],
                ].map(([name, purpose, duration]) => (
                  <tr key={name} style={{ borderBottom: "1px solid #2A2B3D" }}>
                    <td className="py-2 pr-4 font-mono text-xs" style={{ color: "#3865FF" }}>{name}</td>
                    <td className="py-2 pr-4">{purpose}</td>
                    <td className="py-2">{duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-4">Analytics Cookies (consent required)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                  <th className="text-left py-2 pr-4 font-medium text-white">Cookie</th>
                  <th className="text-left py-2 pr-4 font-medium text-white">Provider</th>
                  <th className="text-left py-2 font-medium text-white">Duration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["_ga", "Google Analytics", "2 years"],
                  ["_ga_*", "Google Analytics", "2 years"],
                ].map(([name, provider, duration]) => (
                  <tr key={name} style={{ borderBottom: "1px solid #2A2B3D" }}>
                    <td className="py-2 pr-4 font-mono text-xs" style={{ color: "#3865FF" }}>{name}</td>
                    <td className="py-2 pr-4">{provider}</td>
                    <td className="py-2">{duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-3">Managing Your Preferences</h2>
            <p className="text-sm leading-relaxed">You can update your cookie preferences at any time using the cookie banner at the bottom of the page. You can also control cookies via your browser settings.</p>
          </div>

          <p className="text-sm">
            Questions? Contact us at{" "}
            <a href="mailto:hello@novaclub.org" style={{ color: "#3865FF" }}>hello@novaclub.org</a>
          </p>
        </div>
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}