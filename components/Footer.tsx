// "use client";

// import { useState } from "react";

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [subscribed, setSubscribed] = useState(false);

//   const handleSubscribe = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email) {
//       setSubscribed(true);
//       setEmail("");
//     }
//   };

//   return (
//     <footer style={styles.footer}>
//       {/* Top wave divider */}
//       <div style={styles.waveDivider}>
//         <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
//           <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#1a2e3b" />
//         </svg>
//       </div>

//       <div style={styles.inner}>
//         {/* Brand column */}
//         <div style={styles.col}>
//           <div style={styles.brand}>ecentio</div>
//           <p style={styles.tagline}>Your Essentials</p>
//           <p style={styles.desc}>
//             Produk berkualitas untuk kehidupan sehari-hari. Dari dapur hingga meja kerja, kami hadirkan yang terbaik.
//           </p>
//           <div style={styles.socials}>
//             {/* Instagram */}
//             <a href="#" style={styles.socialLink} aria-label="Instagram">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
//                 <circle cx="12" cy="12" r="4"/>
//                 <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
//               </svg>
//             </a>
//             {/* TikTok */}
//             <a href="#" style={styles.socialLink} aria-label="TikTok">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
//               </svg>
//             </a>
//             {/* WhatsApp */}
//             <a href="#" style={styles.socialLink} aria-label="WhatsApp">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
//               </svg>
//             </a>
//           </div>
//         </div>

//         {/* Quick Links */}
//         <div style={styles.col}>
//           <h4 style={styles.colTitle}>Navigasi</h4>
//           <ul style={styles.linkList}>
//             {["Beranda", "Produk", "Tentang Kami", "Customer Care", "Blog"].map((item) => (
//               <li key={item}>
//                 <a href="#" style={styles.footerLink}>{item}</a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Categories */}
//         <div style={styles.col}>
//           <h4 style={styles.colTitle}>Kategori</h4>
//           <ul style={styles.linkList}>
//             {["Blender", "Lunch Box", "Bottle", "Kitchen Tools", "Office Essentials"].map((item) => (
//               <li key={item}>
//                 <a href="#" style={styles.footerLink}>{item}</a>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Newsletter + Contact */}
//         <div style={styles.col}>
//           <h4 style={styles.colTitle}>Newsletter</h4>
//           <p style={styles.newsletterDesc}>Dapatkan promo eksklusif & update produk terbaru.</p>
//           <form onSubmit={handleSubscribe} style={styles.form}>
//             <input
//               type="email"
//               placeholder="Email kamu..."
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={styles.input}
//               required
//             />
//             <button type="submit" style={styles.subscribeBtn}>
//               {subscribed ? "✓" : "→"}
//             </button>
//           </form>
//           {subscribed && (
//             <p style={styles.successMsg}>Terima kasih sudah subscribe! 🎉</p>
//           )}

