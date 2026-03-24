import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const statusColors = {
  pending: { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
  approved: { bg: "#dcfce7", color: "#166534", label: "Approved" },
  rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
};

export default function PendingProducts() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async (status) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/v1/sell/admin/all?status=${status}`,
        {
          withCredentials: true,
        },
      );
      setRequests(data);
    } catch {
      toast.error("Requests load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(filter);
  }, [filter]);

  const handleAction = async (id, status) => {
    setActionLoading(true);
    try {
      const { data } = await axios.put(
        `/api/v1/sell/admin/${id}/status`,
        { status, adminNote },
        { withCredentials: true },
      );
      toast.success(data.message);
      setSelected(null);
      setAdminNote("");
      fetchRequests(filter);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error aaya");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 4,
          }}
        >
          Sell Requests
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Users ke product sell requests approve ya reject karo
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: "none",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              background: filter === s ? "#2563EB" : "#f1f5f9",
              color: filter === s ? "white" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          Loading...
        </div>
      )}

      {/* Empty */}
      {!loading && requests.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#94a3b8",
            background: "white",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p>Koi {filter} request nahi hai</p>
        </div>
      )}

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {requests.map((req) => (
          <div
            key={req._id}
            style={{
              background: "white",
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
              overflow: "hidden",
              transition: "box-shadow 0.2s",
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                height: 180,
                background: "#f8faff",
                overflow: "hidden",
              }}
            >
              {req.images?.[0] ? (
                <img
                  src={req.images[0]}
                  alt={req.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#cbd5e1",
                    fontSize: 40,
                  }}
                >
                  📷
                </div>
              )}
              {/* Multiple images indicator */}
              {req.images?.length > 1 && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 12,
                  }}
                >
                  +{req.images.length - 1} more
                </span>
              )}
              {/* Status badge */}
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  background: statusColors[req.status].bg,
                  color: statusColors[req.status].color,
                }}
              >
                {statusColors[req.status].label}
              </span>
            </div>

            {/* Details */}
            <div style={{ padding: "16px" }}>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 4,
                }}
              >
                {req.name}
              </h3>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {req.brand}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    background: "#f1f5f9",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {req.category}
                </span>
              </div>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#2563EB",
                  marginBottom: 6,
                }}
              >
                ₹{req.price?.toLocaleString()}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 8,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {req.description}
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                By: {req.user?.name} ({req.user?.email}) •{" "}
                {new Date(req.createdAt).toLocaleDateString("en-IN")}
              </p>

              {/* Actions - only for pending */}
              {req.status === "pending" && (
                <div>
                  {selected?._id === req._id ? (
                    <div>
                      <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Admin note (optional)..."
                        rows={2}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid #e2e8f0",
                          fontSize: 13,
                          marginBottom: 10,
                          resize: "none",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => handleAction(req._id, "approved")}
                          disabled={actionLoading}
                          style={{
                            flex: 1,
                            padding: "9px",
                            borderRadius: 8,
                            border: "none",
                            background: "#16a34a",
                            color: "white",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "rejected")}
                          disabled={actionLoading}
                          style={{
                            flex: 1,
                            padding: "9px",
                            borderRadius: 8,
                            border: "none",
                            background: "#dc2626",
                            color: "white",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          ❌ Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelected(null);
                            setAdminNote("");
                          }}
                          style={{
                            padding: "9px 14px",
                            borderRadius: 8,
                            border: "1.5px solid #e2e8f0",
                            background: "white",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelected(req)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 8,
                        border: "none",
                        background: "#2563EB",
                        color: "white",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Review Karo →
                    </button>
                  )}
                </div>
              )}

              {/* Admin note display */}
              {req.adminNote && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 8,
                    padding: "8px",
                    background: "#f8faff",
                    borderRadius: 6,
                  }}
                >
                  📝 Note: {req.adminNote}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
