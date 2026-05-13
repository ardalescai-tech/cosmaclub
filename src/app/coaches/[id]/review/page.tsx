"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Coach = {
  id: string;
  qualification: string | null;
  user: { name: string | null };
};

export default function CoachReviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const coachId = params.id as string;

  const [coach, setCoach] = useState<Coach | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    fetch(`/api/coaches/${coachId}`)
      .then((r) => r.json())
      .then(setCoach)
      .catch(console.error);
  }, [coachId, status]);

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a rating."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/coaches/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachId, rating, comment }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (e) {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main style={{ background: "#0C0D14", minHeight: "100vh" }} className="flex items-center justify-center px-6">
        <div className="rounded-xl p-10 max-w-md w-full text-center"
          style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-5xl mb-4">⭐</p>
          <h2 className="text-xl font-bold text-white mb-2">Review submitted!</h2>
          <p className="text-sm mb-6" style={{ color: "#A0A3B1" }}>
            Thank you for your feedback.
          </p>
          <Link href={`/coaches/${coachId}`}
            className="block w-full py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            Back to Profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#0C0D14", minHeight: "100vh" }}>
      <section className="px-6 py-12 max-w-xl mx-auto">
        <Link href={`/coaches/${coachId}`} className="text-sm mb-6 inline-block" style={{ color: "#A0A3B1" }}>
          ← Back to profile
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Leave a Review</h1>
          {coach && (
            <p style={{ color: "#A0A3B1" }}>Share your experience with {coach.user.name}</p>
          )}
        </div>

        <div className="rounded-xl p-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>

          {/* Star rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">Rating *</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-110">
                  {star <= (hover || rating) ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm mt-2" style={{ color: "#A0A3B1" }}>
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={4}
              style={{
                background: "#13141F", border: "1px solid #2A2B3D", color: "#fff",
                width: "100%", padding: "10px 16px", borderRadius: "8px",
                fontSize: "14px", outline: "none", resize: "vertical",
              }}
            />
          </div>

          {error && <p className="text-sm mb-4" style={{ color: "#FF4D6A" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="w-full py-3 rounded-xl font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </section>
    </main>
  );
}