//           <div style={{ marginTop: "24px" }}>
//             <h4 style={{ ...styles.colTitle, marginBottom: "10px" }}>Hubungi Kami</h4>
//             <p style={styles.contactItem}>📧 hello@ecentio.com</p>
//             <p style={styles.contactItem}>📱 +62 812-3456-7890</p>
//             <p style={styles.contactItem}>📍 Jakarta, Indonesia</p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div style={styles.bottomBar}>
//         <div style={styles.bottomInner}>
//           <p style={styles.copyright}>© {new Date().getFullYear()} Ecentio. All rights reserved.</p>
//           <div style={styles.bottomLinks}>
//             <a href="#" style={styles.bottomLink}>Privacy Policy</a>
//             <span style={styles.dot}>·</span>
//             <a href="#" style={styles.bottomLink}>Terms of Service</a>
//             <span style={styles.dot}>·</span>
//             <a href="#" style={styles.bottomLink}>Kebijakan Pengembalian</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   footer: {
//     background: "#1a2e3b",
//     color: "#c8d8e0",
//     fontFamily: "Georgia, 'Times New Roman', serif",
//     marginTop: "0",
//   },
//   waveDivider: {
//     lineHeight: 0,
//     background: "white",
//   },
//   inner: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "56px 40px 40px",
//     display: "grid",
//     gridTemplateColumns: "2fr 1fr 1fr 2fr",
//     gap: "48px",
//   },
//   col: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   brand: {
//     fontSize: "32px",
//     fontWeight: "bold",
//     color: "#6bc1c6",
//     letterSpacing: "2px",
//     lineHeight: 1,
//     marginBottom: "4px",
//   },
//   tagline: {
//     fontSize: "12px",
//     color: "#6bc1c6",
//     letterSpacing: "3px",
//     textTransform: "uppercase",
//     marginBottom: "16px",
//     margin: "0 0 16px 2px",
//   },
//   desc: {
//     fontSize: "14px",
//     lineHeight: "1.7",
//     color: "#8aa8b8",
//     marginBottom: "24px",
//   },
//   socials: {
//     display: "flex",
//     gap: "12px",
//   },
//   socialLink: {
//     width: "36px",
//     height: "36px",
//     borderRadius: "50%",
//     border: "1px solid #2e4a5c",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#8aa8b8",
//     textDecoration: "none",
//     transition: "border-color 0.2s, color 0.2s",
//   },
//   colTitle: {
//     fontSize: "11px",
//     fontWeight: "600",
//     letterSpacing: "3px",
//     textTransform: "uppercase",
//     color: "#6bc1c6",
//     marginBottom: "20px",
//     margin: "0 0 20px 0",
//   },
//   linkList: {
//     listStyle: "none",
//     padding: 0,
//     margin: 0,
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
//   footerLink: {
//     textDecoration: "none",
//     color: "#8aa8b8",
//     fontSize: "14px",
//     transition: "color 0.2s",
//   },
//   newsletterDesc: {
//     fontSize: "13px",
//     color: "#8aa8b8",
//     lineHeight: "1.6",
//     marginBottom: "16px",
//     margin: "0 0 16px 0",
//   },
//   form: {
//     display: "flex",
//     gap: "0",
//     borderRadius: "6px",
//     overflow: "hidden",
//     border: "1px solid #2e4a5c",
//   },
//   input: {
//     flex: 1,
//     padding: "10px 14px",
//     background: "#233d4e",
//     border: "none",
//     color: "#e0edf2",
//     fontSize: "13px",
//     outline: "none",
//   },
//   subscribeBtn: {
//     padding: "10px 16px",
//     background: "#6bc1c6",
//     border: "none",
//     color: "#1a2e3b",
//     fontWeight: "bold",
//     fontSize: "16px",
//     cursor: "pointer",
//   },
//   successMsg: {
//     fontSize: "12px",
//     color: "#6bc1c6",
//     marginTop: "8px",
//     margin: "8px 0 0 0",
//   },
//   contactItem: {
//     fontSize: "13px",
//     color: "#8aa8b8",
//     marginBottom: "8px",
//     margin: "0 0 8px 0",
//   },
//   bottomBar: {
//     borderTop: "1px solid #2e4a5c",
//   },
//   bottomInner: {
//     maxWidth: "1200px",
//     margin: "0 auto",
//     padding: "18px 40px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   copyright: {
//     fontSize: "12px",
//     color: "#4a6a7a",
//     margin: 0,
//   },
//   bottomLinks: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },
//   bottomLink: {
//     fontSize: "12px",
//     color: "#4a6a7a",
//     textDecoration: "none",
//   },
//   dot: {
//     color: "#4a6a7a",
//     fontSize: "12px",
//   },
// };

