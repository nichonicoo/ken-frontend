"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import { getCustomer, updateCustomer } from "../api/graphql/Accounts";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// ─── Types ────────────────────────────────────────────────────────────────────
type Order = {
  databaseId: number;
  orderNumber: string;
  status: string;
  date: string;
  total: string;
  lineItems: {
    nodes: {
      productId: number;
      quantity: number;
      total: string;
      product: { node: { name: string; image?: { sourceUrl: string } } };
    }[];
  };
};

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  billing: {
    phone: string;
    address1: string;
    address2: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
  };
  orders: { nodes: Order[] };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:    { label: "Menunggu",    color: "#92400e", bg: "#fef3c7" },
  PROCESSING: { label: "Diproses",   color: "#1e40af", bg: "#dbeafe" },
  ON_HOLD:    { label: "Ditahan",    color: "#6b7280", bg: "#f3f4f6" },
  COMPLETED:  { label: "Selesai",    color: "#065f46", bg: "#d1fae5" },
  CANCELLED:  { label: "Dibatalkan", color: "#991b1b", bg: "#fee2e2" },
  REFUNDED:   { label: "Direfund",   color: "#6b7280", bg: "#f3f4f6" },
  FAILED:     { label: "Gagal",      color: "#991b1b", bg: "#fee2e2" },
};

