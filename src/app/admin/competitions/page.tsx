"use client";

import { useState } from "react";

export default function AdminCompetitionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    format: "",
    description: "",
    startDate: "",
    endDate: "",
    entryFee: "",
    maxPlayers: "",
    organiser: "",
    prizes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        format: form.format,
        description: form.description,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : null,
        entryFee: parseFloat(form.entryFee) || 0,
        maxPlayers: form.maxPlayers ? parseInt(form.maxPlayers) : null,
        status: "UPCOMING",
      }),
    });
    if (res.ok) {
      setShowForm(false);
      alert("Competition created!");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Competitions</h1>
          <p className="text-gray-500 text-sm">Manage tournaments and competitions.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Competition"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Competition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Summer Championship 2025" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Format *</label>
              <input name="format" value={form.format} onChange={handleChange} placeholder="Singles, Mixed Doubles, U14..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start date *</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End date</label>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Entry fee (£)</label>
              <input name="entryFee" type="number" value={form.entryFee} onChange={handleChange} placeholder="5" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max players</label>
              <input name="maxPlayers" type="number" value={form.maxPlayers} onChange={handleChange} placeholder="32" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Organiser</label>
              <input name="organiser" value={form.organiser} onChange={handleChange} placeholder="NovaClub" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Prizes</label>
              <input name="prizes" value={form.prizes} onChange={handleChange} placeholder="1st: Trophy + £50, 2nd: Medal..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the competition..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#185FA5] resize-none h-24" />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0C447C] transition-colors"
          >
            Create Competition
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <p className="text-sm text-gray-500">Competitions will appear here once added.</p>
        </div>
      </div>
    </div>
  );
}