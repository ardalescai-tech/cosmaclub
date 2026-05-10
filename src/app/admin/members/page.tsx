"use client";

import { useState, useEffect } from "react";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

const roleColors: Record<string, string> = {
  MEMBER: "bg-blue-100 text-blue-800",
  COACH: "bg-green-100 text-green-800",
  ADMIN: "bg-purple-100 text-purple-800",
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Members</h1>
        <p className="text-gray-500 text-sm">All registered members of NovaClub.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No members yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#B5D4F4] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#0C447C] font-semibold text-xs">
                          {m.name ? m.name.split(" ").map((n) => n[0]).join("") : "?"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{m.name ?? "No name"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role]}`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString("en-GB")}
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