// "use client";

// import { useSearchParams } from "next/navigation";
// import { Cormorant_Garamond } from "next/font/google";
// import Link from "next/link";

// const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

// export default function OrderConfirmationPage() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("order");

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         {/* Icon */}
//         <div style={styles.iconWrap}>
//           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <polyline points="20 6 9 17 4 12" />
//           </svg>
//         </div>

//         <h1 className={cormorant.className} style={styles.title}>
//           Pesanan Diterima!
//         </h1>

//         {orderId && (
//           <p style={styles.orderNum}>Nomor pesanan #{orderId}</p>
//         )}

//         <p style={styles.desc}>
//           Terima kasih atas pesanan Anda. Kami akan segera memproses dan mengirimkan produk ke alamat yang telah Anda daftarkan.
//         </p>

//         <div style={styles.info}>
//           <div style={styles.infoItem}>
//             <span style={styles.infoIcon}>📧</span>
//             <span style={styles.infoText}>Konfirmasi pesanan dikirim ke email Anda</span>
//           </div>
//           <div style={styles.infoItem}>
//             <span style={styles.infoIcon}>🚚</span>
//             <span style={styles.infoText}>Estimasi pengiriman 2–5 hari kerja</span>
//           </div>
//           <div style={styles.infoItem}>
//             <span style={styles.infoIcon}>📦</span>
//             <span style={styles.infoText}>Lacak pesanan di halaman akun Anda</span>
//           </div>
//         </div>

//         <div style={styles.btnWrap}>
//           <Link href="/account" style={styles.btnPrimary}>
//             Lihat Pesanan Saya
//           </Link>
//           <Link href="/products" style={styles.btnSecondary}>
//             Lanjut Belanja
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   page: {
//     minHeight: "80vh", display: "flex", alignItems: "center",
//     justifyContent: "center", padding: "40px 20px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   card: {
//     width: "100%", maxWidth: "480px",
//     background: "#fff", borderRadius: "12px",
//     border: "0.5px solid #ebebeb",
//     padding: "48px 40px",
//     boxShadow: "0 4px 40px rgba(0,0,0,0.04)",
//     display: "flex", flexDirection: "column",
//     alignItems: "center", textAlign: "center",
//   },
//   iconWrap: {
//     width: 64, height: 64, borderRadius: "50%",
//     background: "#111", display: "flex",
//     alignItems: "center", justifyContent: "center",
//     marginBottom: 24,
//   },
//   title: { fontSize: "36px", fontWeight: 400, color: "#111", margin: "0 0 8px", lineHeight: 1.1 },
//   orderNum: { fontSize: "12px", color: "#aaa", letterSpacing: "0.08em", marginBottom: 16 },
//   desc: { fontSize: "13px", color: "#666", lineHeight: 1.75, marginBottom: 28, maxWidth: "360px" },
//   info: { display: "flex", flexDirection: "column", gap: 10, width: "100%", marginBottom: 32 },
//   infoItem: {
//     display: "flex", alignItems: "center", gap: 12,
//     padding: "12px 16px", background: "#fafafa",
//     borderRadius: "6px", textAlign: "left",
//   },
//   infoIcon: { fontSize: 18, flexShrink: 0 },
//   infoText: { fontSize: "12px", color: "#555", lineHeight: 1.4 },
//   btnWrap: { display: "flex", flexDirection: "column", gap: 10, width: "100%" },
//   btnPrimary: {
//     display: "flex", alignItems: "center", justifyContent: "center",
//     height: 48, background: "#111", color: "#fff",
//     textDecoration: "none", borderRadius: "4px",
//     fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   } as React.CSSProperties,
//   btnSecondary: {
//     display: "flex", alignItems: "center", justifyContent: "center",
//     height: 48, background: "transparent", color: "#111",
//     textDecoration: "none", borderRadius: "4px",
//     borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0",
//     fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   } as React.CSSProperties,
// };

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"] });

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Icon */}
        <div style={styles.iconWrap}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className={cormorant.className} style={styles.title}>
          Pesanan Diterima!
        </h1>

        {orderId && (
          <p style={styles.orderNum}>Nomor pesanan #{orderId}</p>
        )}

        <p style={styles.desc}>
          Terima kasih atas pesanan Anda. Kami akan segera memproses dan mengirimkan produk ke alamat yang telah Anda daftarkan.
        </p>

        <div style={styles.info}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>📧</span>
            <span style={styles.infoText}>Konfirmasi pesanan dikirim ke email Anda</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>🚚</span>
            <span style={styles.infoText}>Estimasi pengiriman 2–5 hari kerja</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>📦</span>
            <span style={styles.infoText}>Lacak pesanan di halaman akun Anda</span>
          </div>
        </div>

        <div style={styles.btnWrap}>
          <Link href="/account" style={styles.btnPrimary}>
            Lihat Pesanan Saya
          </Link>
          <Link href="/products" style={styles.btnSecondary}>
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "80vh" }} />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
const styles: { [key: string]: React.CSSProperties } = {
// : { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "80vh", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "40px 20px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%", maxWidth: "480px",
    background: "#fff", borderRadius: "12px",
    border: "0.5px solid #ebebeb",
    padding: "48px 40px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.04)",
    display: "flex", flexDirection: "column",
    alignItems: "center", textAlign: "center",
  },
  iconWrap: {
    width: 64, height: 64, borderRadius: "50%",
    background: "#111", display: "flex",
    alignItems: "center", justifyContent: "center",
    marginBottom: 24,
  },
  title: { fontSize: "36px", fontWeight: 400, color: "#111", margin: "0 0 8px", lineHeight: 1.1 },
  orderNum: { fontSize: "12px", color: "#aaa", letterSpacing: "0.08em", marginBottom: 16 },
  desc: { fontSize: "13px", color: "#666", lineHeight: 1.75, marginBottom: 28, maxWidth: "360px" },
  info: { display: "flex", flexDirection: "column", gap: 10, width: "100%", marginBottom: 32 },
  infoItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 16px", background: "#fafafa",
    borderRadius: "6px", textAlign: "left",
  },
  infoIcon: { fontSize: 18, flexShrink: 0 },
  infoText: { fontSize: "12px", color: "#555", lineHeight: 1.4 },
  btnWrap: { display: "flex", flexDirection: "column", gap: 10, width: "100%" },
  btnPrimary: {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: 48, background: "#111", color: "#fff",
    textDecoration: "none", borderRadius: "4px",
    fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  } as React.CSSProperties,
  btnSecondary: {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: 48, background: "transparent", color: "#111",
    textDecoration: "none", borderRadius: "4px",
    borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0",
    fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  } as React.CSSProperties,
};