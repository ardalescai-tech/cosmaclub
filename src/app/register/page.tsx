"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    postcode: "",
    emergencyName: "",
    emergencyPhone: "",
    memberType: "ADULT",
    playingLevel: "BEGINNER",
    heardAboutUs: "",
    medicalNotes: "",
    termsAccepted: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.termsAccepted) {
      setError("Please fill in all required fields and accept the terms.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "#13141F",
    border: "1px solid #2A2B3D",
    color: "#fff",
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = { color: "#A0A3B1", display: "block", fontSize: "14px", marginBottom: "4px" };

  if (submitted) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-10 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">🎾</p>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to NovaClub!</h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            Your membership application has been received. You'll get a confirmation email shortly.
          </p>
          <Link href="/"
            className="block w-full py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Go to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            N
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join NovaClub</h1>
          <p style={{ color: "#A0A3B1" }}>Become a member of Motherwell's community tennis club.</p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-medium text-white mb-4 transition-all hover:opacity-90"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: "#2A2B3D" }} />
          <span className="text-sm" style={{ color: "#6B6E80" }}>or complete the form below</span>
          <div className="flex-1 h-px" style={{ background: "#2A2B3D" }} />
        </div>

        {/* Form */}
        <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <h2 className="font-semibold text-white mb-6">Membership Application</h2>

          {/* Personal info */}
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>Personal Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={labelStyle}>First name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange}
                placeholder="John" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange}
                placeholder="Smith" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone number</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+44 7700 000000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date of birth</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange}
                style={{ ...inputStyle, colorScheme: "dark" }} />
            </div>
            <div>
              <label style={labelStyle}>Member type *</label>
              <select name="memberType" value={form.memberType} onChange={handleChange} style={inputStyle}>
                <option value="ADULT">Adult (18+)</option>
                <option value="JUNIOR">Junior (under 18)</option>
                <option value="COACH">Coach</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Playing level</label>
              <select name="playingLevel" value={form.playingLevel} onChange={handleChange} style={inputStyle}>
                <option value="BEGINNER">Beginner — never played before</option>
                <option value="INTERMEDIATE">Intermediate — play occasionally</option>
                <option value="ADVANCED">Advanced — play regularly</option>
                <option value="COMPETITIVE">Competitive — tournament player</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>How did you hear about us?</label>
              <select name="heardAboutUs" value={form.heardAboutUs} onChange={handleChange} style={inputStyle}>
                <option value="">Select...</option>
                <option value="Social media">Social media</option>
                <option value="Friend or family">Friend or family</option>
                <option value="Flyer or poster">Flyer or poster</option>
                <option value="QR code">QR code</option>
                <option value="Search engine">Search engine</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>Address</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label style={labelStyle}>Street address</label>
              <input name="address" value={form.address} onChange={handleChange}
                placeholder="123 Main Street" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input name="city" value={form.city} onChange={handleChange}
                placeholder="Motherwell" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Postcode</label>
              <input name="postcode" value={form.postcode} onChange={handleChange}
                placeholder="ML1 1AA" style={inputStyle} />
            </div>
          </div>

          {/* Emergency contact */}
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>Emergency Contact</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={labelStyle}>Contact name</label>
              <input name="emergencyName" value={form.emergencyName} onChange={handleChange}
                placeholder="Jane Smith" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contact phone</label>
              <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange}
                placeholder="+44 7700 000001" style={inputStyle} />
            </div>
          </div>

          {/* Medical */}
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>Health & Medical</p>
          <div className="mb-6">
            <label style={labelStyle}>Any medical conditions we should be aware of? (optional)</label>
            <textarea name="medicalNotes" value={form.medicalNotes} onChange={handleChange}
              placeholder="e.g. asthma, allergies, injuries..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 mb-6 p-4 rounded-xl"
            style={{ background: "#13141F", border: "1px solid #2A2B3D" }}>
            <input
              type="checkbox"
              name="termsAccepted"
              checked={form.termsAccepted}
              onChange={handleChange}
              style={{ marginTop: "2px", accentColor: "#3865FF", width: "16px", height: "16px" }}
            />
            <p className="text-sm" style={{ color: "#A0A3B1" }}>
              I agree to the{" "}
              <Link href="/terms" className="underline" style={{ color: "#3865FF" }}>Terms & Conditions</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline" style={{ color: "#3865FF" }}>Privacy Policy</Link>
              . I confirm that the information provided is accurate.
            </p>
          </div>

          {error && (
            <p className="text-sm mb-4" style={{ color: "#FF4D6A" }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !form.termsAccepted}
            className="w-full py-3.5 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {loading ? "Submitting..." : "Submit Membership Application"}
          </button>
        </div>
      </section>
    </main>
  );
}