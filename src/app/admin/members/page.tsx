"use client";

import { useState, useEffect } from "react";

type MemberProfile = {
  firstName: string;
  lastName: string;
  phone: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  postcode: string | null;
  memberType: string;
  playingLevel: string;
  heardAboutUs: string | null;
  emergencyName: string | null;
  emergencyPhone: string | null;
  medicalNotes: string | null;
};

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  memberProfile: MemberProfile | null;
};

const roleConfig: Record<string, { bg: string; color: string }> = {
  MEMBER: { bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  COACH: { bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
  CAPTAIN: { bg: "rgba(255,184,0,0.15)", color: "#FFB800" },
  ADMIN: { bg: "rgba(123,44,255,0.15)", color: "#7B2CFF" },
  OWNER: { bg: "rgba(255,77,106,0.15)", color: "#FF4D6A" },
};

const levelConfig: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "Beginner", color: "#A0A3B1" },
  INTERMEDIATE: { label: "Intermediate", color: "#3865FF" },
  ADVANCED: { label: "Advanced", color: "#00D4AA" },
  COMPETITIVE: { label: "Competitive", color: "#FFB800" },
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Member | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) =>
    (m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>
            {members.length} registered member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            background: "#13141F", border: "1px solid #2A2B3D", color: "#fff",
            padding: "8px 16px", borderRadius: "8px", fontSize: "14px",
            outline: "none", width: "260px",
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members list */}
        <div className="md:col-span-2 rounded-xl overflow-hidden"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-white font-semibold mb-1">No members found</p>
              <p className="text-sm" style={{ color: "#A0A3B1" }}>
                {search ? "Try a different search." : "Members will appear here once they register."}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                  {["Member", "Level", "Role", "Joined"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-medium"
                      style={{ color: "#A0A3B1" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const initials = m.name
                    ? m.name.split(" ").map((n) => n[0]).join("")
                    : "?";
                  const role = roleConfig[m.role] ?? roleConfig["MEMBER"];
                  const level = m.memberProfile
                    ? levelConfig[m.memberProfile.playingLevel] ?? levelConfig["BEGINNER"]
                    : null;
                  const isSelected = selected?.id === m.id;

                  return (
                    <tr key={m.id}
                      onClick={() => setSelected(isSelected ? null : m)}
                      style={{
                        borderBottom: i < filtered.length - 1 ? "1px solid #2A2B3D" : "none",
                        background: isSelected ? "rgba(56,101,255,0.08)" : "transparent",
                        cursor: "pointer",
                      }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                            {initials}
                          </div>
                          <div>
                            <p className="text-white font-medium">{m.name ?? "—"}</p>
                            <p className="text-xs" style={{ color: "#6B6E80" }}>{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {level ? (
                          <span className="text-xs font-medium" style={{ color: level.color }}>
                            {level.label}
                          </span>
                        ) : (
                          <span style={{ color: "#6B6E80" }}>—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{ background: role.bg, color: role.color }}>
                          {m.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs" style={{ color: "#A0A3B1" }}>
                        {new Date(m.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Member detail panel */}
        <div className="rounded-xl p-5"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          {!selected ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-3">👆</p>
              <p className="text-white font-medium mb-1">Select a member</p>
              <p className="text-xs" style={{ color: "#A0A3B1" }}>Click any row to view details</p>
            </div>
          ) : (
            <div>
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-5 pb-5"
                style={{ borderBottom: "1px solid #2A2B3D" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                  {selected.name?.split(" ").map((n) => n[0]).join("") ?? "?"}
                </div>
                <div>
                  <p className="text-white font-semibold">{selected.name ?? "—"}</p>
                  <p className="text-xs" style={{ color: "#6B6E80" }}>{selected.email}</p>
                </div>
              </div>

              {selected.memberProfile ? (
                <div className="flex flex-col gap-3 text-sm">

                  <div>
                    <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                      Personal
                    </p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "Full name", value: `${selected.memberProfile.firstName} ${selected.memberProfile.lastName}` },
                        { label: "Phone", value: selected.memberProfile.phone ?? "—" },
                        { label: "Date of birth", value: selected.memberProfile.dateOfBirth ? new Date(selected.memberProfile.dateOfBirth).toLocaleDateString("en-GB") : "—" },
                        { label: "Member type", value: selected.memberProfile.memberType },
                        { label: "Playing level", value: selected.memberProfile.playingLevel },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between">
                          <span style={{ color: "#6B6E80" }}>{label}</span>
                          <span className="text-white text-right ml-2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(selected.memberProfile.address || selected.memberProfile.city) && (
                    <div>
                      <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                        Address
                      </p>
                      <p style={{ color: "#A0A3B1" }}>
                        {[selected.memberProfile.address, selected.memberProfile.city, selected.memberProfile.postcode]
                          .filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}

                  {(selected.memberProfile.emergencyName || selected.memberProfile.emergencyPhone) && (
                    <div>
                      <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                        Emergency Contact
                      </p>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span style={{ color: "#6B6E80" }}>Name</span>
                          <span className="text-white">{selected.memberProfile.emergencyName ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: "#6B6E80" }}>Phone</span>
                          <span className="text-white">{selected.memberProfile.emergencyPhone ?? "—"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selected.memberProfile.medicalNotes && (
                    <div>
                      <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                        Medical Notes
                      </p>
                      <p className="text-xs" style={{ color: "#A0A3B1" }}>
                        {selected.memberProfile.medicalNotes}
                      </p>
                    </div>
                  )}

                  {selected.memberProfile.heardAboutUs && (
                    <div className="flex justify-between">
                      <span style={{ color: "#6B6E80" }}>Heard about us</span>
                      <span className="text-white">{selected.memberProfile.heardAboutUs}</span>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs" style={{ color: "#A0A3B1" }}>
                    This member hasn't completed their profile yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}