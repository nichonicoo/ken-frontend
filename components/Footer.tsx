"use client";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        <div style={styles.main}>
          <div style={styles.col}>
            <p style={styles.colTitle}>Kontak Kami</p>
            <div style={styles.contactList}>
              <div style={styles.contactRow}>
                <span style={styles.contactLabel}>Jam Operasional</span>
                <span style={styles.contactVal}>Senin – Minggu, 08.00 – 18.00 WIB</span>
              </div>
              <div style={styles.contactRow}>
                <span style={styles.contactLabel}>Email</span>
                
                <a href="mailto:email@gmail.com" style={styles.contactLink}>email@gmail.com</a>
              </div>
              <div style={styles.contactRow}>
                <span style={styles.contactLabel}>WhatsApp</span>

                <a href="https://wa.me/6208xxxxxxxxxx" style={styles.contactLink} target="_blank" rel="noopener noreferrer">
                  08xx-xxxx-xxxx
                </a>
              </div>
              <div style={styles.contactRow}>
                <span style={styles.contactLabel}>Alamat</span>
                <span style={styles.contactVal}>Jl. Nama Jalan No. 1, Kota, Indonesia</span>
              </div>
            </div>
          </div>

          <div style={styles.colCenter}>
            <div style={styles.logoBox}>
              <span style={{ ...styles.logoText, ...cormorant.style }}>Store</span>
            </div>
            <p style={styles.ptName}>PT Nama Perusahaan</p>
            <p style={styles.tagline}>Toko tanaman hias terpercaya untuk rumah dan kantor Anda.</p>
          </div>

          <div style={{ ...styles.col, alignItems: "flex-end" }}>
            <p style={styles.colTitle}>Navigasi</p>
            <nav style={styles.navList}>
              <Link href="/" style={styles.navLink}>Home</Link>
              <Link href="/products" style={styles.navLink}>All Products</Link>
              <Link href="/about" style={styles.navLink}>About Us</Link>
              <Link href="/customer-care" style={styles.navLink}>Customer Care</Link>
            </nav>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.bottom}>
          <p style={styles.copyright}>© 2025 PT Nama Perusahaan. All rights reserved.</p>
          <div style={styles.socialRow}>
            <a
              href="https://shopee.co.id/namatoko"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialBtn}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#111"; (e.currentTarget as HTMLAnchorElement).style.color = "#111"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e0e0e0"; (e.currentTarget as HTMLAnchorElement).style.color = "#888"; }}
            >
              <img src="/shopee_logo.svg" width={14} height={14} alt="" aria-hidden="true" style={{ objectFit: "contain" }} />
              Shopee
            </a>
            <a
              href="https://www.tiktok.com/@namatoko"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialBtn}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#111"; (e.currentTarget as HTMLAnchorElement).style.color = "#111"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e0e0e0"; (e.currentTarget as HTMLAnchorElement).style.color = "#888"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1.01-.04z"/>
              </svg>
              TikTok
            </a>
            <a
              href="https://www.instagram.com/namatoko"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialBtn}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#111"; (e.currentTarget as HTMLAnchorElement).style.color = "#111"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e0e0e0"; (e.currentTarget as HTMLAnchorElement).style.color = "#888"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    width: "100%",
    backgroundColor: "#fff",
    borderTop: "0.5px solid #ebebeb",
    marginTop: "auto",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "52px 32px 0",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "40px",
    paddingBottom: "48px",
    alignItems: "start",
  },

  // column
  col: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  colCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  colTitle: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "16px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  // logo
  logoBox: {
    border: "0.5px solid #e0e0e0",
    borderRadius: "8px",
    width: "140px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: 400,
    color: "#111",
    letterSpacing: "0.04em",
  },
  ptName: {
    fontSize: "11px",
    color: "#aaa",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    marginTop: "4px",
  },
  tagline: {
    fontSize: "12px",
    color: "#bbb",
    textAlign: "center" as const,
    lineHeight: 1.6,
    marginTop: "10px",
    maxWidth: "180px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  // contact
  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  contactRow: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  contactLabel: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#ccc",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  contactVal: {
    fontSize: "12px",
    color: "#555",
    lineHeight: 1.5,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  contactLink: {
    fontSize: "12px",
    color: "#555",
    textDecoration: "none",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },

  // nav
  navList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  navLink: {
    fontSize: "12px",
    color: "#888",
    textDecoration: "none",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: "0.04em",
    transition: "color 0.15s ease",
  },

  // Bottom
  divider: {
    borderTop: "0.5px solid #ebebeb",
  },
  bottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 0 24px",
  },
  copyright: {
    fontSize: "11px",
    color: "#ccc",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  socialRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  socialBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "#888",
    textDecoration: "none",
    padding: "6px 12px",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#e0e0e0",
    borderRadius: "20px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: "0.04em",
    transition: "border-color 0.15s ease, color 0.15s ease",
  },
};