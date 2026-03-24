import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const CATEGORIES = ["Laptops", "Electronics", "Headphones", "Accessories"];

export default function SellProduct() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Pehle login karo!");
      navigate("/login");
      return;
    }
    if (images.length === 0) {
      toast.error("Kam se kam ek photo add karo");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("images", img));

      await axios.post("/api/v1/sell", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSubmitted(true);
      toast.success("Request submit ho gayi!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Kuch galat hua, dobara try karo",
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            background: "white",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            maxWidth: 420,
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: 8,
            }}
          >
            Request Submit Ho Gayi!
          </h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>
            Aapki product request admin ke paas bheji ja chuki hai. Review ke
            baad 24-48 ghante mein live ho jayegi.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Home Page Par Jao
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "70vh", background: "#f8faff", padding: "40px 16px" }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: 6,
            }}
          >
            Apna Product Becho
          </h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            Form fill karo — admin review karke 24 ghante mein approve karega
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            padding: "32px 28px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Dell Inspiron 15"
                required
                style={inputStyle}
              />
            </div>

            {/* Brand + Category row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <label style={labelStyle}>Brand *</label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Dell, HP, Apple"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Select karo</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Price (₹) *</label>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                min="1"
                placeholder="e.g. 25000"
                required
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product ki condition, age, specs sab batao..."
                required
                rows={4}
                style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
              />
            </div>

            {/* Images */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Photos * (max 5)</label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #cbd5e1",
                  borderRadius: 12,
                  padding: "28px 20px",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  background: "#f8faff",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: 8 }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span
                  style={{ color: "#2563EB", fontWeight: 600, fontSize: 14 }}
                >
                  Photos choose karo
                </span>
                <span style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                  PNG, JPG • Max 5 photos
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  style={{ display: "none" }}
                />
              </label>

              {/* Previews */}
              {previews.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    marginTop: 14,
                  }}
                >
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img
                        src={src}
                        alt=""
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "2px solid #e2e8f0",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#ef4444",
                          border: "none",
                          color: "white",
                          fontSize: 12,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 10,
                background: loading ? "#93c5fd" : "#2563EB",
                color: "white",
                border: "none",
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading
                ? "⏳ Submit ho raha hai..."
                : "Product Sell Request Bhejo →"}
            </button>
          </form>
        </div>

        {/* Info box */}
        <div
          style={{
            marginTop: 20,
            padding: "16px 20px",
            background: "#eff6ff",
            borderRadius: 12,
            border: "1px solid #bfdbfe",
          }}
        >
          <p style={{ color: "#1d4ed8", fontSize: 13, margin: 0 }}>
            ℹ️ <strong>Kaise kaam karta hai:</strong> Aapki request admin ke
            paas jayegi. Approve hone ke baad product "Second Hand" section mein
            dikhega.
          </p>
        </div>
        <MyRequests />
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontSize: 13.5,
  fontWeight: 600,
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1.5px solid #e2e8f0",
  fontSize: 14,
  fontFamily: "inherit",
  color: "#1e293b",
  background: "#f8faff",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
};

// File ke andar, SellProduct component ke baad add karo:
export function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/v1/sell/my-requests", {
          withCredentials: true,
        });
        setRequests(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusConfig = {
    pending: {
      color: "#854d0e",
      bg: "#fef9c3",
      label: "⏳ Pending - Admin review kar raha hai",
    },
    approved: {
      color: "#166534",
      bg: "#dcfce7",
      label: "✅ Approved - Product live ho gaya!",
    },
    rejected: { color: "#991b1b", bg: "#fee2e2", label: "❌ Rejected" },
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
        Loading...
      </p>
    );
  if (requests.length === 0) return null;

  return (
    <div style={{ maxWidth: 640, margin: "24px auto 0", padding: "0 16px" }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: 16,
        }}
      >
        My Requests
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {requests.map((req) => (
          <div
            key={req._id}
            style={{
              background: "white",
              borderRadius: 12,
              padding: "16px",
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* Image */}
            <img
              src={
                req.images?.[0]?.url || req.images?.[0] || "/placeholder.png"
              }
              alt={req.name}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            {/* Details */}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>
                {req.name}
              </p>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
                ₹{req.price?.toLocaleString()}
              </p>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: statusConfig[req.status]?.bg,
                  color: statusConfig[req.status]?.color,
                }}
              >
                {statusConfig[req.status]?.label}
              </span>
              {req.adminNote && (
                <p style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                  📝 Admin note: {req.adminNote}
                </p>
              )}
            </div>
            {/* Date */}
            <p style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>
              {new Date(req.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
