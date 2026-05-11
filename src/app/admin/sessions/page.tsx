"use client";

import { useState } from "react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminSessionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "OPEN_PLAY",
    dayOfWeek: "1",
    startTime: "",
    endTime: "",
    court: "",
    priceStd: "",
    priceMember: "",
    priceJunior: "",
    maxPlayers: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.startTime || !form.endTime || !form.priceStd || !form.priceMember) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dayOfWeek: parseInt(form.dayOfWeek),
          priceStd: parseFloat(form.priceStd),
          priceMember: parseFloat(form.priceMember),
          priceJunior: form.priceJunior ? parseFloat(form.priceJunior) : null,
          maxPlayers: form.maxPlayers ? parseInt(form.maxPlayers) : null,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", type: "OPEN_PLAY", dayOfWeek: "1", startTime: "", endTime: "", court: "", priceStd: "", priceMember: "", priceJunior: "", maxPlayers: "" });
        alert("Session created!");
        window.location.reload();
      } else {
        const err = await res.json();
        alert("Error: " + (err.error || "Something went wrong"));
      }
    } catch (e) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Sessions</h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>Manage weekly play sessions.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          {showForm ? "Cancel" : "+ Add Session"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h2 className="font-semibold text-white mb-4">New Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="Open Play — Adults"
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Type *</label>
              <select
                name="type" value={form.type} onChange={handleChange}
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                <option value="OPEN_PLAY">Open Play</option>
                <option value="JUNIOR">Junior</option>
                <option value="SOCIAL">Social</option>
                <option value="COACHED">Coached</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Day of week *</label>
              <select
                name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange}
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
                {DAY_NAMES.map((day, i) => (
                  <option key={day} value={i}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Court</label>
              <input
                name="court" value={form.court} onChange={handleChange}
                placeholder="Court 1 & 2"
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Start time *</label>
              <input
                name="startTime" type="time" value={form.startTime} onChange={handleChange}
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none", colorScheme: "dark" }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>End time *</label>
              <input
                name="endTime" type="time" value={form.endTime} onChange={handleChange}
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none", colorScheme: "dark" }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Standard price (£) *</label>
              <input
                name="priceStd" type="number" value={form.priceStd} onChange={handleChange}
                placeholder="6"
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Member price (£) *</label>
              <input
                name="priceMember" type="number" value={form.priceMember} onChange={handleChange}
                placeholder="4"
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Junior price (£)</label>
              <input
                name="priceJunior" type="number" value={form.priceJunior} onChange={handleChange}
                placeholder="3"
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: "#A0A3B1" }}>Max players</label>
              <input
                name="maxPlayers" type="number" value={form.maxPlayers} onChange={handleChange}
                placeholder="20"
                style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}
              />
            </div>

          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {loading ? "Creating..." : "Create Session"}
          </button>
        </div>
      )}

      <div className="rounded-xl" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
        <div className="p-5">
          <p className="text-sm" style={{ color: "#A0A3B1" }}>Sessions appear on the public page once added.</p>
        </div>
      </div>
    </div>
  );
}