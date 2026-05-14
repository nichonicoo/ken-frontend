"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getCart, updateCartItem, removeFromCart } from "@/app/api/graphql/Transaction";

// ── Types dari GraphQL response ───────────────────────────────────
interface CartNode {
  key: string;
  quantity: number;
  product: {
    node: {
      id: string;
      name: string;
      slug: string;
      price?: string;
      image?: { sourceUrl: string } | null;
    };
  };
}

interface CartData {
  contents: { nodes: CartNode[] };
  subtotal: string;
  total: string;
}

// Parse harga string WooCommerce → number (e.g. "320000" atau "Rp320.000")
function parsePrice(val?: string): number {
  if (!val) return 0;
  return Number(val.replace(/[^0-9]/g, ""));
}

const fmt = (val: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null); // key item yg sedang diupdate
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");

  // ── Fetch cart ────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ── Update qty ────────────────────────────────────────────────
  const handleQtyChange = async (key: string, currentQty: number, delta: number) => {
    const newQty = Math.max(1, currentQty + delta);
    if (newQty === currentQty) return;

    setUpdatingKey(key);
    try {
      await updateCartItem(key, newQty);
      await fetchCart(); // re-fetch biar total terupdate dari server
    } catch (e) {
      console.error("Failed to update qty", e);
    } finally {
      setUpdatingKey(null);
    }
  };

  // ── Remove item ───────────────────────────────────────────────
  const handleRemove = async (key: string) => {
    setUpdatingKey(key);
    try {
      await removeFromCart([key]);
      await fetchCart();
    } catch (e) {
      console.error("Failed to remove item", e);
    } finally {
      setUpdatingKey(null);
    }
  };

  // ── Discount ──────────────────────────────────────────────────
  const handleDiscount = () => {
    if (discountCode.toUpperCase() === "ECENTIO10") {
      setDiscountApplied(true);
      setDiscountError("");
    } else {
      setDiscountApplied(false);
      setDiscountError("Kode diskon tidak valid.");
    }
  };

  // ── Derived values ────────────────────────────────────────────
  const items = cart?.contents?.nodes || [];
  const subtotalRaw = parsePrice(cart?.subtotal);
  const discountAmount = discountApplied ? Math.round(subtotalRaw * 0.1) : 0;
  const totalRaw = parsePrice(cart?.total);
  const displayTotal = totalRaw - discountAmount;

  // ── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.page}>
        <h1 style={styles.pageTitle}>Keranjang Belanja</h1>
        <div style={styles.loadingWrap}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.pageTitle}>Keranjang Belanja</h1>
        <div style={styles.emptyState}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p style={styles.emptyText}>Keranjang kamu masih kosong.</p>
          <a href="/" style={styles.emptyBtn}>MULAI BELANJA</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Keranjang Belanja</h1>

      <div style={styles.layout}>
        {/* ── LEFT: CART ITEMS TABLE ── */}
        <div style={styles.tableWrap}>
          {/* Header */}
          <div style={styles.tableHead}>
            <span style={{ ...styles.headCell, flex: 3 }}>ITEM</span>
            <span style={{ ...styles.headCell, flex: 1, textAlign: "center" }}>HARGA</span>
            <span style={{ ...styles.headCell, flex: 1, textAlign: "center" }}>JUMLAH</span>
            <span style={{ ...styles.headCell, flex: 1, textAlign: "right" }}>SUBTOTAL</span>
          </div>

          {/* Rows */}
          {items.map((node) => {
            const p = node.product.node;
            const price = parsePrice(p.price);
            const isUpdating = updatingKey === node.key;

            return (
              <div
                key={node.key}
                style={{
                  ...styles.row,
                  opacity: isUpdating ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {/* Image */}
                <div style={styles.imgWrap}>
                  {p.image?.sourceUrl ? (
                    <img src={p.image.sourceUrl} alt={p.name} style={styles.img} />
                  ) : (
                    <div style={styles.imgPlaceholder}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={styles.itemInfo}>
                  <p style={styles.itemBrand}>ECENTIO</p>
                  <a href={`/product/${p.slug}`} style={styles.itemName}>{p.name}</a>
                  <button
                    onClick={() => handleRemove(node.key)}
                    style={styles.removeBtn}
                    disabled={isUpdating}
                  >
                    Hapus
                  </button>
                </div>

                {/* Price */}
                <div style={{ ...styles.cell, flex: 1, justifyContent: "center" }}>
                  <span style={styles.cellPrice}>{fmt(price)}</span>
                </div>

                {/* Qty */}
                <div style={{ ...styles.cell, flex: 1, justifyContent: "center" }}>
                  <div style={styles.qtyWrap}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => handleQtyChange(node.key, node.quantity, -1)}
                      disabled={isUpdating}
                    >−</button>
                    <span style={styles.qtyNum}>{node.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => handleQtyChange(node.key, node.quantity, 1)}
                      disabled={isUpdating}
                    >+</button>
                  </div>
                </div>

                {/* Subtotal */}
                <div style={{ ...styles.cell, flex: 1, justifyContent: "flex-end" }}>
                  <span style={styles.subtotalCell}>{fmt(price * node.quantity)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Ringkasan Belanja</h2>
          <div style={styles.summaryDivider} />

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Subtotal</span>
            <span style={styles.summaryValue}>{fmt(subtotalRaw)}</span>
          </div>

          {discountApplied && (
            <div style={styles.summaryRow}>
              <span style={{ ...styles.summaryLabel, color: "#e53e3e" }}>Diskon (10%)</span>
              <span style={{ ...styles.summaryValue, color: "#e53e3e" }}>− {fmt(discountAmount)}</span>
            </div>
          )}

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Ongkir</span>
            <span style={{ ...styles.summaryValue, color: "#6bc1c6", fontWeight: 700 }}>GRATIS</span>
          </div>

          <div style={styles.summaryDivider} />

          <div style={styles.summaryRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>{fmt(displayTotal)}</span>
          </div>

          {/* Kode diskon */}
          <div style={styles.discountSection}>
            <p style={styles.discountLabel}>Masukkan Kode Diskon</p>
            <div style={styles.discountRow}>
              <input
                type="text"
                placeholder="Kode Diskon"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                style={styles.discountInput}
                onKeyDown={(e) => e.key === "Enter" && handleDiscount()}
              />
              <button onClick={handleDiscount} style={styles.discountBtn}>Gunakan</button>
            </div>
            {discountError && <p style={styles.discountError}>{discountError}</p>}
            {discountApplied && <p style={styles.discountSuccess}>Kode berhasil diterapkan! 🎉</p>}
          </div>

          <button style={styles.checkoutBtn}>LANJUT KE CHECKOUT</button>
          <a href="/" style={styles.continueLink}>← Lanjut Belanja</a>
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "100px 24px 80px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: 900,
    color: "#111",
    textAlign: "center",
    marginBottom: "40px",
    letterSpacing: "-0.5px",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "80px 0",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #f0f0f0",
    borderTop: "3px solid #6bc1c6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { fontSize: "13px", color: "#888" },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "80px 0",
  },
  emptyText: { fontSize: "15px", color: "#888" },
  emptyBtn: {
    padding: "14px 32px",
    background: "#111",
    color: "white",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "2px",
    borderRadius: "2px",
  },
  layout: { display: "flex", gap: "32px", alignItems: "flex-start" },
  tableWrap: { flex: 1, border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden" },
  tableHead: { display: "flex", alignItems: "center", padding: "14px 20px", background: "#f6f6f6", borderBottom: "1px solid #e8e8e8", gap: "16px" },
  headCell: { fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", color: "#444", textTransform: "uppercase" },
  row: { display: "flex", alignItems: "center", padding: "20px", borderBottom: "1px solid #f0f0f0", gap: "16px" },
  imgWrap: { width: "80px", height: "80px", flexShrink: 0, background: "#f6f6f6", borderRadius: "2px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  img: { width: "100%", height: "100%", objectFit: "contain" },
  imgPlaceholder: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
  itemInfo: { flex: 3, display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "4px" },
  itemBrand: { fontSize: "11px", fontWeight: 800, letterSpacing: "1px", color: "#111", margin: 0, textTransform: "uppercase" },
  itemName: { fontSize: "13px", color: "#444", margin: 0, lineHeight: 1.4, textDecoration: "none" },
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#6bc1c6", fontSize: "12px", padding: 0, textDecoration: "underline", textAlign: "left", marginTop: "4px", width: "fit-content" },
  cell: { display: "flex", alignItems: "center" },
  cellPrice: { fontSize: "14px", fontWeight: 600, color: "#111" },
  qtyWrap: { display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "20px", overflow: "hidden", height: "36px" },
  qtyBtn: { width: "32px", height: "100%", border: "none", background: "white", fontSize: "16px", cursor: "pointer", color: "#333", display: "flex", alignItems: "center", justifyContent: "center" },
  qtyNum: { width: "28px", textAlign: "center", fontWeight: 700, fontSize: "13px", color: "#111" },
  subtotalCell: { fontSize: "14px", fontWeight: 700, color: "#111" },
  summary: { width: "320px", flexShrink: 0, background: "#f6f6f6", borderRadius: "4px", padding: "24px", display: "flex", flexDirection: "column" },
  summaryTitle: { fontSize: "16px", fontWeight: 800, color: "#111", margin: "0 0 16px", letterSpacing: "-0.2px" },
  summaryDivider: { borderTop: "1px solid #e0e0e0", margin: "12px 0" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" },
  summaryLabel: { fontSize: "13px", color: "#555" },
  summaryValue: { fontSize: "13px", fontWeight: 600, color: "#111" },
  totalLabel: { fontSize: "15px", fontWeight: 800, color: "#111" },
  totalValue: { fontSize: "16px", fontWeight: 900, color: "#111" },
  discountSection: { marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  discountLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", color: "#555", margin: 0 },
  discountRow: { display: "flex", border: "1px solid #ddd", borderRadius: "2px", overflow: "hidden" },
  discountInput: { flex: 1, padding: "10px 12px", border: "none", background: "white", fontSize: "13px", outline: "none", color: "#333" },
  discountBtn: { padding: "10px 16px", background: "#111", color: "white", border: "none", fontWeight: 700, fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" },
  discountError: { fontSize: "11px", color: "#e53e3e", margin: 0 },
  discountSuccess: { fontSize: "11px", color: "#38a169", margin: 0 },
  checkoutBtn: { width: "100%", height: "52px", background: "#111", color: "white", border: "none", fontWeight: 900, fontSize: "12px", letterSpacing: "2px", cursor: "pointer", marginTop: "20px", borderRadius: "2px" },
  continueLink: { textAlign: "center", marginTop: "12px", fontSize: "11px", color: "#6bc1c6", textDecoration: "none", letterSpacing: "0.5px" },
};