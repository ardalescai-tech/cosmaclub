"use client";

import { useEffect, useState } from "react";

type RoleRequest = {
  id: string;
  requestedRole: string;
  status: string;
  message: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
};

const roleConfig: Record<string, { color: string; bg: string }> = {
  COACH: { color: "#00D4AA", bg: "rgba(0,212,170,0.15)" },
  CAPTAIN: { color: "#FFB800", bg: "rgba(255,184,0,0.15)" },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  PENDING: { color: "#FFB800", bg: "rgba(255,184,0,0.15)" },
  APPROVED: { color: "#00D4AA", bg: "rgba(0,212,170,0.15)" },
  REJECTED: { color: "#FF4D6A", bg: "rgba(255,77,106,0.15)" },
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/requests");
      if (res.ok) setRequests(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchRequests();
    } catch (e) {
      alert("Failed to update request.");
    }
  };

  const filtered = requests.filter((r) => filter === "ALL" || r.status === filter);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Role Requests</h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>
            Review applications for Coach and Captain roles.
          </p>
        </div>
        <div className="flex gap-2">
          {["PENDING", "APPROVED", "REJECTED", "ALL"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === s ? "#3865FF" : "#1A1B2E",
                color: filter === s ? "#fff" : "#A0A3B1",
                border: "1px solid #2A2B3D",
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-white font-semibold mb-1">No requests found</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>
              {filter === "PENDING" ? "No pending applications." : "Nothing here yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y" style={{ borderColor: "#2A2B3D" }}>
            {filtered.map((req) => {
              const role = roleConfig[req.requestedRole] ?? { color: "#A0A3B1", bg: "rgba(160,163,177,0.15)" };
              const status = statusConfig[req.status] ?? statusConfig["PENDING"];
              return (
                <div key={req.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
                        {req.user.name?.split(" ").map((n) => n[0]).join("") ?? "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-white font-medium">{req.user.name ?? "—"}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: role.bg, color: role.color }}>
                            {req.requestedRole}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: status.bg, color: status.color }}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs mb-2" style={{ color: "#6B6E80" }}>
                          {req.user.email} · {new Date(req.createdAt).toLocaleDateString("en-GB")}
                        </p>
                        {req.message && (
                          <p className="text-sm whitespace-pre-line" style={{ color: "#A0A3B1" }}>
                            {req.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {req.status === "PENDING" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleAction(req.id, "approve")}
                          className="px-4 py-2 rounded-lg text-xs font-medium text-white"
                          style={{ background: "#00D4AA" }}>
                          Approve
                        </button>
                        <button onClick={() => handleAction(req.id, "reject")}
                          className="px-4 py-2 rounded-lg text-xs font-medium"
                          style={{ background: "rgba(255,77,106,0.15)", color: "#FF4D6A" }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}