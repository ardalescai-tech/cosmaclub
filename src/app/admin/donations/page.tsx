"use client";

import { useState, useEffect } from "react";

type Donation = {
  id: string;
  amount: number;
  message: string | null;
  isAnonymous: boolean;
  createdAt: string;
  user: { name: string | null; email: string } | null;
  goal: { title: string } | null;
};

type DonationGoal = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  targetAmount: number;
  isActive: boolean;
  raised: number;
};

const emptyGoalForm = {
  title: "",
  description: "",
  category: "",
  targetAmount: "",
};

const tabs = ["Overview", "Donations", "Goals"];

export default function AdminDonationsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [goals, setGoals] = useState<DonationGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState(emptyGoalForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = () => {
    fetch("/api/admin/donations")
      .then((r) => r.json())
      .then((data) => {
        setDonations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/admin/donation-goals")
      .then((r) => r.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => { fetchAll(); }, []);

  const total = donations.reduce((sum, d) => sum + d.amount, 0);
  const thisMonth = donations.filter((d) => {
    const date = new Date(d.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((sum, d) => sum + d.amount, 0);

  // Top donors
  const donorMap: Record<string, { name: string; email: string; total: number }> = {};
  donations.forEach((d) => {
    if (d.isAnonymous || !d.user) return;
    const key = d.user.email;
    if (!donorMap[key]) donorMap[key] = { name: d.user.name ?? "Unknown", email: key, total: 0 };
    donorMap[key].total += d.amount;
  });
  const topDonors = Object.values(donorMap).sort((a, b) => b.total - a.total).slice(0, 5);

  const handleGoalSubmit = async () => {
    if (!goalForm.title.trim() || !goalForm.targetAmount) {
      setError("Title and target amount are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/donation-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goalForm.title.trim(),
          description: goalForm.description || null,
          category: goalForm.category || null,
          targetAmount: parseFloat(goalForm.targetAmount),
        }),
      });
      if (res.ok) {
        setGoalForm(emptyGoalForm);
        setShowGoalForm(false);
        fetchAll();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleGoal = async (id: string, isActive: boolean) => {
    await fetch("/api/admin/donation-goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    fetchAll();
  };

  const deleteGoal = async (id: string) => {
    if (!confirm("Delete this goal?")) return;
    await fetch(`/api/admin/donation-goals?id=${id}`, { method: "DELETE" });
    fetchAll();
  };

  const inputStyle = {
    background: "#13141F", border: "1px solid #2A2B3D", color: "#fff",
    width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none",
  };
  const labelStyle = { color: "#A0A3B1", display: "block", fontSize: "14px", marginBottom: "4px" };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Donations</h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>Manage donations and fundraising goals.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab ? "#3865FF" : "#1A1B2E",
              color: activeTab === tab ? "#fff" : "#A0A3B1",
              border: "1px solid #2A2B3D",
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "Overview" && (
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Raised", value: `£${total.toFixed(2)}`, color: "#7B2CFF" },
              { label: "This Month", value: `£${thisMonthTotal.toFixed(2)}`, color: "#3865FF" },
              { label: "Donations", value: donations.length.toString(), color: "#00D4AA" },
              { label: "Avg Donation", value: `£${donations.length > 0 ? (total / donations.length).toFixed(2) : "0.00"}`, color: "#FFB800" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-5"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <p className="text-xs mb-1" style={{ color: "#6B6E80" }}>{stat.label}</p>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Top donors */}
          <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "#3865FF" }}>
              Top Donors
            </p>
            {topDonors.length === 0 ? (
              <p className="text-sm" style={{ color: "#A0A3B1" }}>No donations yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topDonors.map((donor, i) => (
                  <div key={donor.email} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold w-6" style={{ color: "#6B6E80" }}>#{i + 1}</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        {donor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{donor.name}</p>
                        <p className="text-xs" style={{ color: "#6B6E80" }}>{donor.email}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#7B2CFF" }}>
                      £{donor.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Goals progress */}
          {goals.filter(g => g.isActive).length > 0 && (
            <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                Active Goals Progress
              </p>
              <div className="flex flex-col gap-4">
                {goals.filter(g => g.isActive).map((goal) => {
                  const percent = Math.min(Math.round((goal.raised / goal.targetAmount) * 100), 100);
                  return (
                    <div key={goal.id}>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm text-white">{goal.title}</p>
                        <p className="text-sm font-bold" style={{ color: "#3865FF" }}>{percent}%</p>
                      </div>
                      <div className="w-full rounded-full h-2 mb-1" style={{ background: "#2A2B3D" }}>
                        <div className="h-2 rounded-full"
                          style={{ width: `${percent}%`, background: "linear-gradient(90deg, #3865FF, #7B2CFF)" }} />
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: "#6B6E80" }}>
                        <span>£{goal.raised.toFixed(2)} raised</span>
                        <span>£{goal.targetAmount.toFixed(2)} goal</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DONATIONS TAB */}
      {activeTab === "Donations" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading...</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-4xl mb-3">💜</p>
              <p className="text-white font-semibold mb-1">No donations yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                  {["Donor", "Amount", "Goal", "Message", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-medium" style={{ color: "#A0A3B1" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: i < donations.length - 1 ? "1px solid #2A2B3D" : "none" }}>
                    <td className="px-5 py-4">
                      {d.isAnonymous ? (
                        <p className="text-sm italic" style={{ color: "#6B6E80" }}>Anonymous</p>
                      ) : (
                        <div>
                          <p className="text-white font-medium">{d.user?.name ?? "Unknown"}</p>
                          <p className="text-xs" style={{ color: "#6B6E80" }}>{d.user?.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-bold" style={{ color: "#7B2CFF" }}>
                      £{d.amount.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#A0A3B1" }}>
                      {d.goal?.title ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#A0A3B1" }}>
                      {d.message ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#A0A3B1" }}>
                      {new Date(d.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* GOALS TAB */}
      {activeTab === "Goals" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button onClick={() => { setShowGoalForm(!showGoalForm); setError(""); }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              {showGoalForm ? "Cancel" : "+ New Goal"}
            </button>
          </div>

          {showGoalForm && (
            <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "#3865FF" }}>
                New Goal
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label style={labelStyle}>Title *</label>
                  <input value={goalForm.title}
                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                    placeholder="e.g. New Court Equipment" style={inputStyle} />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Description (optional)</label>
                  <input value={goalForm.description}
                    onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                    placeholder="What is this goal for?" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Category (optional)</label>
                  <input value={goalForm.category}
                    onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                    placeholder="e.g. Equipment, Events..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Target Amount (£) *</label>
                  <input type="number" value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                    placeholder="500" style={inputStyle} />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl"
                  style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)" }}>
                  <p className="text-sm" style={{ color: "#FF4D6A" }}>⚠ {error}</p>
                </div>
              )}

              <button onClick={handleGoalSubmit} disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                {submitting ? "Saving..." : "Save Goal"}
              </button>
            </div>
          )}

          <div className="rounded-xl overflow-hidden" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            {goals.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-white font-semibold mb-1">No goals yet</p>
                <p className="text-sm" style={{ color: "#A0A3B1" }}>Create a fundraising goal above.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                    {["Goal", "Progress", "Status", ""].map((h) => (
                      <th key={h} className="text-left px-5 py-3 font-medium" style={{ color: "#A0A3B1" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {goals.map((goal, i) => {
                    const percent = Math.min(Math.round((goal.raised / goal.targetAmount) * 100), 100);
                    return (
                      <tr key={goal.id}
                        style={{ borderBottom: i < goals.length - 1 ? "1px solid #2A2B3D" : "none" }}>
                        <td className="px-5 py-4">
                          <p className="text-white font-medium">{goal.title}</p>
                          {goal.category && (
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(56,101,255,0.15)", color: "#3865FF" }}>
                              {goal.category}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4" style={{ minWidth: "180px" }}>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-full h-1.5" style={{ background: "#2A2B3D" }}>
                              <div className="h-1.5 rounded-full"
                                style={{ width: `${percent}%`, background: "linear-gradient(90deg, #3865FF, #7B2CFF)" }} />
                            </div>
                            <span className="text-xs flex-shrink-0" style={{ color: "#A0A3B1" }}>
                              £{goal.raised.toFixed(0)}/£{goal.targetAmount.toFixed(0)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: goal.isActive ? "rgba(0,212,170,0.15)" : "rgba(160,163,177,0.15)",
                              color: goal.isActive ? "#00D4AA" : "#A0A3B1",
                            }}>
                            {goal.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => toggleGoal(goal.id, goal.isActive)}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium"
                              style={{
                                background: goal.isActive ? "rgba(255,77,106,0.15)" : "rgba(0,212,170,0.15)",
                                color: goal.isActive ? "#FF4D6A" : "#00D4AA",
                              }}>
                              {goal.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button onClick={() => deleteGoal(goal.id)}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium"
                              style={{ background: "rgba(255,77,106,0.1)", color: "#FF4D6A" }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}