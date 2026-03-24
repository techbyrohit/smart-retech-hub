import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

const tabStyle = (active) => ({
  padding: "10px 22px",
  borderRadius: 20,
  border: "none",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
  background: active ? "#2563EB" : "#f1f5f9",
  color: active ? "white" : "#64748b",
  transition: "all 0.18s",
});

export default function StaffDashboard() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);
  const [sellFilter, setSellFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [selectedSell, setSelectedSell] = useState(null);

  const fetchData = async (currentTab, sf = sellFilter) => {
    setLoading(true);
    try {
      if (currentTab === "orders") {
        const { data } = await axios.get("/api/v1/staff/orders", {
          withCredentials: true,
        });
        setOrders(data.orders || []);
      } else if (currentTab === "products") {
        const { data } = await axios.get("/api/v1/staff/products", {
          withCredentials: true,
        });
        setProducts(data.products || []);
      } else if (currentTab === "users") {
        const { data } = await axios.get("/api/v1/staff/users", {
          withCredentials: true,
        });
        setUsers(data.users || []);
      } else if (currentTab === "sell") {
        const { data } = await axios.get(
          `/api/v1/staff/sell-requests?status=${sf}`,
          { withCredentials: true },
        );
        setSellRequests(data.requests || []);
      }
    } catch {
      toast.error("Data load nahi hua");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(tab);
  }, [tab]);

  const updateOrderStatus = async (id, orderStatus) => {
    setUpdatingId(id);
    try {
      await axios.put(
        `/api/v1/staff/orders/${id}`,
        { orderStatus },
        { withCredentials: true },
      );
      toast.success("Order update ho gaya!");
      fetchData("orders");
    } catch {
      toast.error("Update nahi hua");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSellAction = async (id, status) => {
    try {
      await axios.put(
        `/api/v1/staff/sell-requests/${id}`,
        { status, adminNote },
        { withCredentials: true },
      );
      toast.success(status === "approved" ? "✅ Approved!" : "❌ Rejected");
      setSelectedSell(null);
      setAdminNote("");
      fetchData("sell", sellFilter);
    } catch {
      toast.error("Action fail hua");
    }
  };

  const statusColor = (s) =>
    ({
      Processing: { bg: "#eff6ff", color: "#1d4ed8" },
      Shipped: { bg: "#fef9c3", color: "#854d0e" },
      Delivered: { bg: "#dcfce7", color: "#166534" },
      Cancelled: { bg: "#fee2e2", color: "#991b1b" },
    })[s] || { bg: "#f1f5f9", color: "#374151" };

  return (
    <div
      style={{ minHeight: "70vh", background: "#f8faff", padding: "28px 16px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: 4,
            }}
          >
            👷 Staff Dashboard
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            Orders aur Sell Requests manage karo
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {[
            { key: "orders", label: "📦 Orders" },
            { key: "sell", label: "♻️ Sell Requests" },
            { key: "products", label: "🛍️ Products" },
            { key: "users", label: "👥 Users" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={tabStyle(tab === key)}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            Loading...
          </div>
        )}

        {/* ORDERS TAB */}
        {!loading && tab === "orders" && (
          <div
            style={{
              background: "white",
              borderRadius: 14,
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8faff" }}>
                  {["Order ID", "Customer", "Amount", "Status", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#64748b",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#94a3b8",
                      }}
                    >
                      Koi order nahi
                    </td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    style={{ borderBottom: "1px solid #f8faff" }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      #{order._id.slice(-8)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#1e293b",
                      }}
                    >
                      {order.user?.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#2563EB",
                      }}
                    >
                      ₹{order.totalPrice?.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: statusColor(order.orderStatus).bg,
                          color: statusColor(order.orderStatus).color,
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <select
                        value={order.orderStatus}
                        disabled={
                          updatingId === order._id ||
                          order.orderStatus === "Delivered" ||
                          order.orderStatus === "Cancelled"
                        }
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1.5px solid #e2e8f0",
                          fontSize: 12,
                          fontFamily: "inherit",
                          cursor: "pointer",
                          background: "#f8faff",
                          color: "#1e293b",
                        }}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SELL REQUESTS TAB */}
        {!loading && tab === "sell" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {["pending", "approved", "rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSellFilter(s);
                    fetchData("sell", s);
                  }}
                  style={tabStyle(sellFilter === s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            {sellRequests.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  background: "white",
                  borderRadius: 14,
                  color: "#94a3b8",
                }}
              >
                Koi {sellFilter} request nahi
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {sellRequests.map((req) => (
                <div
                  key={req._id}
                  style={{
                    background: "white",
                    borderRadius: 14,
                    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: 160,
                      background: "#f8faff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {req.images?.[0] ? (
                      <img
                        src={req.images[0]}
                        alt={req.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 36 }}>📷</span>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1e293b",
                        marginBottom: 4,
                      }}
                    >
                      {req.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#2563EB",
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      ₹{req.price?.toLocaleString()}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 8,
                      }}
                    >
                      {req.brand} • {req.category}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#94a3b8",
                        marginBottom: 12,
                      }}
                    >
                      By: {req.user?.name}
                    </p>

                    {req.status === "pending" &&
                      (selectedSell?._id === req._id ? (
                        <div>
                          <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            placeholder="Note (optional)..."
                            rows={2}
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: 6,
                              border: "1.5px solid #e2e8f0",
                              fontSize: 12,
                              marginBottom: 8,
                              resize: "none",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                            }}
                          />
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() =>
                                handleSellAction(req._id, "approved")
                              }
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 6,
                                border: "none",
                                background: "#16a34a",
                                color: "white",
                                fontWeight: 600,
                                fontSize: 12,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() =>
                                handleSellAction(req._id, "rejected")
                              }
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: 6,
                                border: "none",
                                background: "#dc2626",
                                color: "white",
                                fontWeight: 600,
                                fontSize: 12,
                                cursor: "pointer",
                                fontFamily: "inherit",
                              }}
                            >
                              ❌ Reject
                            </button>
                            <button
                              onClick={() => setSelectedSell(null)}
                              style={{
                                padding: "8px",
                                borderRadius: 6,
                                border: "1.5px solid #e2e8f0",
                                background: "white",
                                fontSize: 12,
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
                          onClick={() => setSelectedSell(req)}
                          style={{
                            width: "100%",
                            padding: "9px",
                            borderRadius: 8,
                            border: "none",
                            background: "#2563EB",
                            color: "white",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Review Karo →
                        </button>
                      ))}
                    {req.adminNote && (
                      <p
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          marginTop: 8,
                          padding: 8,
                          background: "#f8faff",
                          borderRadius: 6,
                        }}
                      >
                        📝 {req.adminNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB - Read Only */}
        {!loading && tab === "products" && (
          <div
            style={{
              background: "white",
              borderRadius: 14,
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: "#eff6ff",
                borderBottom: "1px solid #dbeafe",
              }}
            >
              <p style={{ fontSize: 12, color: "#1d4ed8", margin: 0 }}>
                👁️ Read Only — Products sirf dekh sakte hain
              </p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8faff" }}>
                  {["Product", "Category", "Price", "Stock", "Type"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#64748b",
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#94a3b8",
                      }}
                    >
                      Koi product nahi
                    </td>
                  </tr>
                )}
                {products.map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid #f8faff" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <img
                          src={
                            p.images?.[0]?.url ||
                            p.images?.[0] ||
                            "/placeholder.png"
                          }
                          alt={p.name}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 6,
                            objectFit: "cover",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#1e293b",
                          }}
                        >
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      {p.category}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#2563EB",
                      }}
                    >
                      ₹{p.price?.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: p.stock === 0 ? "#dc2626" : "#16a34a",
                        fontWeight: 600,
                      }}
                    >
                      {p.stock}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 10,
                          background: p.isSecondHand ? "#fef9c3" : "#eff6ff",
                          color: p.isSecondHand ? "#854d0e" : "#1d4ed8",
                          fontWeight: 600,
                        }}
                      >
                        {p.isSecondHand ? "♻️ Second Hand" : "🆕 New"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS TAB - Read Only */}
        {!loading && tab === "users" && (
          <div
            style={{
              background: "white",
              borderRadius: 14,
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: "#eff6ff",
                borderBottom: "1px solid #dbeafe",
              }}
            >
              <p style={{ fontSize: 12, color: "#1d4ed8", margin: 0 }}>
                👁️ Read Only — Users sirf dekh sakte hain
              </p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8faff" }}>
                  {["Name", "Email", "Role", "Joined"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#64748b",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#94a3b8",
                      }}
                    >
                      Koi user nahi
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #f8faff" }}>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      {u.name}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 13,
                        color: "#64748b",
                      }}
                    >
                      {u.email}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 10px",
                          borderRadius: 10,
                          fontWeight: 600,
                          background:
                            u.role === "admin"
                              ? "#fef3c7"
                              : u.role === "staff"
                                ? "#eff6ff"
                                : "#f1f5f9",
                          color:
                            u.role === "admin"
                              ? "#92400e"
                              : u.role === "staff"
                                ? "#1d4ed8"
                                : "#374151",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#94a3b8",
                      }}
                    >
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
