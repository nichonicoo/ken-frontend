// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { getCart, updateCartItem, removeFromCart, applyCoupon, removeCoupon } from "@/app/api/graphql/Transaction";

// // graphql response
// interface CartNode {
//   key: string;
//   quantity: number;
//   product: {
//     node: {
//       id: string;
//       name: string;
//       slug: string;
//       price?: string;
//       image?: { sourceUrl: string } | null;
//     };
//   };
// }

// interface CartData {
//   contents: { nodes: CartNode[] };
//   subtotal: string;
//   total: string;
//   shippingTotal: string;
//   discountTotal: string;
//   appliedCoupons: {
//     code: string;
//     discountAmount: string;
//   }[];
// }

// // parse harga string wcomm → number (e.g. "320000" atau "Rp320.000")
// function parsePrice(val?: string): number {
//   if (!val) return 0;
//   return Number(val.replace(/[^0-9]/g, ""));
// }

// const fmt = (val: number) =>
//   new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(val);

// export default function CartPage() {
//   const [cart, setCart] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [updatingKey, setUpdatingKey] = useState<string | null>(null); // key item yg sedang diupdate
//   const [discountCode, setDiscountCode] = useState("");
//   const [discountApplied, setDiscountApplied] = useState(false);
//   const [discountError, setDiscountError] = useState("");

//   // fetch cart
//   const fetchCart = useCallback(async () => {
//     try {
//       const data = await getCart();
//       setCart(data);
//     } catch (e) {
//       console.error("Failed to load cart", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   // update qty
//   const handleQtyChange = async (key: string, currentQty: number, delta: number) => {
//     const newQty = Math.max(1, currentQty + delta);
//     if (newQty === currentQty) return;

//     setUpdatingKey(key);
//     try {
//       await updateCartItem(key, newQty);
//       await fetchCart(); // re-fetch biar total terupdate dari server
//     } catch (e) {
//       console.error("Failed to update qty", e);
//     } finally {
//       setUpdatingKey(null);
//     }
//   };

//   // remove item
//   const handleRemove = async (key: string) => {
//     setUpdatingKey(key);
//     try {
//       await removeFromCart([key]);
//       await fetchCart();
//     } catch (e) {
//       console.error("Failed to remove item", e);
//     } finally {
//       setUpdatingKey(null);
//     }
//   };

// const handleApplyCoupon = async () => {
//   try {
//     await applyCoupon(discountCode);
//     setDiscountCode("");
//     setDiscountError("");
//     await fetchCart();
//   } catch (e) {
//     setDiscountError("Kode tidak valid");
//   }
// };

// const handleRemoveCoupon = async (code: string) => {
//   try {
//     await removeCoupon(code);
//     await fetchCart();
//   } catch (e) {
//     console.error("Failed remove coupon", e);
//   }
// };


//   // deriv value
//   const items = cart?.contents?.nodes || [];
//   const subtotalRaw = parsePrice(cart?.subtotal);
//   const shippingRaw = parsePrice(cart?.shippingTotal);
//   const discountRaw = parsePrice(cart?.discountTotal);
//   const totalRaw = parsePrice(cart?.total);

//   // loading state
//   if (loading) {
//     return (
//       <div style={styles.page}>
//         <h1 style={styles.pageTitle}>Keranjang Belanja</h1>
//         <div style={styles.loadingWrap}>
//           <div style={styles.spinner} />
//           <p style={styles.loadingText}>Memuat keranjang...</p>
//         </div>
//       </div>
//     );
//   }

//   // empty state
//   if (items.length === 0) {
//     return (
//       <div style={styles.page}>
//         <h1 style={styles.pageTitle}>Keranjang Belanja</h1>
//         <div style={styles.emptyState}>
//           <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2">
//             <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
//             <line x1="3" y1="6" x2="21" y2="6"/>
//             <path d="M16 10a4 4 0 01-8 0"/>
//           </svg>
//           <p style={styles.emptyText}>Keranjang kamu masih kosong.</p>
//           <a href="/" style={styles.emptyBtn}>MULAI BELANJA</a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.page}>
//       <h1 style={styles.pageTitle}>Keranjang Belanja</h1>

