"use client";

import { useState, useEffect } from "react";

type Coach = {
  id: string;
  qualification: string | null;
  pricePerHour: number;
  isActive: boolean;
  user: { name: string | null; email: string };
};

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coaches")
      .then((r) => r.json())
      .then((data) => {
        setCoaches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Coaches</h1>
        <p className="text-gray-500 text-sm">Manage club coaches.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : coaches.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm mb-2">No coaches registered yet.</p>
            <p className="text-gray-400 text-xs">Coaches register via their own account and get assigned the COACH role.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Qualification</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Price/hr</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#B5D4F4] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#0C447C] font-semibold text-xs">
                          {c.user.name ? c.user.name.split(" ").map((n) => n[0]).join("") : "?"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{c.user.name ?? "No name"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.qualification ?? "—"}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#0C447C]">£{c.pricePerHour}/hr</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}