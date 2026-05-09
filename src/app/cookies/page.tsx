import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <nav className="bg-[#0C447C] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#0C447C] font-bold text-sm">CC</span>
          </div>
          <span className="text-white font-semibold text-lg">CosmaClub</span>
        </Link>
      </nav>

      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2025</p>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <p>CosmaClub is committed to protecting your personal data and complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. <strong>Data Controller:</strong> CosmaClub, Motherwell, Scotland.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">1. What Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account data:</strong> Name, email address, phone number (optional).</li>
              <li><strong>Booking data:</strong> Session bookings, coaching appointments, competition registrations.</li>
              <li><strong>Payment data:</strong> Transaction amounts and Stripe payment reference IDs. We do NOT store card numbers.</li>
              <li><strong>Shop data:</strong> Order history and delivery address.</li>
              <li><strong>Donation data:</strong> Amount, date, optional message.</li>
              <li><strong>Usage data:</strong> Pages visited, browser type, device type (only with your consent).</li>
              <li><strong>Cookie consent logs:</strong> Your consent choices and the date consent was given.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and confirm bookings, payments, and orders.</li>
              <li>To send confirmation and reminder emails.</li>
              <li>To manage your club membership and access levels.</li>
              <li>To communicate important club announcements.</li>
              <li>To improve our website and services (with your consent).</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Who We Share Data With</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#E6F1FB]">
                    <th className="text-left p-3 border border-gray-200 font-medium">Service</th>
                    <th className="text-left p-3 border border-gray-200 font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Stripe", "Payment processing"],
                    ["Resend", "Transactional email delivery"],
                    ["Vercel", "Website hosting"],
                    ["Neon", "Secure database hosting"],
                  ].map(([service, purpose]) => (
                    <tr key={service}>
                      <td className="p-3 border border-gray-200 font-medium">{service}</td>
                      <td className="p-3 border border-gray-200">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">We do not sell your personal data to any third party. We do not share your data with advertisers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account data: retained while your account is active + 2 years.</li>
              <li>Booking and payment records: 7 years (legal requirement).</li>
              <li>Inactive accounts: deleted after 3 years of inactivity.</li>
              <li>Cookie consent logs: 3 years.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Your Rights Under UK GDPR</h2>
            <p>You have the right to: access your data, correct inaccurate data, delete your data, restrict processing, data portability, and withdraw consent at any time.</p>
            <p className="mt-2">To exercise any of these rights, contact us at <a href="mailto:privacy@cosmaclub.org" className="text-[#185FA5] underline">privacy@cosmaclub.org</a>. You also have the right to lodge a complaint with the <a href="https://ico.org.uk" target="_blank" className="text-[#185FA5] underline">ICO</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Data Security</h2>
            <p>All data is transmitted over HTTPS. Passwords are hashed using industry-standard algorithms. Access to production systems is restricted to authorised administrators only.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Children's Privacy</h2>
            <p>For members under 13, parental or guardian consent is required for account creation. We do not knowingly collect personal data from children under 13 without parental consent.</p>
          </section>

        </div>
      </section>

      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">© 2025 CosmaClub. Non-profit community tennis club · Scotland</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-white/50 text-sm hover:text-white">Terms</Link>
            <Link href="/cookies" className="text-white/50 text-sm hover:text-white">Cookies</Link>
            <Link href="/contact" className="text-white/50 text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}