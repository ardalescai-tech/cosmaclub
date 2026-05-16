"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type RegistrationType = "PLAYER" | "COACH" | "CAPTAIN" | null;

type FormErrors = Partial<Record<string, string>>;

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  if (!phone) return true; // optional
  return /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/.test(phone.replace(/\s/g, "")) ||
    /^\+?[\d\s\-]{7,15}$/.test(phone);
}

function validatePostcode(postcode: string) {
  if (!postcode) return true; // optional
  return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postcode.trim());
}

function validateName(name: string) {
  return /^[a-zA-ZÀ-ž\s'\-]{2,}$/.test(name.trim());
}

export default function RegisterPage() {
  const [regType, setRegType] = useState<RegistrationType>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    emergencyName: "",
    emergencyPhone: "",
    playingLevel: "BEGINNER",
    heardAboutUs: "",
    medicalNotes: "",
    experience: "",
    qualification: "",
    bio: "",
    requestMessage: "",
    termsAccepted: false,
  });
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm({ ...form, [name]: newValue });
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const errors: FormErrors = {};

    if (!form.firstName.trim()) {
      errors.firstName = "First name is required.";
    } else if (!validateName(form.firstName)) {
      errors.firstName = "First name can only contain letters.";
    }

    if (!form.lastName.trim()) {
      errors.lastName = "Last name is required.";
    } else if (!validateName(form.lastName)) {
      errors.lastName = "Last name can only contain letters.";
    }

    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (form.phone && !validatePhone(form.phone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (form.emergencyPhone && !validatePhone(form.emergencyPhone)) {
      errors.emergencyPhone = "Please enter a valid emergency phone number.";
    }

    if (form.postcode && !validatePostcode(form.postcode)) {
      errors.postcode = "Please enter a valid UK postcode (e.g. ML1 1AA).";
    }

    // DOB validation
    if (dob.day && dob.month && dob.year) {
      const dobDate = new Date(`${dob.year}-${String(dob.month).padStart(2, "0")}-${String(dob.day).padStart(2, "0")}`);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (isNaN(dobDate.getTime())) {
        errors.dob = "Please enter a valid date of birth.";
      } else if (dobDate > today) {
        errors.dob = "Date of birth cannot be in the future.";
      } else if (age < 5) {
        errors.dob = "Age must be at least 5 years.";
      }
    }

    if (!form.termsAccepted) {
      errors.terms = "You must accept the Terms & Conditions.";
    }

    // Coach/Captain extra
    if (regType === "COACH" || regType === "CAPTAIN") {
      if (!form.bio.trim()) {
        errors.bio = "Please tell us about yourself.";
      } else if (form.bio.trim().length < 20) {
        errors.bio = "Bio must be at least 20 characters.";
      }
      if (form.experience && (isNaN(Number(form.experience)) || Number(form.experience) < 0)) {
        errors.experience = "Please enter a valid number of years.";
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors below before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const dateOfBirth = dob.day && dob.month && dob.year
        ? new Date(`${dob.year}-${String(dob.month).padStart(2, "0")}-${String(dob.day).padStart(2, "0")}`).toISOString()
        : null;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dateOfBirth, registrationType: regType }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError?: boolean) => ({
    background: "#13141F",
    border: `1px solid ${hasError ? "#FF4D6A" : "#2A2B3D"}`,
    color: "#fff",
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  });

  const labelStyle = { color: "#A0A3B1", display: "block", fontSize: "14px", marginBottom: "4px" };
  const errorStyle = { color: "#FF4D6A", fontSize: "12px", marginTop: "4px" };

  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? <p style={errorStyle}>⚠ {fieldErrors[name]}</p> : null;

  if (submitted) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-10 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">{regType === "PLAYER" ? "🎾" : regType === "COACH" ? "👨‍🏫" : "⚖️"}</p>
          <h2 className="text-2xl font-bold text-white mb-2">
            {regType === "PLAYER" ? "Welcome to NovaClub!" : "Application received!"}
          </h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            {regType === "PLAYER"
              ? "Your membership has been registered successfully."
              : `Your ${regType?.toLowerCase()} application has been submitted. The admin will review it shortly.`}
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

  if (!regType) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
              N
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join NovaClub</h1>
            <p style={{ color: "#A0A3B1" }}>How would you like to join?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { type: "PLAYER" as RegistrationType, icon: "🎾", title: "Player", desc: "Join as a member, book sessions, compete in tournaments and climb the leaderboard.", color: "#3865FF", badge: "Instant approval" },
              { type: "COACH" as RegistrationType, icon: "👨‍🏫", title: "Coach", desc: "Apply to become a coach. Share your qualifications and start taking bookings.", color: "#00D4AA", badge: "Requires approval" },
              { type: "CAPTAIN" as RegistrationType, icon: "⚖️", title: "Captain", desc: "Apply to become a match captain. You'll assist in recording match scores.", color: "#FFB800", badge: "Requires approval" },
            ].map((opt) => (
              <button key={opt.type} onClick={() => setRegType(opt.type)}
                className="rounded-xl p-6 text-left transition-all hover:scale-105"
                style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
                <span className="text-4xl block mb-3">{opt.icon}</span>
                <h3 className="text-white font-bold text-lg mb-2">{opt.title}</h3>
                <p className="text-sm mb-4" style={{ color: "#A0A3B1" }}>{opt.desc}</p>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: `${opt.color}22`, color: opt.color }}>
                  {opt.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white transition-all hover:opacity-90"
              style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <button onClick={() => setRegType(null)}
          className="flex items-center gap-2 text-sm mb-8"
          style={{ color: "#A0A3B1" }}>
          ← Back to options
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {regType === "PLAYER" ? "🎾" : regType === "COACH" ? "👨‍🏫" : "⚖️"}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {regType === "PLAYER" ? "Player Registration" : regType === "COACH" ? "Coach Application" : "Captain Application"}
          </h1>
          <p style={{ color: "#A0A3B1" }}>
            {regType === "PLAYER" ? "Fill in your details to join NovaClub." : "Your application will be reviewed by the admin."}
          </p>
        </div>

        <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

          {/* Personal info */}
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>Personal Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={labelStyle}>First name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange}
                placeholder="John" style={inputStyle(!!fieldErrors.firstName)} />
              <FieldError name="firstName" />
            </div>
            <div>
              <label style={labelStyle}>Last name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange}
                placeholder="Smith" style={inputStyle(!!fieldErrors.lastName)} />
              <FieldError name="lastName" />
            </div>
            <div>
              <label style={labelStyle}>Email address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="john@example.com" style={inputStyle(!!fieldErrors.email)} />
              <FieldError name="email" />
            </div>
            <div>
              <label style={labelStyle}>Phone number</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+44 7700 000000" style={inputStyle(!!fieldErrors.phone)} />
              <FieldError name="phone" />
            </div>

            <div className="md:col-span-2">
              <label style={labelStyle}>Date of birth</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select value={dob.day} onChange={(e) => setDob({ ...dob, day: e.target.value })}
                  style={{ ...inputStyle(!!fieldErrors.dob), width: "30%" }}>
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={String(d)}>{d}</option>
                  ))}
                </select>
                <select value={dob.month} onChange={(e) => setDob({ ...dob, month: e.target.value })}
                  style={{ ...inputStyle(!!fieldErrors.dob), width: "40%" }}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={String(i + 1)}>{m}</option>
                  ))}
                </select>
                <select value={dob.year} onChange={(e) => setDob({ ...dob, year: e.target.value })}
                  style={{ ...inputStyle(!!fieldErrors.dob), width: "30%" }}>
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              <FieldError name="dob" />
            </div>

            <div>
              <label style={labelStyle}>Playing level</label>
              <select name="playingLevel" value={form.playingLevel} onChange={handleChange} style={inputStyle()}>
                <option value="BEGINNER">Beginner — never played before</option>
                <option value="INTERMEDIATE">Intermediate — play occasionally</option>
                <option value="ADVANCED">Advanced — play regularly</option>
                <option value="COMPETITIVE">Competitive — tournament player</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>How did you hear about us?</label>
              <select name="heardAboutUs" value={form.heardAboutUs} onChange={handleChange} style={inputStyle()}>
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
                placeholder="123 Main Street" style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input name="city" value={form.city} onChange={handleChange}
                placeholder="Motherwell" style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>Postcode</label>
              <input name="postcode" value={form.postcode} onChange={handleChange}
                placeholder="ML1 1AA" style={inputStyle(!!fieldErrors.postcode)} />
              <FieldError name="postcode" />
            </div>
          </div>

          {/* Emergency contact */}
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>Emergency Contact</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label style={labelStyle}>Contact name</label>
              <input name="emergencyName" value={form.emergencyName} onChange={handleChange}
                placeholder="Jane Smith" style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle}>Contact phone</label>
              <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange}
                placeholder="+44 7700 000001" style={inputStyle(!!fieldErrors.emergencyPhone)} />
              <FieldError name="emergencyPhone" />
            </div>
          </div>

          {/* Medical */}
          <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#3865FF" }}>Health & Medical</p>
          <div className="mb-6">
            <label style={labelStyle}>Any medical conditions we should be aware of? (optional)</label>
            <textarea name="medicalNotes" value={form.medicalNotes} onChange={handleChange}
              placeholder="e.g. asthma, allergies, injuries..." rows={3}
              style={{ ...inputStyle(), resize: "vertical" }} />
          </div>

          {/* Coach/Captain extra */}
          {(regType === "COACH" || regType === "CAPTAIN") && (
            <>
              <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#00D4AA" }}>
                {regType === "COACH" ? "Coach Details" : "Captain Details"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {regType === "COACH" && (
                  <div>
                    <label style={labelStyle}>Qualification (e.g. LTA Level 2)</label>
                    <input name="qualification" value={form.qualification} onChange={handleChange}
                      placeholder="LTA Level 2" style={inputStyle()} />
                  </div>
                )}
                <div>
                  <label style={labelStyle}>Years of experience</label>
                  <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange}
                    placeholder="3" style={inputStyle(!!fieldErrors.experience)} />
                  <FieldError name="experience" />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Bio / Why do you want this role? *</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange}
                    placeholder="Tell us about yourself..." rows={3}
                    style={{ ...inputStyle(!!fieldErrors.bio), resize: "vertical" }} />
                  <FieldError name="bio" />
                </div>
                <div className="md:col-span-2">
                  <label style={labelStyle}>Additional message to admin (optional)</label>
                  <textarea name="requestMessage" value={form.requestMessage} onChange={handleChange}
                    placeholder="Anything else you'd like us to know..." rows={2}
                    style={{ ...inputStyle(), resize: "vertical" }} />
                </div>
              </div>
            </>
          )}

          {/* Terms */}
          <div className="flex items-start gap-3 mb-6 p-4 rounded-xl"
            style={{
              background: "#13141F",
              border: `1px solid ${fieldErrors.terms ? "#FF4D6A" : "#2A2B3D"}`,
            }}>
            <input type="checkbox" name="termsAccepted" checked={form.termsAccepted} onChange={handleChange}
              style={{ marginTop: "2px", accentColor: "#3865FF", width: "16px", height: "16px" }} />
            <div>
              <p className="text-sm" style={{ color: "#A0A3B1" }}>
                I agree to the{" "}
                <Link href="/terms" className="underline" style={{ color: "#3865FF" }}>Terms & Conditions</Link>
                {" "}and{" "}
                <Link href="/privacy" className="underline" style={{ color: "#3865FF" }}>Privacy Policy</Link>.
              </p>
              <FieldError name="terms" />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)" }}>
              <p className="text-sm" style={{ color: "#FF4D6A" }}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading || !form.termsAccepted}
            className="w-full py-3.5 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {loading ? "Submitting..." : regType === "PLAYER" ? "Complete Registration" : "Submit Application"}
          </button>
        </div>
      </section>
    </main>
  );
}