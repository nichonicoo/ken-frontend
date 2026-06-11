"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { getCustomer } from "@/app/api/graphql/Accounts";
import { addToCart } from "@/app/api/graphql/Transaction";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderLineItem = {
  productId: number;
  quantity: number;
  total: string;
  product: { node: { name: string; image?: { sourceUrl: string } } };
};

type Order = {
  databaseId: number;
  orderNumber: string;
  status: string;
  date: string;
  total: string;
  subtotal: string;
  shippingTotal: string;
  discountTotal: string;
  paymentMethodTitle: string;
  shipping: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  } | null;
  billing: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  } | null;
  shippingLines: {
    nodes: { methodTitle: string; total: string }[];
  };
  lineItems: { nodes: OrderLineItem[] };
};

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  orders: { nodes: Order[] };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Menunggu",    color: "#92400e", bg: "#fef3c7" },
  Pending:    { label: "Menunggu",    color: "#92400e", bg: "#fef3c7" },
  processing: { label: "Diproses",   color: "#1e40af", bg: "#dbeafe" },
  Processing: { label: "Diproses",   color: "#1e40af", bg: "#dbeafe" },
  "on-hold":  { label: "Ditahan",    color: "#6b7280", bg: "#f3f4f6" },
  completed:  { label: "Selesai",    color: "#065f46", bg: "#d1fae5" },
  Completed:  { label: "Selesai",    color: "#065f46", bg: "#d1fae5" },
  cancelled:  { label: "Dibatalkan", color: "#991b1b", bg: "#fee2e2" },
  Cancelled:  { label: "Dibatalkan", color: "#991b1b", bg: "#fee2e2" },
  refunded:   { label: "Direfund",   color: "#6b7280", bg: "#f3f4f6" },
  Refunded:   { label: "Direfund",   color: "#6b7280", bg: "#f3f4f6" },
  failed:     { label: "Gagal",      color: "#991b1b", bg: "#fee2e2" },
  Failed:     { label: "Gagal",      color: "#991b1b", bg: "#fee2e2" },
};

const CURRENT_STATUSES = ["Pending", "Processing", "pending", "processing", "PENDING", "PROCESSING", "on-hold"];