type Tab = "orders" | "profile" | "address";

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_LABEL[order.status] || { label: order.status, color: "#111", bg: "#f3f4f6" };
  const date = new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={styles.orderCard}>
      <div style={styles.orderCardHeader} onClick={() => setOpen((o) => !o)}>
        <div style={styles.orderCardLeft}>
          <span style={styles.orderNum}>#{order.orderNumber}</span>
          <span style={styles.orderDate}>{date}</span>
        </div>
        <div style={styles.orderCardRight}>
          <span style={{ ...styles.statusBadge, color: status.color, background: status.bg }}>
            {status.label}
          </span>
          <span style={styles.orderTotal}>{order.total}</span>
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      {open && (
        <div style={styles.orderItems}>
          {order.lineItems.nodes.map((item, i) => (
            <div key={i} style={styles.orderItem}>
              {item.product.node.image?.sourceUrl && (
                <img
                  src={item.product.node.image.sourceUrl}
                  alt={item.product.node.name}
                  style={styles.orderItemImg}
                />
              )}
              <div style={styles.orderItemInfo}>
                <p style={styles.orderItemName}>{item.product.node.name}</p>
                <p style={styles.orderItemQty}>x{item.quantity}</p>
              </div>
              <p style={styles.orderItemTotal}>{item.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("orders");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Address form state
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/account");
  }, [status, router]);

  // Fetch customer data
  useEffect(() => {
    if (!session?.authToken) return;
    getCustomer(session.authToken)
      .then((data) => {
        setCustomer(data);
        if (data) {
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.billing?.phone || "");
          setAddress1(data.billing?.address1 || "");
          setAddress2(data.billing?.address2 || "");
          setCity(data.billing?.city || "");
          setPostcode(data.billing?.postcode || "");
          setState(data.billing?.state || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session?.authToken]);

  const handleSaveProfile = async () => {
    if (!session?.authToken) return;
    setSaving(true);
    try {
      await updateCustomer(session.authToken, {
        firstName,
        lastName,
        billing: { phone },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleSaveAddress = async () => {
    if (!session?.authToken) return;
    setSaving(true);
    try {
      await updateCustomer(session.authToken, {
        billing: { address1, address2, city, postcode, state },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (status === "loading" || loading) {
    return (
      <div style={styles.page}>
        <div style={styles.skeleton} />
      </div>
    );
  }

  if (!session) return null;

  const orders = customer?.orders?.nodes || [];

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <p style={styles.eyebrow}>Dashboard</p>
          <h1 className={cormorant.className} style={styles.pageTitle}>
            Halo, {customer?.firstName || session.user?.name?.split(" ")[0]}
          </h1>
        </div>
        <button
          style={styles.logoutBtn}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Keluar
        </button>
      </div>

      <div style={styles.divider} />

      {/* Tabs */}
      <div style={styles.tabs}>
        {([
          { key: "orders",  label: `Pesanan (${orders.length})` },
          { key: "profile", label: "Profil" },
          { key: "address", label: "Alamat" },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              ...styles.tab,
              ...(tab === key ? styles.tabActive : {}),
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Orders Tab ── */}
      {tab === "orders" && (
        <div style={styles.tabContent}>
          {orders.length === 0 ? (
            <div style={styles.empty}>
              <p className={cormorant.className} style={styles.emptyTitle}>Belum ada pesanan</p>
              <p style={styles.emptyText}>Mulai belanja dan pesanan Anda akan muncul di sini.</p>
              <a href="/products" style={styles.shopBtn}>Mulai Belanja</a>
            </div>
          ) : (
            <div style={styles.orderList}>
              {orders.map((order) => (
                <OrderCard key={order.databaseId} order={order} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Profile Tab ── */}
      {tab === "profile" && (
        <div style={styles.tabContent}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Depan</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Belakang</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={customer?.email || ""}
                disabled
                style={{ ...styles.input, background: "#fafafa", color: "#aaa" }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nomor Telepon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
          </div>
          {saveSuccess && <p style={styles.successMsg}>✓ Perubahan tersimpan</p>}
          <button
            style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      )}

      {/* ── Address Tab ── */}
      {tab === "address" && (
        <div style={styles.tabContent}>
          <div style={styles.formGrid}>
            <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Alamat</label>
              <input
                type="text"
                placeholder="Jl. Nama Jalan No. X"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
            <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Alamat 2 (opsional)</label>
              <input
                type="text"
                placeholder="Apartemen, Suite, Unit, dll"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Kota</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Kode Pos</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Provinsi</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={styles.input}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              />
            </div>
          </div>
          {saveSuccess && <p style={styles.successMsg}>✓ Alamat tersimpan</p>}
          <button
            style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}
            onClick={handleSaveAddress}
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Alamat"}
          </button>
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
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "24px",
  },
  eyebrow: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "6px",
  },
  pageTitle: {
    fontSize: "36px",
    fontWeight: 400,
    color: "#111",
    margin: 0,
    lineHeight: 1.1,
  },
  logoutBtn: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#aaa",
    background: "none",
    border: "0.5px solid #e0e0e0",
    borderRadius: "20px",
    padding: "7px 16px",
    cursor: "pointer",
    letterSpacing: "0.08em",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  divider: {
    borderTop: "0.5px solid #ebebeb",
    marginBottom: "32px",
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
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "color 0.15s, border-color 0.15s",
    marginBottom: "-1px",
  },
  tabActive: {
    color: "#111",
    borderBottomColor: "#111",
  },
  tabContent: {
    paddingTop: "8px",
  },

  // Orders
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  orderCard: {
    border: "0.5px solid #ebebeb",
    borderRadius: "8px",
    overflow: "hidden",
  },
  orderCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    cursor: "pointer",
    userSelect: "none" as const,
  },
  orderCardLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  orderNum: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111",
  },
  orderDate: {
    fontSize: "11px",
    color: "#aaa",
  },
  orderCardRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statusBadge: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    padding: "3px 8px",
    borderRadius: "20px",
  },
  orderTotal: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#111",
  },
  orderItems: {
    borderTop: "0.5px solid #f0f0f0",
    padding: "12px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  orderItemImg: {
    width: "44px",
    height: "44px",
    objectFit: "cover",
    borderRadius: "4px",
    background: "#f5f3ef",
    flexShrink: 0,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#111",
    marginBottom: "2px",
  },
  orderItemQty: {
    fontSize: "11px",
    color: "#aaa",
  },
  orderItemTotal: {
    fontSize: "12px",
    color: "#111",
    fontWeight: 500,
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

  // Form
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "#aaa",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    fontSize: "13px",
    color: "#111",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    background: "#fff",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#e0e0e0",
    borderRadius: "4px",
    outline: "none",
    transition: "border-color 0.15s ease",
    boxSizing: "border-box" as const,
  },
  successMsg: {
    fontSize: "12px",
    color: "#065f46",
    marginBottom: "12px",
  },
  saveBtn: {
    height: "48px",
    padding: "0 40px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "background 0.2s ease",
  },
};