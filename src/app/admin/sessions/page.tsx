"use client";

import { useState } from "react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminSessionsPage() {
  const [showForm, setShowForm] = useState(false);
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
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Sessions</h1>
          <p className="text-gray-500 text-sm">Manage weekly play sessions.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Session"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Open Play — Adults" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]">
                <option value="OPEN_PLAY">Open Play</option>
                <option value="JUNIOR">Junior</option>
                <option value="SOCIAL">Social</option>
                <option value="COACHED">Coached</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Day of week *</label>
              <select name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]">
                {DAY_NAMES.map((day, i) => (
                  <option key={day} value={i}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Court</label>
              <input name="court" value={form.court} onChange={handleChange} placeholder="Court 1 & 2" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start time *</label>
              <input name="startTime" type="time" value={form.startTime} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End time *</label>
              <input name="endTime" type="time" value={form.endTime} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Standard price (£) *</label>
              <input name="priceStd" type="number" value={form.priceStd} onChange={handleChange} placeholder="6" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Member price (£) *</label>
              <input name="priceMember" type="number" value={form.priceMember} onChange={handleChange} placeholder="4" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Junior price (£)</label>
              <input name="priceJunior" type="number" value={form.priceJunior} onChange={handleChange} placeholder="3" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max players</label>
              <input name="maxPlayers" type="number" value={form.maxPlayers} onChange={handleChange} placeholder="20" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
          >
            Create Session
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <p className="text-sm text-gray-500">Sessions will appear here once added from the database.</p>
        </div>
      </div>
    </div>
  );
}