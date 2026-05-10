import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "NovaClub — Community Tennis Club",
  description:
    "The next generation community tennis club. Play, compete, belong.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Poppins', sans-serif" }}>
        <SessionProvider>
          <Navbar />
          {children}
          <CookieBanner />
        </SessionProvider>
      </body>
    </html>
  );
}