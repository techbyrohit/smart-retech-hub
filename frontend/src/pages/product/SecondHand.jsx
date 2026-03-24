import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function SecondHand() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const CATEGORIES = [
    "All",
    "Laptops",
    "Electronics",
    "Headphones",
    "Accessories",
  ];

  useEffect(() => {
    const fetchSecondHand = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/v1/products", {
          params: {
            isSecondHand: true,
            keyword: search,
            category: category === "All" ? "" : category,
          },
        });
        // Filter second hand products
        const secondHandProducts = (data.products || []).filter(
          (p) => p.isSecondHand === true,
        );
        setProducts(secondHandProducts);
      } catch (err) {
        console.error("Error fetching second hand products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSecondHand();
  }, [search, category]);

  return (
    <div
      style={{ minHeight: "70vh", background: "#f8faff", padding: "32px 16px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 28 }}>♻️</span>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#1e293b",
                margin: 0,
              }}
            >
              Second Hand Products
            </h1>
          </div>
          <p style={{ color: "#64748b", fontSize: 15, margin: 0 }}>
            Verified used electronics — reviewed and approved by our team
          </p>
        </div>

        {/* Search + Filter */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 28,
            flexWrap: "wrap",
            background: "white",
            padding: "16px",
            borderRadius: 14,
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search second hand products..."
              style={{
                width: "100%",
                padding: "10px 14px 10px 36px",
                borderRadius: 8,
                border: "1.5px solid #e2e8f0",
                fontSize: 14,
                fontFamily: "inherit",
                color: "#1e293b",
                background: "#f8faff",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Category filters */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === "All" ? "" : cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background:
                    category === cat || (cat === "All" && !category)
                      ? "#2563EB"
                      : "#f1f5f9",
                  color:
                    category === cat || (cat === "All" && !category)
                      ? "white"
                      : "#64748b",
                  transition: "all 0.18s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <p>Loading products...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: 8,
              }}
            >
              Koi product nahi mila
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
              Abhi koi second hand product available nahi hai
            </p>
            <Link
              to="/sell"
              style={{
                background: "#2563EB",
                color: "white",
                padding: "10px 24px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Apna Product Becho →
            </Link>
          </div>
        )}

        {/* Product Count */}
        {!loading && products.length > 0 && (
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
            {products.length} product{products.length > 1 ? "s" : ""} found
          </p>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: 14,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: "relative",
                      height: 200,
                      background: "#f8faff",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* Second Hand Badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "#f59e0b",
                        color: "white",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                      }}
                    >
                      ♻️ Second Hand
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ padding: "14px 16px" }}>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      {product.brand}
                    </p>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1e293b",
                        marginBottom: 8,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Category tag */}
                    <span
                      style={{
                        fontSize: 11,
                        color: "#2563EB",
                        background: "#eff6ff",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
                    >
                      {product.category}
                    </span>

                    {/* Price */}
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#2563EB",
                          margin: 0,
                        }}
                      >
                        ₹{product.price?.toLocaleString()}
                      </p>
                      {product.ratings > 0 && (
                        <span style={{ fontSize: 12, color: "#f59e0b" }}>
                          ⭐ {product.ratings.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Sell CTA */}
        {!loading && (
          <div
            style={{
              marginTop: 40,
              padding: "24px 28px",
              background: "linear-gradient(135deg, #2563EB 0%, #1e40af 100%)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h3
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 4,
                }}
              >
                Aapke paas bhi koi purana device hai?
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 14,
                  margin: 0,
                }}
              >
                Sell karo aur paise kamao — admin review ke baad yahan list ho
                jayega!
              </p>
            </div>
            <Link
              to="/sell"
              style={{
                background: "white",
                color: "#2563EB",
                padding: "12px 24px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              Sell Your Product →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