import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footerContainer}>
      {/* BAGIAN ATAS: Informasi Link */}
      <div style={styles.topSection}>
        {/* Kolom 1: Hubungi Kami */}
        <div style={styles.column}>
          <h4 style={styles.title}>Hubungi Kami</h4>
          <p style={styles.boldText}>Jam Operasional</p>
          <p style={styles.text}>Senin - Minggu : Jam 9:00 - 18:00 WIB (termasuk hari libur nasional)</p>
          
          <p style={{ ...styles.boldText, marginTop: "20px" }}>Layanan Pengaduan Konsumen</p>
          <p style={styles.text}>PT Era Gaya Aktif / www.jdsports.id</p>
          <p style={styles.text}>Call Center : 1500372</p>
          <p style={styles.text}>WhatsApp : 0812 9077 7722</p>
          <p style={styles.text}>Email : cs@jdsports.id</p>
          
          <p style={{ ...styles.text, marginTop: "15px", fontSize: "11px", lineHeight: "1.4" }}>
            Direktorat Jenderal Perlindungan Konsumen dan Tertib Niaga<br />
            Kementerian Perdagangan RI<br />
            WhatsApp : +62853 1111 1010
          </p>
        </div>

        {/* Kolom 2: Shopping With JD */}
        <div style={styles.column}>
          <h4 style={styles.title}>Shopping With JD</h4>
          <a href="#" style={styles.link}>Size Guide</a>
          <a href="#" style={styles.link}>Find a Store</a>
        </div>

        {/* Kolom 3: Customer Care */}
        <div style={styles.column}>
          <h4 style={styles.title}>Customer Care</h4>
          <a href="#" style={styles.link}>Delivery & Returns</a>
          <a href="#" style={styles.link}>Payment Information</a>
          <a href="#" style={styles.link}>Help & Contact Us</a>
          <a href="#" style={styles.link}>Track My Order</a>
          <a href="#" style={styles.link}>FAQ</a>
          <a href="#" style={styles.link}>Beware of Scams</a>
        </div>

        {/* Kolom 4: Information */}
        <div style={styles.column}>
          <h4 style={styles.title}>Information</h4>
          <a href="#" style={styles.link}>Career</a>
          <a href="#" style={styles.link}>About Us</a>
          <a href="#" style={styles.link}>JD Sports Fashion Plc</a>
        </div>

        {/* Kolom 5: Legal */}
        <div style={styles.column}>
          <h4 style={styles.title}>Legal</h4>
          <a href="#" style={styles.link}>Terms & Conditions</a>
          <a href="#" style={styles.link}>Privacy & Cookies</a>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* BAGIAN BAWAH: Copyright & Pembayaran */}
      <div style={styles.bottomSection}>
        <div style={styles.copyrightArea}>
          <p style={styles.text}>Visit our corporate website at www.jdplc.com</p>
          <p style={styles.text}>Copyright © 2022 JD Sports All rights reserved.</p>
        </div>

        <div style={styles.paymentArea}>
          <p style={{ ...styles.text, textAlign: "right", marginBottom: "10px" }}>Metode pembayaran yang tersedia</p>
          <div style={styles.paymentGrid}>
            {/* Placeholder untuk icon pembayaran, ganti dengan <img> asli nanti */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} style={styles.paymentIconPlaceholder} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footerContainer: {
    backgroundColor: "#fff",
    padding: "60px 80px 40px 80px",
    fontFamily: "Arial, sans-serif",
    borderTop: "1px solid #eee",
  },
  topSection: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
    gap: "20px",
    marginBottom: "40px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#000",
  },
  boldText: {
    fontSize: "13px",
    fontWeight: "bold",
    margin: "5px 0",
    color: "#333",
  },
  text: {
    fontSize: "13px",
    color: "#555",
    margin: "2px 0",
    lineHeight: "1.6",
  },
  link: {
    fontSize: "13px",
    color: "#555",
    textDecoration: "none",
    margin: "5px 0",
    transition: "color 0.2s",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "20px 0",
  },
  bottomSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  copyrightArea: {
    flex: 1,
  },
  paymentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "8px",
  },
  paymentIconPlaceholder: {
    width: "45px",
    height: "25px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
};