import Link from "next/link";

export default function TermsPage() {
  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
        <p className="text-sm mb-10" style={{ color: "#6B6E80" }}>Last updated: June 2025</p>

        <div className="flex flex-col gap-8" style={{ color: "#A0A3B1" }}>
          {[
            { title: "1. Acceptance of Terms", content: "By using the NovaClub website or participating in any club activities, you agree to these Terms and Conditions in full. NovaClub is a non-profit community tennis club based in Motherwell, Scotland." },
            { title: "2. Membership", content: "Membership is open to any individual who agrees to the club's code of conduct. Member pricing is applied once an account is verified by a club administrator. NovaClub reserves the right to suspend or revoke membership for conduct harmful to other members or the club." },
            { title: "3. Bookings & Payments", content: "All session, coaching, and competition bookings require full payment at the time of booking. Payments are processed securely via Stripe. NovaClub does not store card details. Bookings are confirmed only upon successful payment." },
            { title: "4. Cancellations & Refunds", content: "Cancellations made 48+ hours before: full refund. Cancellations 24–48 hours before: 50% refund. Less than 24 hours: no refund. If NovaClub cancels a session, a full refund is issued automatically. Competition entry fees are non-refundable after the registration deadline." },
            { title: "5. Liability & Participation", content: "Participants take part in all NovaClub activities at their own risk. NovaClub carries public liability insurance. Players are responsible for their own health and fitness. NovaClub is not liable for loss or damage to personal property at any of its venues." },
            { title: "6. Venue Rules", content: "Sessions are held at Braidhurst High School Sports Hall, Motherwell. Participants must wear appropriate non-marking indoor footwear, respect the venue facilities, follow all instructions from club staff and coaches, and not bring alcohol or illegal substances to the venue." },
            { title: "7. Non-Profit Status", content: "NovaClub is a non-profit organisation. All revenue is reinvested into club activities, equipment, and community programmes. No profits are distributed to members or directors." },
            { title: "8. Changes to Terms", content: "We reserve the right to update these Terms at any time. Continued use of the site after changes constitutes acceptance of the new Terms. Registered members will be notified of significant changes by email." },
          ].map((section) => (
            <div key={section.title} className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <h2 className="font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}

          <p className="text-sm">
            For any questions, contact us at{" "}
            <a href="mailto:hello@novaclub.org" style={{ color: "#3865FF" }}>hello@novaclub.org</a>
          </p>
        </div>
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Privacy", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}