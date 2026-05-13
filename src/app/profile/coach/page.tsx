"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CoachProfileEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    qualification: "",
    specialisms: "",
    pricePerHour: "",
    phone: "",
    experience: "",
    instagram: "",
    twitter: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    const role = (session?.user as any)?.role;
    if (status === "authenticated" && !["COACH", "ADMIN", "OWNER"].includes(role)) {
      router.push("/dashboard");
      return;
    }
    if (status === "authenticated") fetchProfile();
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile/coach");
      if (res.ok) {
        const data = await res.json();
        setForm({
          bio: data.bio ?? "",
          qualification: data.qualification ?? "",
          specialisms: data.specialisms?.join(", ") ?? "",
          pricePerHour: data.pricePerHour?.toString() ?? "",
          phone: data.phone ?? "",
          experience: data.experience?.toString() ?? "",
          instagram: data.instagram ?? "",
          twitter: data.twitter ?? "",
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/coach", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          pricePerHour: parseFloat(form.pricePerHour) || 0,
          experience: form.experience ? parseInt(form.experience) : null,
          specialisms: form.specialisms.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const inputStyle = {
    background: "#13141F", border: "1px solid #2A2B3D", color: "#fff",
    width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none",
  };
  const labelStyle = { color: "#A0A3B1", display: "block", fontSize: "14px", marginBottom: "4px" };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
      <p style={{ color: "#A0A3B1" }}>Loading...</p>
    </div>
  );

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Coach Profile</h1>
            <p style={{ color: "#A0A3B1" }}>Update your public profile details.</p>
          </div>
          {saved && (
            <span className="text-sm px-4 py-2 rounded-xl font-medium"
              style={{ background: "rgba(0,212,170,0.15)", color: "#00D4AA" }}>
              ✓ Saved!
            </span>
          )}
        </div>

        <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
            Professional Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={labelStyle}>Price per hour (£) *</label>
              <input name="pricePerHour" type="number" value={form.pricePerHour}
                onChange={handleChange} placeholder="35" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Qualification</label>
              <input name="qualification" value={form.qualification}
                onChange={handleChange} placeholder="LTA Level 3" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Years of experience</label>
              <input name="experience" type="number" value={form.experience}
                onChange={handleChange} placeholder="5" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone number</label>
              <input name="phone" value={form.phone}
                onChange={handleChange} placeholder="+44 7700 000000" style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label style={labelStyle}>Specialisms <span className="text-xs" style={{ color: "#6B6E80" }}>(comma separated)</span></label>
              <input name="specialisms" value={form.specialisms}
                onChange={handleChange} placeholder="Adults, Juniors, Competition" style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label style={labelStyle}>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange}
                placeholder="Tell players about yourself..." rows={4}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>
            Social Media
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={labelStyle}>Instagram username</label>
              <input name="instagram" value={form.instagram}
                onChange={handleChange} placeholder="yourhandle" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Twitter/X username</label>
              <input name="twitter" value={form.twitter}
                onChange={handleChange} placeholder="yourhandle" style={inputStyle} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </section>
    </main>
  );
}