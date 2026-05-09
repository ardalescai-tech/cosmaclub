import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CosmaClub — Community Tennis Club",
  description:
    "A non-profit community tennis club based in Scotland. Join us for sessions, coaching, competitions and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}