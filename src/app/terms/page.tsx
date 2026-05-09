import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="text-3xl font-semibold text-[#0C447C] mb-2">Terms & Conditions</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
            <p>By using the CosmaClub website or participating in any club activities, you agree to these Terms and Conditions in full. CosmaClub is a non-profit community tennis club based in Motherwell, Scotland.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Membership</h2>
            <p>Membership is open to any individual who agrees to the club's code of conduct. Member pricing is applied once an account is verified by a club administrator. CosmaClub reserves the right to suspend or revoke membership for conduct harmful to other members or the club.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Bookings & Payments</h2>
            <p>All session, coaching, and competition bookings require full payment at the time of booking. Payments are processed securely via Stripe. CosmaClub does not store card details. Bookings are confirmed only upon successful payment.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Cancellations & Refunds</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cancellations made 48 hours or more before the session: full refund.</li>
              <li>Cancellations made 24–48 hours before: 50% refund.</li>
              <li>Cancellations made less than 24 hours before: no refund.</li>
              <li>If CosmaClub cancels a session, a full refund will be issued automatically.</li>
              <li>Competition entry fees are non-refundable after the registration deadline.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">5. Shop & Products</h2>
            <p>All shop items are personalised with the CosmaClub logo and may take 5–10 business days to produce. Returns are accepted within 14 days for defective or incorrect items. Size exchanges are accepted within 30 days where stock allows.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">6. Coaching Sessions</h2>
            <p>Coach sessions must be paid in full at the time of booking. Coaches are responsible for their own qualifications and insurance. CosmaClub is not liable for injury arising from coaching sessions provided the club has taken reasonable precautions.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">7. Liability & Participation</h2>
            <p>Participants take part in all CosmaClub activities at their own risk. CosmaClub carries public liability insurance covering club-organised activities. Players are responsible for their own health and fitness. CosmaClub is not liable for loss or damage to personal property at any of its venues.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">8. Venue Rules</h2>
            <p>Sessions are held at Braidhurst High School Sports Hall, Motherwell. Participants must:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Wear appropriate non-marking indoor footwear.</li>
              <li>Respect the venue facilities and equipment.</li>
              <li>Follow all instructions from club staff and coaches.</li>
              <li>Not bring alcohol or illegal substances to the venue.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">9. Non-Profit Status</h2>
            <p>CosmaClub is a non-profit organisation. All revenue is reinvested into club activities, equipment, and community programmes. No profits are distributed to members or directors.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">10. Changes to Terms</h2>
            <p>We reserve the right to update these Terms at any time. Continued use of the site after changes constitutes acceptance of the new Terms. Registered members will be notified of significant changes by email.</p>
          </section>

          <section>
            <p>For any questions, contact us at <a href="mailto:hello@cosmaclub.org" className="text-[#185FA5] underline">hello@cosmaclub.org</a></p>
          </section>

        </div>
      </section>

      <footer className="bg-[#042C53] px-6 py-8 mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">© 2025 CosmaClub. Non-profit community tennis club · Scotland</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/50 text-sm hover:text-white">Privacy</Link>
            <Link href="/cookies" className="text-white/50 text-sm hover:text-white">Cookies</Link>
            <Link href="/contact" className="text-white/50 text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}