const fmt = (val?: string) => {
  if (!val) return "Rp0";
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return val;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

// ─── Order Detail Card ────────────────────────────────────────────────────────
function OrderDetailCard({ order, highlighted }: { order: Order; highlighted?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reordering, setReordering] = useState(false);
  const [reorderDone, setReorderDone] = useState(false);
  const [paying, setPaying] = useState(false);

  // Auto-scroll & flash highlight effect
  useEffect(() => {
    if (highlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted]);
  const status = STATUS_LABEL[order.status] || { label: order.status, color: "#111", bg: "#f3f4f6" };
  const isActive = CURRENT_STATUSES.includes(order.status);
  const isPending = ["pending", "Pending", "PENDING"].includes(order.status);

  // Load Midtrans Snap script (kalau belum dimuat)
  useEffect(() => {
    if (typeof window === "undefined" || (window as any).snap) return;
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayNow = async () => {
    setPaying(true);
    try {
      // Ambil snap token dari order
      const res = await fetch(`/api/get-snap-token?orderId=${order.databaseId}`);
      const data = await res.json();

      if (!data.snap_token) {
        alert("Token pembayaran tidak ditemukan. Silakan hubungi customer service.");
        setPaying(false);
        return;
      }

      const snap = (window as any).snap;
      if (!snap) {
        alert("Midtrans Snap belum dimuat. Refresh halaman.");
        setPaying(false);
        return;
      }

      snap.pay(data.snap_token, {
        onSuccess: async (result: any) => {
          // Update order status
          await fetch("/api/update-order-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: order.databaseId, transactionId: result.transaction_id || "" }),
          });
          window.location.reload();
        },
        onPending: () => {
          setPaying(false);
        },
        onError: () => {
          alert("Pembayaran gagal. Silakan coba lagi.");
          setPaying(false);
        },
        onClose: () => {
          setPaying(false);
        },
      });
    } catch (e) {
      console.error("Pay now error:", e);
      alert("Gagal memuat pembayaran.");
      setPaying(false);
    }
  };

  const handleReorder = async () => {
    setReordering(true);
    try {
      for (const item of order.lineItems.nodes) {
        if (item.productId) {
          await addToCart(item.productId, item.quantity);
        }
      }
      setReorderDone(true);
      window.dispatchEvent(new Event("cartUpdated"));
      setTimeout(() => setReorderDone(false), 3000);
    } catch (e) {
      console.error("Reorder failed:", e);
    }
    setReordering(false);
  };

  const shippingAddr = order.shipping || order.billing;
  const courier = order.shippingLines?.nodes?.[0];

  return (
    <div ref={cardRef} style={{ ...styles.card, ...(highlighted ? styles.cardHighlighted : {}) }}>
      {/* Header: order number, date, status */}
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <span style={styles.orderNum}>#{order.orderNumber}</span>
          <span style={styles.orderDate}>{formatDate(order.date)}</span>
        </div>
        <span style={{ ...styles.statusBadge, color: status.color, background: status.bg }}>
          {status.label}
        </span>
      </div>

      <div style={styles.cardBody}>
        {/* Left: Items */}
        <div style={styles.cardSection}>
          <p style={styles.sectionTitle}>Barang</p>
          {order.lineItems.nodes.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              {item.product.node.image?.sourceUrl && (
                <img src={item.product.node.image.sourceUrl} alt={item.product.node.name} style={styles.itemImg} />
              )}
              <div style={styles.itemInfo}>
                <Link href={`/products/${item.product.node.name.toLowerCase().replace(/\s+/g, "-")}`} style={styles.itemName}>
                  {item.product.node.name}
                </Link>
                <span style={styles.itemQty}>x{item.quantity}</span>
              </div>
              <span style={styles.itemTotal}>{fmt(item.total)}</span>
            </div>
          ))}
        </div>

        {/* Right: Shipping & Payment info */}
        <div style={styles.cardInfoCol}>
          {/* Shipping address */}
          {shippingAddr && (
            <div style={styles.infoBlock}>
              <p style={styles.sectionTitle}>Dikirim Ke</p>
              <p style={styles.infoText}>
                {[shippingAddr.firstName, shippingAddr.lastName].filter(Boolean).join(" ")}
              </p>
              <p style={styles.infoText}>
                {[shippingAddr.address1, shippingAddr.address2].filter(Boolean).join(", ")}
              </p>
              <p style={styles.infoText}>
                {[shippingAddr.city, shippingAddr.state].filter(Boolean).join(", ")} {shippingAddr.postcode}
              </p>
            </div>
          )}

          {/* Courier */}
          {courier && (
            <div style={styles.infoBlock}>
              <p style={styles.sectionTitle}>Kurir</p>
              <p style={styles.infoText}>{courier.methodTitle}</p>
              <p style={styles.infoText}>{fmt(courier.total)}</p>
            </div>
          )}

          {/* Payment */}
          {order.paymentMethodTitle && (
            <div style={styles.infoBlock}>
              <p style={styles.sectionTitle}>Pembayaran</p>
              <p style={styles.infoText}>{order.paymentMethodTitle}</p>
            </div>
          )}
        </div>
      </div>

      {/* Price summary */}
      <div style={styles.priceSummary}>
        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Subtotal</span>
          <span style={styles.priceValue}>{fmt(order.subtotal)}</span>
        </div>
        {parseFloat(order.shippingTotal || "0") > 0 && (
          <div style={styles.priceRow}>
            <span style={styles.priceLabel}>Ongkos Kirim</span>
            <span style={styles.priceValue}>{fmt(order.shippingTotal)}</span>
          </div>
        )}
        {parseFloat(order.discountTotal || "0") > 0 && (
          <div style={styles.priceRow}>
            <span style={{ ...styles.priceLabel, color: "#065f46" }}>Diskon</span>
            <span style={{ ...styles.priceValue, color: "#065f46" }}>-{fmt(order.discountTotal)}</span>
          </div>
        )}
        <div style={styles.priceDivider} />
        <div style={styles.priceRow}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalValue}>{fmt(order.total)}</span>
        </div>
      </div>

      {/* Reorder button — only for completed orders */}
      {!isActive && (
        <div style={styles.cardFooter}>
          {reorderDone ? (
            <p style={styles.reorderDone}>✓ Ditambahkan ke keranjang</p>
          ) : (
            <button style={styles.reorderBtn} onClick={handleReorder} disabled={reordering}>
              {reordering ? "Memproses..." : "Beli Lagi"}
            </button>
          )}
        </div>
      )}

      {/* Bayar Sekarang — for pending orders */}
      {isPending && (
        <div style={styles.cardFooter}>
          <button
            style={styles.payNowBtn}
            onClick={handlePayNow}
            disabled={paying}
          >
            {paying ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const orderIdFromUrl = searchParams?.get("orderId");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"active" | "history">("active");
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [tabSet, setTabSet] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/orders");
  }, [status, router]);

  // Fetch customer data
  useEffect(() => {
    if (!session?.authToken) return;
    getCustomer(session.authToken)
      .then((data) => {
        setCustomer(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session?.authToken]);

  // Set tab & highlight based on orderId from URL
  useEffect(() => {
    if (!orderIdFromUrl || !customer?.orders?.nodes || tabSet) return;
    const orderId = parseInt(orderIdFromUrl, 10);
    if (isNaN(orderId)) return;

    const target = customer.orders.nodes.find((o) => o.databaseId === orderId);
    if (target) {
      const isActive = CURRENT_STATUSES.includes(target.status);
      setTab(isActive ? "active" : "history");
      setHighlightedId(orderId);
      setTabSet(true);
    }
  }, [orderIdFromUrl, customer, tabSet]);

  if (status === "loading" || loading) {
    return (
      <div style={styles.page}>
        <div style={styles.skeleton} />
      </div>
    );
  }

  if (!session) return null;

  const allOrders = customer?.orders?.nodes || [];
  const activeOrders = allOrders.filter((o) => CURRENT_STATUSES.includes(o.status));
  const historyOrders = allOrders.filter((o) => !CURRENT_STATUSES.includes(o.status));

  return (
    <div style={styles.page}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>

      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <Link href="/" style={styles.breadcrumbLink}>Home</Link>
        <span style={styles.breadcrumbSep}>/</span>
        <Link href="/account" style={styles.breadcrumbLink}>Akun</Link>
        <span style={styles.breadcrumbSep}>/</span>
        <span style={styles.breadcrumbCurrent}>Pesanan</span>
      </nav>

      {/* Header */}
      <div style={styles.header}>
        <h1 className={cormorant.className} style={styles.title}>
          Pesanan Saya
        </h1>
        <p style={styles.subtitle}>
          {customer?.firstName
            ? `${customer.firstName}, kamu memiliki ${activeOrders.length} pesanan aktif`
            : `${allOrders.length} pesanan`}
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: "active" as const,  label: `Pesanan Aktif (${activeOrders.length})` },
          { key: "history" as const, label: `Riwayat (${historyOrders.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{ ...styles.tab, ...(tab === key ? styles.tabActive : {}) }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Orders */}
      {tab === "active" && (
        <div>
          {activeOrders.length === 0 ? (
            <div style={styles.empty}>
              <p className={cormorant.className} style={styles.emptyTitle}>Tidak ada pesanan aktif</p>
              <p style={styles.emptyText}>Kamu belum memiliki pesanan yang sedang diproses.</p>
              <Link href="/products" style={styles.shopBtn}>Mulai Belanja</Link>
            </div>
          ) : (
            <div style={styles.list}>
              {activeOrders.map((order) => (
                <OrderDetailCard key={order.databaseId} order={order} highlighted={order.databaseId === highlightedId} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div>
          {historyOrders.length === 0 ? (
            <div style={styles.empty}>
              <p className={cormorant.className} style={styles.emptyTitle}>Belum ada riwayat pesanan</p>
              <p style={styles.emptyText}>Pesanan yang sudah selesai akan muncul di sini.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {historyOrders.map((order) => (
                <OrderDetailCard key={order.databaseId} order={order} highlighted={order.databaseId === highlightedId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "100px 32px 80px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  skeleton: {
    height: "400px",
    background: "#f5f5f5",
    borderRadius: "8px",
    animation: "pulse 1.4s ease infinite",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "24px",
    fontSize: "11px",
    letterSpacing: "0.06em",
  },
  breadcrumbLink: {
    color: "#999",
    textDecoration: "none",
  },
  breadcrumbSep: {
    color: "#ccc",
    fontSize: "10px",
  },
  breadcrumbCurrent: {
    color: "#111",
    fontWeight: 600,
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "36px",
    fontWeight: 400,
    color: "#111",
    margin: "0 0 8px",
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: "13px",
    color: "#aaa",
    margin: 0,
  },

  // Tabs
  tabs: {
    display: "flex",
    gap: "0",
    borderBottom: "0.5px solid #ebebeb",
    marginBottom: "32px",
  },
  tab: {
    padding: "10px 20px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    background: "none",
    border: "none",
    borderBottomWidth: "2px",
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "color 0.15s, border-color 0.15s",
    marginBottom: "-1px",
  },
  tabActive: {
    color: "#111",
    borderBottomColor: "#111",
  },

  // List
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  // Card
  card: {
    border: "0.5px solid #ebebeb",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
    transition: "box-shadow 0.3s ease",
  },
  cardHighlighted: {
    border: "1.5px solid #111",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 22px",
    background: "#fafafa",
    borderBottom: "0.5px solid #f0f0f0",
  },
  cardHeaderLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  orderNum: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111",
  },
  orderDate: {
    fontSize: "11px",
    color: "#aaa",
  },
  statusBadge: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    padding: "4px 10px",
    borderRadius: "20px",
  },

  // Card body
  cardBody: {
    display: "flex",
    gap: "24px",
    padding: "20px 22px",
  },
  cardSection: {
    flex: 1,
    minWidth: 0,
  },
  cardInfoCol: {
    width: "220px",
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "10px",
  },

  // Items
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  itemImg: {
    width: "48px",
    height: "48px",
    objectFit: "cover" as const,
    borderRadius: "6px",
    background: "#f5f3ef",
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#111",
    marginBottom: "2px",
    textDecoration: "none",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  itemQty: {
    fontSize: "11px",
    color: "#aaa",
  },
  itemTotal: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#111",
    flexShrink: 0,
  },

  // Info blocks (shipping, courier, payment)
  infoBlock: {
    marginBottom: "16px",
  },
  infoText: {
    fontSize: "12px",
    color: "#444",
    lineHeight: 1.6,
    margin: 0,
  },

  // Price summary
  priceSummary: {
    borderTop: "0.5px solid #f0f0f0",
    padding: "16px 22px",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  priceLabel: {
    fontSize: "12px",
    color: "#888",
  },
  priceValue: {
    fontSize: "12px",
    color: "#444",
  },
  priceDivider: {
    borderTop: "0.5px solid #ebebeb",
    margin: "8px 0",
  },
  totalLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111",
  },
  totalValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111",
  },

  // Footer
  cardFooter: {
    borderTop: "0.5px solid #f0f0f0",
    padding: "12px 22px",
    display: "flex",
    justifyContent: "flex-end",
  },
  reorderBtn: {
    height: 36,
    padding: "0 22px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  reorderDone: {
    fontSize: "12px",
    color: "#065f46",
  },
  payNowBtn: {
    height: 36,
    padding: "0 22px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    width: "100%",
  },

  // Empty
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40vh",
    gap: "12px",
    textAlign: "center" as const,
  },
  emptyTitle: {
    fontSize: "28px",
    fontWeight: 400,
    color: "#111",
  },
  emptyText: {
    fontSize: "13px",
    color: "#aaa",
    marginBottom: "4px",
  },
  shopBtn: {
    display: "inline-block",
    padding: "11px 32px",
    background: "#111",
    color: "#fff",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    borderRadius: "2px",
    marginTop: "8px",
  },
};