//       <div style={styles.layout}>
//         {/* ── LEFT: CART ITEMS TABLE ── */}
//         <div style={styles.tableWrap}>
//           {/* Header */}
//           <div style={styles.tableHead}>
//             <span style={{ ...styles.headCell, flex: 3 }}>ITEM</span>
//             <span style={{ ...styles.headCell, flex: 1, textAlign: "center" }}>HARGA</span>
//             <span style={{ ...styles.headCell, flex: 1, textAlign: "center" }}>JUMLAH</span>
//             <span style={{ ...styles.headCell, flex: 1, textAlign: "right" }}>SUBTOTAL</span>
//           </div>

//           {/* Rows */}
//           {items.map((node) => {
//             const p = node.product.node;
//             const price = parsePrice(p.price);
//             const isUpdating = updatingKey === node.key;

//             return (
//               <div
//                 key={node.key}
//                 style={{
//                   ...styles.row,
//                   opacity: isUpdating ? 0.5 : 1,
//                   transition: "opacity 0.2s",
//                 }}
//               >
//                 {/* Image */}
//                 <div style={styles.imgWrap}>
//                   {p.image?.sourceUrl ? (
//                     <img src={p.image.sourceUrl} alt={p.name} style={styles.img} />
//                   ) : (
//                     <div style={styles.imgPlaceholder}>
//                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
//                         <rect x="3" y="3" width="18" height="18" rx="2"/>
//                         <circle cx="8.5" cy="8.5" r="1.5"/>
//                         <polyline points="21 15 16 10 5 21"/>
//                       </svg>
//                     </div>
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div style={styles.itemInfo}>
//                   <p style={styles.itemBrand}>ECENTIO</p>
//                   <a href={`/product/${p.slug}`} style={styles.itemName}>{p.name}</a>
//                   <button
//                     onClick={() => handleRemove(node.key)}
//                     style={styles.removeBtn}
//                     disabled={isUpdating}
//                   >
//                     Hapus
//                   </button>
//                 </div>

//                 {/* Price */}
//                 <div style={{ ...styles.cell, flex: 1, justifyContent: "center" }}>
//                   <span style={styles.cellPrice}>{fmt(price)}</span>
//                 </div>

//                 {/* Qty */}
//                 <div style={{ ...styles.cell, flex: 1, justifyContent: "center" }}>
//                   <div style={styles.qtyWrap}>
//                     <button
//                       style={styles.qtyBtn}
//                       onClick={() => handleQtyChange(node.key, node.quantity, -1)}
//                       disabled={isUpdating}
//                     >−</button>
//                     <span style={styles.qtyNum}>{node.quantity}</span>
//                     <button
//                       style={styles.qtyBtn}
//                       onClick={() => handleQtyChange(node.key, node.quantity, 1)}
//                       disabled={isUpdating}
//                     >+</button>
//                   </div>
//                 </div>

//                 {/* Subtotal */}
//                 <div style={{ ...styles.cell, flex: 1, justifyContent: "flex-end" }}>
//                   <span style={styles.subtotalCell}>{fmt(price * node.quantity)}</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ── RIGHT: ORDER SUMMARY ── */}
//         <div style={styles.summary}>
//           <h2 style={styles.summaryTitle}>Ringkasan Belanja</h2>
//           <div style={styles.summaryDivider} />

//           <div style={styles.summaryRow}>
//             <span style={styles.summaryLabel}>Subtotal</span>
//             <span style={styles.summaryValue}>{fmt(subtotalRaw)}</span>
//           </div>

//             {cart?.appliedCoupons?.map((c) => (
//                 <div key={c.code} style={styles.summaryRow}>
//                     <span style={{ ...styles.summaryLabel, color: "#e53e3e" }}>
//                     {c.code}
//                     </span>
//                     <span style={{ ...styles.summaryValue, color: "#e53e3e" }}>
//                     − {fmt(parsePrice(c.discountAmount))}
//                     <button
//                         onClick={() => handleRemoveCoupon(c.code)}
//                         style={{ marginLeft: 8, cursor: "pointer" }}
//                     >
//                         ✕
//                     </button>
//                     </span>
//                 </div>
//             ))}
//           <div style={styles.summaryRow}>
//             <span style={styles.summaryLabel}>Ongkir</span>
//             <span style={{ ...styles.summaryValue, color: "#6bc1c6", fontWeight: 700 }}>
//                 {shippingRaw === 0 ? "GRATIS": fmt(shippingRaw)} 
//             </span>
//           </div>

