"use client";

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
  UPCOMING: { label: "Upcoming", bg: "rgba(56,101,255,0.15)", color: "#3865FF" },
  OPEN: { label: "Open", bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
  CLOSED: { label: "Closed", bg: "rgba(255,77,106,0.15)", color: "#FF4D6A" },
  ONGOING: { label: "Ongoing", bg: "rgba(255,184,0,0.15)", color: "#FFB800" },
  FINISHED: { label: "Finished", bg: "rgba(107,110,128,0.15)", color: "#6B6E80" },
};

const STATUS_OPTIONS = ["UPCOMING", "OPEN", "CLOSED", "ONGOING", "FINISHED"];

export default function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "School Sports Hall, CosmaClub",
    startDate: "",
    endDate: "",
    entryFee: "",
    maxPlayers: "",
    format: "",
    status: "UPCOMING",
    rules: "",
  });

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/competitions");
      if (res.ok) setCompetitions(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompetitions(); }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.startDate) {
      alert("Title and start date are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          location: form.location,
          startDate: new Date(form.startDate).toISOString(),
          endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
          entryFee: form.entryFee ? parseFloat(form.entryFee) : 0,
          maxPlayers: form.maxPlayers ? parseInt(form.maxPlayers) : null,
          format: form.format || null,
          status: form.status,
          rules: form.rules || null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({
          title: "", description: "", location: "School Sports Hall, CosmaClub",
          startDate: "", endDate: "", entryFee: "", maxPlayers: "",
          format: "", status: "UPCOMING", rules: "",
        });
        fetchCompetitions();
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

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/competitions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchCompetitions();
    } catch (e) {
      alert("Failed to update.");
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm outline-none";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Competitions</h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>Manage tournaments and events.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          {showForm ? "Cancel" : "+ Add Competition"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h2 className="font-semibold text-white mb-4">New Competition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Summer Singles 2025" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Format</label>
              <input name="format" value={form.format} onChange={handleChange}
                placeholder="Round Robin, Knockout..." className={inputClass} />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Start Date *</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange}
                className={inputClass} />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>End Date</label>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange}
                className={inputClass} />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Entry Fee (£)</label>
              <input name="entryFee" type="number" value={form.entryFee} onChange={handleChange}
                placeholder="0" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Max Players</label>
              <input name="maxPlayers" type="number" value={form.maxPlayers} onChange={handleChange}
                placeholder="16" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Location</label>
              <input name="location" value={form.location} onChange={handleChange}
                className={inputClass} />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{statusConfig[s].label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Short description..." rows={2}
                className={inputClass} style={{ resize: "vertical" }} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Rules</label>
              <textarea name="rules" value={form.rules} onChange={handleChange}
                placeholder="Competition rules..." rows={3}
                className={inputClass} style={{ resize: "vertical" }} />
            </div>

          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {submitting ? "Creating..." : "Create Competition"}
          </button>
        </div>
      )}

      {/* List */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading...</p>
          </div>
        ) : competitions.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-white font-semibold mb-1">No competitions yet</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Add one using the button above.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                {["Title", "Date", "Format", "Entry", "Players", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium" style={{ color: "#A0A3B1" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competitions.map((comp, i) => {
                const status = statusConfig[comp.status] ?? statusConfig["UPCOMING"];
                return (
                  <tr key={comp.id}
                    style={{ borderBottom: i < competitions.length - 1 ? "1px solid #2A2B3D" : "none" }}>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{comp.title}</p>
                      {comp.description && (
                        <p className="text-xs mt-0.5 truncate max-w-[200px]" style={{ color: "#6B6E80" }}>
                          {comp.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#A0A3B1" }}>
                      {new Date(comp.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#A0A3B1" }}>
                      {comp.format ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-white font-medium">
                      {comp.entryFee === 0 ? "Free" : `£${comp.entryFee}`}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#A0A3B1" }}>
                      {comp._count.registrations}
                      {comp.maxPlayers ? ` / ${comp.maxPlayers}` : ""}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={comp.status}
                        onChange={(e) => updateStatus(comp.id, e.target.value)}
                        className="text-xs px-2 py-1.5 rounded-lg outline-none"
                        style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff" }}>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{statusConfig[s].label}</option>
                        ))}
                      </select>
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