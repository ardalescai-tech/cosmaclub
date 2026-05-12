"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type CoachData = {
  id: string;
  bio: string | null;
  qualification: string | null;
  specialisms: string[];
  pricePerHour: number;
  user: { name: string | null; email: string };
  availability: {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isBlocked: boolean;
  }[];
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function BookCoachPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const coachId = params.id as string;

  const [coach, setCoach] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    fetch(`/api/coaches/${coachId}`)
      .then((r) => r.json())
      .then((data) => {
        setCoach(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [coachId, status, router]);

  const getAvailableDates = () => {
    if (!coach?.availability?.length) return [];
    const today = new Date();
    const dates: { date: string; dayOfWeek: number }[] = [];
    for (let i = 1; i <= 28; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dow = d.getDay();
      if (coach.availability.some((a) => a.dayOfWeek === dow && !a.isBlocked)) {
        dates.push({ date: d.toISOString().split("T")[0], dayOfWeek: dow });
      }
    }
    return dates;
  };

  const getSlotsForDate = (date: string) => {
    if (!coach?.availability || !date) return [];
    const dow = new Date(date).getDay();
    return coach.availability.filter((a) => a.dayOfWeek === dow && !a.isBlocked);
  };

  const handleBook = async () => {
    if (!coach || !selectedDate || !selectedSlot || !session?.user?.id) return;
    setBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachId: coach.id,
          userId: session.user.id,
          date: new Date(selectedDate).toISOString(),
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          amount: coach.pricePerHour,
          notes: notes || null,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err.error || "Booking failed. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Loading...</p>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0D14" }}>
        <p style={{ color: "#A0A3B1" }}>Coach not found.</p>
      </div>
    );
  }

  if (success) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-8 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-white mb-2">Booking confirmed!</h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            Your session with {coach.user.name} on{" "}
            {new Date(selectedDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}{" "}
            at {selectedSlot?.startTime} is booked.
          </p>
          <Link href="/dashboard"
            className="block w-full py-3 rounded-xl text-sm font-medium text-white mb-2"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Go to Dashboard
          </Link>
          <Link href="/coaches"
            className="block w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#A0A3B1" }}>
            View all coaches
          </Link>
        </div>
      </main>
    );
  }

  const availableDates = getAvailableDates();
  const slots = getSlotsForDate(selectedDate);
  const initials = coach.user.name?.split(" ").map((n) => n[0]).join("") ?? "?";

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <Link href="/coaches" className="text-sm mb-6 inline-block" style={{ color: "#3865FF" }}>
          ← Back to coaches
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Book a Coach</h1>
        <p className="mb-8" style={{ color: "#A0A3B1" }}>Confirm your coaching session details below.</p>

        {/* Coach info */}
        <div className="rounded-xl p-6 mb-6 flex items-center gap-4"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-white">{coach.user.name}</h3>
            <p className="text-sm" style={{ color: "#3865FF" }}>{coach.qualification ?? "LTA Qualified"}</p>
            {coach.bio && <p className="text-xs mt-1" style={{ color: "#A0A3B1" }}>{coach.bio}</p>}
          </div>
        </div>

        {/* Date picker */}
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <label className="block text-sm font-medium text-white mb-3">Choose a date</label>
          {availableDates.length === 0 ? (
            <p className="text-sm" style={{ color: "#A0A3B1" }}>No availability set for this coach yet.</p>
          ) : (
            <select
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
              style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none" }}>
              <option value="">Select a date...</option>
              {availableDates.map(({ date }) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Time slot picker */}
        {selectedDate && slots.length > 0 && (
          <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
            <label className="block text-sm font-medium text-white mb-3">Choose a time slot</label>
            <div className="flex flex-col gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot({ startTime: slot.startTime, endTime: slot.endTime })}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: selectedSlot?.startTime === slot.startTime ? "rgba(56,101,255,0.15)" : "#13141F",
                    border: selectedSlot?.startTime === slot.startTime ? "1px solid #3865FF" : "1px solid #2A2B3D",
                    color: "#fff",
                  }}>
                  <span>{slot.startTime} – {slot.endTime}</span>
                  <span style={{ color: "#A0A3B1" }}>{DAY_NAMES[slot.dayOfWeek]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <label className="block text-sm font-medium text-white mb-3">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific areas you'd like to focus on..."
            rows={3}
            style={{ background: "#13141F", border: "1px solid #2A2B3D", color: "#fff", width: "100%", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", outline: "none", resize: "vertical" }}
          />
        </div>

        {/* Total */}
        <div className="rounded-xl p-6 flex items-center justify-between mb-6"
          style={{ background: "linear-gradient(135deg, rgba(56,101,255,0.2), rgba(123,44,255,0.2))", border: "1px solid rgba(56,101,255,0.3)" }}>
          <div>
            <p className="text-xs" style={{ color: "#A0A3B1" }}>Total</p>
            <p className="text-3xl font-bold text-white">£{coach.pricePerHour}</p>
            <p className="text-xs" style={{ color: "#A0A3B1" }}>per hour</p>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={!selectedDate || !selectedSlot || booking}
          className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
          {booking ? "Booking..." : "Confirm Booking"}
        </button>
      </section>
    </main>
  );
}