//           <div style={styles.summaryDivider} />

//           <div style={styles.summaryRow}>
//             <span style={styles.totalLabel}>Total</span>
//             <span style={styles.totalValue}>{fmt(totalRaw)}</span>
//           </div>

//           {/* Kode diskon */}
//           <div style={styles.discountSection}>
//             <p style={styles.discountLabel}>Masukkan Kode Diskon</p>
//             <div style={styles.discountRow}>
//               <input
//                 type="text"
//                 placeholder="Kode Diskon"
//                 value={discountCode}
//                 onChange={(e) => setDiscountCode(e.target.value)}
//                 style={styles.discountInput}
//                 onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
//               />
//               <button onClick={handleApplyCoupon} style={styles.discountBtn}>Gunakan</button>
//             </div>
//             {discountError && <p style={styles.discountError}>{discountError}</p>}
//             {discountApplied && <p style={styles.discountSuccess}>Kode berhasil diterapkan! 🎉</p>}
//           </div>

//           <button style={styles.checkoutBtn}>LANJUT KE CHECKOUT</button>
//           <a href="/checkout" style={styles.continueLink}>← Lanjut Belanja</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   page: {
//     maxWidth: "1300px",
//     margin: "0 auto",
//     padding: "100px 24px 80px",
//     fontFamily: "'Helvetica Neue', Arial, sans-serif",
//     backgroundColor: "#fff",
//     minHeight: "100vh",
//   },
//   pageTitle: {
//     fontSize: "28px",
//     fontWeight: 900,
//     color: "#111",
//     textAlign: "center",
//     marginBottom: "40px",
//     letterSpacing: "-0.5px",
//   },
//   loadingWrap: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "16px",
//     padding: "80px 0",
//   },
//   spinner: {
//     width: "32px",
//     height: "32px",
//     border: "3px solid #f0f0f0",
//     borderTop: "3px solid #6bc1c6",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
//   loadingText: { fontSize: "13px", color: "#888" },
//   emptyState: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "16px",
//     padding: "80px 0",
//   },
//   emptyText: { fontSize: "15px", color: "#888" },
//   emptyBtn: {
//     padding: "14px 32px",
//     background: "#111",
//     color: "white",
//     textDecoration: "none",
//     fontWeight: 700,
//     fontSize: "11px",
//     letterSpacing: "2px",
//     borderRadius: "2px",
//   },
//   layout: { display: "flex", gap: "32px", alignItems: "flex-start" },
//   tableWrap: { flex: 1, border: "1px solid #e8e8e8", borderRadius: "4px", overflow: "hidden" },
//   tableHead: { display: "flex", alignItems: "center", padding: "14px 20px", background: "#f6f6f6", borderBottom: "1px solid #e8e8e8", gap: "16px" },
//   headCell: { fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", color: "#444", textTransform: "uppercase" },
//   row: { display: "flex", alignItems: "center", padding: "20px", borderBottom: "1px solid #f0f0f0", gap: "16px" },
//   imgWrap: { width: "80px", height: "80px", flexShrink: 0, background: "#f6f6f6", borderRadius: "2px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
//   img: { width: "100%", height: "100%", objectFit: "contain" },
//   imgPlaceholder: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
//   itemInfo: { flex: 3, display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "4px" },
//   itemBrand: { fontSize: "11px", fontWeight: 800, letterSpacing: "1px", color: "#111", margin: 0, textTransform: "uppercase" },
//   itemName: { fontSize: "13px", color: "#444", margin: 0, lineHeight: 1.4, textDecoration: "none" },
//   removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#6bc1c6", fontSize: "12px", padding: 0, textDecoration: "underline", textAlign: "left", marginTop: "4px", width: "fit-content" },
//   cell: { display: "flex", alignItems: "center" },
//   cellPrice: { fontSize: "14px", fontWeight: 600, color: "#111" },
//   qtyWrap: { display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "20px", overflow: "hidden", height: "36px" },
//   qtyBtn: { width: "32px", height: "100%", border: "none", background: "white", fontSize: "16px", cursor: "pointer", color: "#333", display: "flex", alignItems: "center", justifyContent: "center" },
//   qtyNum: { width: "28px", textAlign: "center", fontWeight: 700, fontSize: "13px", color: "#111" },
//   subtotalCell: { fontSize: "14px", fontWeight: 700, color: "#111" },
//   summary: { width: "320px", flexShrink: 0, background: "#f6f6f6", borderRadius: "4px", padding: "24px", display: "flex", flexDirection: "column" },
//   summaryTitle: { fontSize: "16px", fontWeight: 800, color: "#111", margin: "0 0 16px", letterSpacing: "-0.2px" },
//   summaryDivider: { borderTop: "1px solid #e0e0e0", margin: "12px 0" },
//   summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" },
//   summaryLabel: { fontSize: "13px", color: "#555" },
//   summaryValue: { fontSize: "13px", fontWeight: 600, color: "#111" },
//   totalLabel: { fontSize: "15px", fontWeight: 800, color: "#111" },
//   totalValue: { fontSize: "16px", fontWeight: 900, color: "#111" },
//   discountSection: { marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" },
//   discountLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", color: "#555", margin: 0 },
//   discountRow: { display: "flex", border: "1px solid #ddd", borderRadius: "2px", overflow: "hidden" },
//   discountInput: { flex: 1, padding: "10px 12px", border: "none", background: "white", fontSize: "13px", outline: "none", color: "#333" },
//   discountBtn: { padding: "10px 16px", background: "#111", color: "white", border: "none", fontWeight: 700, fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" },
//   discountError: { fontSize: "11px", color: "#e53e3e", margin: 0 },
//   discountSuccess: { fontSize: "11px", color: "#38a169", margin: 0 },
//   checkoutBtn: { width: "100%", height: "52px", background: "#111", color: "white", border: "none", fontWeight: 900, fontSize: "12px", letterSpacing: "2px", cursor: "pointer", marginTop: "20px", borderRadius: "2px" },
//   continueLink: { textAlign: "center", marginTop: "12px", fontSize: "11px", color: "#6bc1c6", textDecoration: "none", letterSpacing: "0.5px" },
// };

