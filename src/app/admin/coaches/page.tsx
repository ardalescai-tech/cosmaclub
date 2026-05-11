"use client";

import { useEffect, useState } from "react";

const specializationColors = [
  { bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  { bg: "rgba(123,44,255,0.15)", color: "#7B2CFF" },
  { bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
];

type Coach = {
  id: string;
  bio: string | null;
  qualification: string | null;
  specialisms: string[];
  pricePerHour: number;
  isActive: boolean;
  user: { name: string | null; email: string };
};

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    userEmail: "",
    bio: "",
    qualification: "",
    specialisms: "",
    pricePerHour: "",
  });

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coaches");
      if (res.ok) {
        const data = await res.json();
        setCoaches(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.userEmail || !form.pricePerHour) {
      alert("User email and price are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/coaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: form.userEmail,
          bio: form.bio || null,
          qualification: form.qualification || null,
          specialisms: form.specialisms
            ? form.specialisms.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          pricePerHour: parseFloat(form.pricePerHour),
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ userEmail: "", bio: "", qualification: "", specialisms: "", pricePerHour: "" });
        fetchCoaches();
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Something went wrong"));
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/coaches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) fetchCoaches();
    } catch (e) {
      alert("Failed to update coach.");
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm outline-none";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Coaches</h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>
            Manage coach profiles.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          {showForm ? "Cancel" : "+ Add Coach"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h2 className="font-semibold text-white mb-4">New Coach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>
                User Email * <span className="text-xs" style={{ color: "#6B6E80" }}>(must already have an account)</span>
              </label>
              <input
                name="userEmail"
                value={form.userEmail}
                onChange={handleChange}
                placeholder="coach@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Qualification</label>
              <input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="LTA Level 3"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Price per hour (£) *</label>
              <input
                name="pricePerHour"
                type="number"
                value={form.pricePerHour}
                onChange={handleChange}
                placeholder="35"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>
                Specialisms <span className="text-xs" style={{ color: "#6B6E80" }}>(comma separated)</span>
              </label>
              <input
                name="specialisms"
                value={form.specialisms}
                onChange={handleChange}
                placeholder="Adults, Juniors, Competition"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Short description about the coach..."
                rows={3}
                className={inputClass}
                style={{ resize: "vertical" }}
              />
            </div>

          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {submitting ? "Creating..." : "Create Coach"}
          </button>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading coaches...</p>
          </div>
        ) : coaches.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">👨‍🏫</p>
            <p className="text-white font-semibold mb-1">No coaches yet</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Add a coach using the button above.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                {["Coach", "Qualification", "Specialisms", "Price/hr", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium" style={{ color: "#A0A3B1" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach, i) => {
                const initials = coach.user.name
                  ? coach.user.name.split(" ").map((n) => n[0]).join("")
                  : "?";
                return (
                  <tr
                    key={coach.id}
                    style={{ borderBottom: i < coaches.length - 1 ? "1px solid #2A2B3D" : "none" }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                          {initials}
                        </div>
                        <div>
                          <p className="text-white font-medium">{coach.user.name ?? "—"}</p>
                          <p className="text-xs" style={{ color: "#6B6E80" }}>{coach.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4" style={{ color: "#A0A3B1" }}>
                      {coach.qualification ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {coach.specialisms.length > 0
                          ? coach.specialisms.map((s, idx) => (
                              <span
                                key={s}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  background: specializationColors[idx % 3].bg,
                                  color: specializationColors[idx % 3].color,
                                }}>
                                {s}
                              </span>
                            ))
                          : <span style={{ color: "#6B6E80" }}>—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white font-medium">
                      £{coach.pricePerHour}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: coach.isActive ? "rgba(0,212,170,0.15)" : "rgba(255,77,106,0.15)",
                          color: coach.isActive ? "#00D4AA" : "#FF4D6A",
                        }}>
                        {coach.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(coach.id, coach.isActive)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium"
                        style={{
                          background: coach.isActive ? "rgba(255,77,106,0.15)" : "rgba(0,212,170,0.15)",
                          color: coach.isActive ? "#FF4D6A" : "#00D4AA",
                        }}>
                        {coach.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}