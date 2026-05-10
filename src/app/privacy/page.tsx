import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: "#6B6E80" }}>Last updated: June 2025</p>

        <div className="flex flex-col gap-6" style={{ color: "#A0A3B1" }}>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-sm leading-relaxed">NovaClub is committed to protecting your personal data and complying with the UK GDPR and the Data Protection Act 2018. <strong className="text-white">Data Controller:</strong> NovaClub, Motherwell, Scotland.</p>
          </div>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-3">What Data We Collect</h2>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li>• <strong className="text-white">Account data:</strong> Name, email, phone number (optional)</li>
              <li>• <strong className="text-white">Booking data:</strong> Sessions, coaching appointments, competition registrations</li>
              <li>• <strong className="text-white">Payment data:</strong> Transaction amounts and Stripe reference IDs. We do NOT store card numbers.</li>
              <li>• <strong className="text-white">Shop data:</strong> Order history and delivery address</li>
              <li>• <strong className="text-white">Usage data:</strong> Pages visited, browser type (only with consent)</li>
            </ul>
          </div>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-3">Who We Share Data With</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                    <th className="text-left py-2 pr-4 font-medium text-white">Service</th>
                    <th className="text-left py-2 font-medium text-white">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Stripe", "Payment processing"],
                    ["Resend", "Transactional emails"],
                    ["Vercel", "Website hosting"],
                    ["Neon", "Database hosting"],
                  ].map(([service, purpose]) => (
                    <tr key={service} style={{ borderBottom: "1px solid #2A2B3D" }}>
                      <td className="py-2 pr-4 text-white">{service}</td>
                      <td className="py-2">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-3">We do not sell your personal data. We do not share data with advertisers.</p>
          </div>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-3">Your Rights Under UK GDPR</h2>
            <p className="text-sm leading-relaxed">You have the right to access, correct, delete, restrict, and port your data, and to withdraw consent at any time. Contact us at <a href="mailto:privacy@novaclub.org" style={{ color: "#3865FF" }}>privacy@novaclub.org</a>. You can also lodge a complaint with the <a href="https://ico.org.uk" target="_blank" style={{ color: "#3865FF" }}>ICO</a>.</p>
          </div>

          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <h2 className="font-semibold text-white mb-3">Data Retention</h2>
            <ul className="text-sm space-y-1">
              <li>• Account data: retained while active + 2 years</li>
              <li>• Booking and payment records: 7 years (legal requirement)</li>
              <li>• Inactive accounts: deleted after 3 years</li>
              <li>• Cookie consent logs: 3 years</li>
            </ul>
          </div>

        </div>
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}