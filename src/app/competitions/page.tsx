"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Competition = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  startDate: string;
  endDate: string | null;
  entryFee: number;
  maxPlayers: number | null;
  format: string | null;
  status: string;
  _count: { registrations: number };
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  OPEN: { label: "Registrations Open", bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
  UPCOMING: { label: "Coming Soon", bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  CLOSED: { label: "Closed", bg: "rgba(255,77,106,0.15)", color: "#FF4D6A" },
  ONGOING: { label: "Ongoing", bg: "rgba(255,184,0,0.15)", color: "#FFB800" },
  FINISHED: { label: "Finished", bg: "rgba(107,110,128,0.15)", color: "#6B6E80" },
};

const tabs = [
  { label: "All", value: "ALL" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Open", value: "OPEN" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "FINISHED" },
];

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    fetch("/api/competitions")
      .then((r) => r.json())
      .then((data) => setCompetitions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "ALL"
    ? competitions
    : competitions.filter((c) => c.status === activeTab);

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Competitions</h1>
        <p style={{ color: "#A0A3B1" }}>Join tournaments and show your skills.</p>
      </section>

      {/* Tabs */}
      <section className="px-6 max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.value ? "#3865FF" : "#1A1B2E",
                color: activeTab === tab.value ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {loading ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading competitions...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-white font-semibold mb-2">No competitions found</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>
              {activeTab === "ALL" ? "Check back soon — tournaments will be announced shortly." : "No competitions in this category yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((comp) => {
              const status = statusConfig[comp.status] ?? statusConfig["UPCOMING"];
              const spotsLeft = comp.maxPlayers
                ? comp.maxPlayers - comp._count.registrations
                : null;

              return (
                <div key={comp.id} className="rounded-xl p-6"
                  style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                        {comp.format && (
                          <span className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(255,255,255,0.05)", color: "#A0A3B1" }}>
                            {comp.format}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">{comp.title}</h3>
                      {comp.description && (
                        <p className="text-sm mb-4" style={{ color: "#A0A3B1" }}>{comp.description}</p>
                      )}

                      <div className="flex flex-col gap-1 text-sm" style={{ color: "#A0A3B1" }}>
                        <p>📅 {new Date(comp.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                          {comp.endDate ? ` – ${new Date(comp.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}
                        </p>
                        <p>📍 {comp.location}</p>
                        {spotsLeft !== null && (
                          <p>👥 {spotsLeft} of {comp.maxPlayers} spots available</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-4">
                      <div className="text-left md:text-right">
                        <p className="text-3xl font-bold text-white">
                          {comp.entryFee === 0 ? "Free" : `£${comp.entryFee}`}
                        </p>
                        <p className="text-xs" style={{ color: "#6B6E80" }}>entry fee</p>
                      </div>

                      {comp.status === "OPEN" ? (
                        <Link href={`/competitions/${comp.id}/register`}
                          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
                          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                          Register Now
                        </Link>
                      ) : (
                        <button disabled
                          className="px-6 py-2.5 rounded-xl text-sm font-medium"
                          style={{ background: "#1F2038", color: "#6B6E80", border: "1px solid #2A2B3D" }}>
                          {comp.status === "UPCOMING" ? "Opening Soon" : "Closed"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="px-6 py-8 border-t" style={{ borderColor: "#2A2B3D" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-semibold text-white">NovaClub</p>
          <div className="flex gap-6">
            {["Terms", "Privacy", "Cookies", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm" style={{ color: "#6B6E80" }}>{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}