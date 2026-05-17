"use client";

import { useState, useEffect } from "react";

type Competition = {
  id: string;
  title: string;
};

type NewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  category: string;
  competitionId: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  competition: { id: string; title: string } | null;
};

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  GENERAL: { label: "General", color: "#A0A3B1", bg: "rgba(160,163,177,0.15)" },
  COMPETITION: { label: "Competition", color: "#FFB800", bg: "rgba(255,184,0,0.15)" },
  ANNOUNCEMENT: { label: "Announcement", color: "#3865FF", bg: "rgba(56,101,255,0.15)" },
  EVENT: { label: "Event", color: "#00D4AA", bg: "rgba(0,212,170,0.15)" },
};

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  imageUrl: "",
  category: "GENERAL",
  competitionId: "",
  published: false,
};

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = () => {
    fetch("/api/admin/news")
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
    fetch("/api/admin/competitions")
      .then((r) => r.json())
      .then((data) => setCompetitions(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError("Title, excerpt and content are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          competitionId: form.competitionId || null,
          imageUrl: form.imageUrl || null,
        }),
      });
      if (res.ok) {
        setForm(emptyForm);
        setShowForm(false);
        fetchPosts();
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

  const togglePublish = async (post: NewsPost) => {
    await fetch("/api/admin/news", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
    fetchPosts();
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
  const labelStyle = {
    color: "#A0A3B1",
    display: "block",
    fontSize: "14px",
    marginBottom: "4px",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Club News</h1>
          <p className="text-sm" style={{ color: "#A0A3B1" }}>
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}
        >
          {showForm ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {/* New post form */}
      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
          <p className="text-xs font-semibold mb-4 uppercase tracking-wider" style={{ color: "#3865FF" }}>
            New Post
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label style={labelStyle}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Decathlon-sponsored competition in Edinburgh" style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label style={labelStyle}>Excerpt * (short preview shown on homepage)</label>
              <input name="excerpt" value={form.excerpt} onChange={handleChange}
                placeholder="One sentence summary..." style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label style={labelStyle}>Full content *</label>
              <textarea name="content" value={form.content} onChange={handleChange}
                placeholder="Full article content..." rows={5}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                <option value="GENERAL">General</option>
                <option value="COMPETITION">Competition</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="EVENT">Event</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Link to competition (optional)</label>
              <select name="competitionId" value={form.competitionId} onChange={handleChange} style={inputStyle}>
                <option value="">None</option>
                {competitions.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label style={labelStyle}>Image URL (optional)</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange}
                placeholder="https://..." style={inputStyle} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="published" checked={form.published}
                onChange={handleChange}
                style={{ accentColor: "#3865FF", width: "16px", height: "16px" }} />
              <label style={{ ...labelStyle, marginBottom: 0 }}>Publish immediately</label>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl"
              style={{ background: "rgba(255,77,106,0.1)", border: "1px solid rgba(255,77,106,0.3)" }}>
              <p className="text-sm" style={{ color: "#FF4D6A" }}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #3865FF, #7B2CFF)" }}>
            {submitting ? "Saving..." : "Save Post"}
          </button>
        </div>
      )}

      {/* Posts list */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#1A1B2E", border: "1px solid #2A2B3D" }}>
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "#A0A3B1" }}>Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-white font-semibold mb-1">No posts yet</p>
            <p className="text-sm" style={{ color: "#A0A3B1" }}>
              Click "+ New Post" to create your first news article.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2B3D" }}>
                {["Title", "Category", "Competition", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium" style={{ color: "#A0A3B1" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => {
                const cat = categoryConfig[post.category] ?? categoryConfig["GENERAL"];
                return (
                  <tr key={post.id}
                    style={{
                      borderBottom: i < posts.length - 1 ? "1px solid #2A2B3D" : "none",
                    }}>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{post.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#6B6E80" }}>
                        {post.excerpt}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: cat.bg, color: cat.color }}>
                        {cat.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#A0A3B1" }}>
                      {post.competition?.title ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: post.published ? "rgba(0,212,170,0.15)" : "rgba(160,163,177,0.15)",
                          color: post.published ? "#00D4AA" : "#A0A3B1",
                        }}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#A0A3B1" }}>
                      {new Date(post.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePublish(post)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{
                            background: post.published ? "rgba(255,77,106,0.15)" : "rgba(0,212,170,0.15)",
                            color: post.published ? "#FF4D6A" : "#00D4AA",
                          }}>
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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
  );
}