"use client";

import { useState, useEffect, useCallback } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { getCart, updateCartItem, removeFromCart, applyCoupon, removeCoupon } from "@/app/api/graphql/Transaction";
import Link from "next/link";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// ─── Types ────────────────────────────────────────────────────────────────────
type CartItem = {
  key: string;
  quantity: number;
  product: {
    node: {
      id: string;
      name: string;
      slug: string;
      price?: string;
      image?: { sourceUrl: string };
    };
  };
};

type Cart = {
  contents: { nodes: CartItem[] };
  subtotal: string;
  total: string;
  appliedCoupons: { code: string; discountAmount: string }[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val?: string) => {
  if (!val) return "Rp 0";
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return val;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

// ─── Cart Item Row ────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  onUpdateQty,
  onRemove,
  loading,
}: {
  item: CartItem;
  onUpdateQty: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
  loading: boolean;
}) {
  const product = item.product.node;

  return (
    <div style={styles.itemRow}>
      {/* Image */}
      <Link href={`/products/${product.slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
        <div style={styles.itemImgWrap}>
          {product.image?.sourceUrl ? (
            <img src={product.image.sourceUrl} alt={product.name} style={styles.itemImg} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#f5f3ef" }} />
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={styles.itemInfo}>
        <Link href={`/products/${product.slug}`} style={styles.itemName}>
          {product.name}
        </Link>
        <p style={styles.itemPrice}>{fmt(product.price)}</p>
      </div>

      {/* Qty */}
      <div style={styles.qtyWrap}>
        <button
          style={styles.qtyBtn}
          onClick={() => onUpdateQty(item.key, item.quantity - 1)}
          disabled={loading || item.quantity <= 1}
        >
          −
        </button>
        <span style={styles.qtyNum}>{item.quantity}</span>
        <button
          style={styles.qtyBtn}
          onClick={() => onUpdateQty(item.key, item.quantity + 1)}
          disabled={loading}
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div style={styles.itemSubtotal}>
        {product.price && fmt(String(parseFloat(product.price.replace(/[^0-9.]/g, "")) * item.quantity))}
      </div>

      {/* Remove */}
      <button
        style={styles.removeBtn}
        onClick={() => onRemove(item.key)}
        disabled={loading}
        aria-label="Hapus item"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleUpdateQty = async (key: string, qty: number) => {
    if (qty < 1) return;
    setMutating(true);
    try {
      await updateCartItem(key, qty);
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
    setMutating(false);
  };

  const handleRemove = async (key: string) => {
    setMutating(true);
    try {
      await removeFromCart([key]);
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
    setMutating(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      await applyCoupon(couponCode.trim());
      await fetchCart();
      setCouponCode("");
    } catch (e: any) {
      setCouponError("Kupon tidak valid atau sudah digunakan.");
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = async (code: string) => {
    setCouponLoading(true);
    try {
      await removeCoupon(code);
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
    setCouponLoading(false);
  };

  const items = cart?.contents?.nodes || [];

  // ── Loading ──
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeletonRow} />
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <p className={cormorant.className} style={styles.emptyTitle}>
            Keranjang Anda kosong
          </p>
          <p style={styles.emptyText}>Temukan produk yang Anda suka dan tambahkan ke keranjang.</p>
          <Link href="/products" style={styles.shopBtn}>Mulai Belanja</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <h1 className={cormorant.className} style={styles.pageTitle}>
          Keranjang
        </h1>
        <p style={styles.itemCount}>{items.length} item</p>
      </div>

      <div style={styles.layout}>
        {/* ── Items ── */}
        <div style={styles.itemsCol}>
          {/* Column headers */}
          <div style={styles.tableHeader}>
            <span style={{ flex: 1 }}>Produk</span>
            <span style={{ width: 110, textAlign: "center" as const }}>Jumlah</span>
            <span style={{ width: 100, textAlign: "right" as const }}>Subtotal</span>
            <span style={{ width: 32 }} />
          </div>

          <div style={styles.itemList}>
            {items.map((item) => (
              <CartItemRow
                key={item.key}
                item={item}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
                loading={mutating}
              />
            ))}
          </div>

          {/* Continue shopping */}
          <Link href="/products" style={styles.continueLink}>
            ← Lanjutkan Belanja
          </Link>
        </div>

        {/* ── Summary ── */}
        <div style={styles.summaryCol}>
          <p style={styles.summaryTitle}>Ringkasan Pesanan</p>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Subtotal</span>
            <span style={styles.summaryValue}>{cart?.subtotal}</span>
          </div>

          {/* Applied coupons */}
          {cart?.appliedCoupons?.map((coupon) => (
            <div key={coupon.code} style={styles.summaryRow}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={styles.couponTag}>{coupon.code}</span>
                <button
                  style={styles.removeCouponBtn}
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  disabled={couponLoading}
                >
                  ✕
                </button>
              </div>
              <span style={{ ...styles.summaryValue, color: "#065f46" }}>
                −{coupon.discountAmount}
              </span>
            </div>
          ))}

          <div style={styles.divider} />

          <div style={{ ...styles.summaryRow, marginBottom: 20 }}>
            <span style={{ ...styles.summaryLabel, fontWeight: 600, color: "#111" }}>Total</span>
            <span style={{ ...styles.summaryValue, fontSize: 18, fontWeight: 600, color: "#111" }}>
              {cart?.total}
            </span>
          </div>

          {/* Coupon input */}
          <div style={styles.couponWrap}>
            <input
              type="text"
              placeholder="Kode kupon"
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              style={styles.couponInput}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
            />
            <button
              style={styles.couponBtn}
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
            >
              {couponLoading ? "..." : "Pakai"}
            </button>
          </div>
          {couponError && <p style={styles.couponError}>{couponError}</p>}

          {/* Checkout button */}
          <Link href="/checkout" style={styles.checkoutBtn}>
            Lanjut ke Checkout
          </Link>

          {/* Trust note */}
          <p style={styles.trustNote}>
            🚚 Gratis ongkir ke seluruh Indonesia
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "100px 32px 80px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  skeletonRow: {
    height: "80px",
    background: "#f5f5f5",
    borderRadius: "8px",
    animation: "pulse 1.4s ease infinite",
  },
  pageHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 16,
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: "40px",
    fontWeight: 400,
    color: "#111",
    margin: 0,
    lineHeight: 1,
  },
  itemCount: {
    fontSize: "12px",
    color: "#aaa",
    letterSpacing: "0.08em",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "48px",
    alignItems: "flex-start",
  },
  itemsCol: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 0 12px",
    borderBottom: "0.5px solid #ebebeb",
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: 0,
  },
  itemList: {
    display: "flex",
    flexDirection: "column",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "20px 0",
    borderBottom: "0.5px solid #f0f0f0",
  },
  itemImgWrap: {
    width: "80px",
    height: "80px",
    borderRadius: "6px",
    overflow: "hidden",
    background: "#f5f3ef",
    flexShrink: 0,
  },
  itemImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  itemInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  },
  itemName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#111",
    textDecoration: "none",
    letterSpacing: "0.02em",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  itemPrice: {
    fontSize: "12px",
    color: "#aaa",
  },
  qtyWrap: {
    display: "flex",
    alignItems: "center",
    border: "0.5px solid #e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
    width: 110,
    flexShrink: 0,
  },
  qtyBtn: {
    width: "32px",
    height: "36px",
    border: "none",
    background: "transparent",
    fontSize: "16px",
    cursor: "pointer",
    color: "#555",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyNum: {
    flex: 1,
    textAlign: "center" as const,
    fontSize: "13px",
    fontWeight: 500,
    color: "#111",
  },
  itemSubtotal: {
    width: 100,
    textAlign: "right" as const,
    fontSize: "13px",
    fontWeight: 500,
    color: "#111",
    flexShrink: 0,
  },
  removeBtn: {
    width: 32,
    height: 32,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#bbb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    flexShrink: 0,
    transition: "color 0.15s ease",
  },
  continueLink: {
    display: "inline-block",
    marginTop: "24px",
    fontSize: "12px",
    color: "#888",
    textDecoration: "none",
    letterSpacing: "0.04em",
  },

  // Summary
  summaryCol: {
    background: "#fafafa",
    border: "0.5px solid #ebebeb",
    borderRadius: "8px",
    padding: "24px",
    position: "sticky",
    top: "120px",
  },
  summaryTitle: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "20px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  summaryLabel: {
    fontSize: "12px",
    color: "#888",
  },
  summaryValue: {
    fontSize: "13px",
    color: "#555",
    fontWeight: 400,
  },
  divider: {
    borderTop: "0.5px solid #ebebeb",
    margin: "16px 0",
  },

  // Coupon
  couponWrap: {
    display: "flex",
    gap: "8px",
    marginBottom: "6px",
  },
  couponInput: {
    flex: 1,
    padding: "9px 12px",
    fontSize: "12px",
    color: "#111",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    background: "#fff",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#e0e0e0",
    borderRadius: "4px",
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  couponBtn: {
    padding: "0 14px",
    background: "#fff",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#e0e0e0",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#111",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: "0.06em",
  },
  couponTag: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#065f46",
    background: "#d1fae5",
    padding: "2px 8px",
    borderRadius: "20px",
    letterSpacing: "0.08em",
  },
  removeCouponBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "11px",
    color: "#aaa",
    padding: "0 2px",
  },
  couponError: {
    fontSize: "11px",
    color: "#dc2626",
    marginBottom: "12px",
  },
  checkoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "48px",
    background: "#111",
    color: "#fff",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    borderRadius: "4px",
    marginTop: "20px",
    marginBottom: "12px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "background 0.2s ease",
    boxSizing: "border-box" as const,
  },
  trustNote: {
    fontSize: "11px",
    color: "#aaa",
    textAlign: "center" as const,
    lineHeight: 1.5,
  },

  // Empty
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    gap: "12px",
    textAlign: "center" as const,
  },
  emptyTitle: {
    fontSize: "32px",
    fontWeight: 400,
    color: "#111",
    marginTop: "8px",
  },
  emptyText: {
    fontSize: "13px",
    color: "#aaa",
    maxWidth: "320px",
    lineHeight: 1.6,
  },
  shopBtn: {
    display: "inline-block",
    marginTop: "8px",
    padding: "12px 32px",
    background: "#111",
    color: "#fff",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    borderRadius: "2px",
  },
};