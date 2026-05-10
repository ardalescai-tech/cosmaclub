"use client";

import { useState, useEffect } from "react";

type Donation = {
  id: string;
  amount: number;
  message: string | null;
  isAnonymous: boolean;
  createdAt: string;
  user: { name: string | null; email: string } | null;
};

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/donations")
      .then((r) => r.json())
      .then((data) => {
        setDonations(data);
        setTotal(data.reduce((sum: number, d: Donation) => sum + d.amount, 0));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Donations</h1>
        <p className="text-gray-500 text-sm">All donations received by the club.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Total Donations</p>
          <p className="text-3xl font-semibold text-purple-600">£{total.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Number of Donations</p>
          <p className="text-3xl font-semibold text-blue-600">{donations.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Average Donation</p>
          <p className="text-3xl font-semibold text-green-600">
            £{donations.length > 0 ? (total / donations.length).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No donations yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Donor</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Message</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {d.isAnonymous ? (
                      <p className="text-sm text-gray-400 italic">Anonymous</p>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-800">{d.user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-gray-400">{d.user?.email}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-purple-600">£{d.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{d.message ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(d.createdAt).toLocaleDateString("en-GB")}
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