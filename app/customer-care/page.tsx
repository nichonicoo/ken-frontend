"use client";

import { useState, useEffect, useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import Breadcrumb from "@/components/Breadcrumbs";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// ─── Fade-in on scroll ────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "0.5px solid #ebebeb" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "20px 0",
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left" as const,
        }}
      >
        <span style={{
          fontSize: 14, fontWeight: 500, color: "#111",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          lineHeight: 1.4, paddingRight: 24,
        }}>
          {question}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.22s ease" }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {open && (
        <p style={{
          fontSize: 13, color: "#666", lineHeight: 1.8,
          paddingBottom: 20,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}>
          {answer}
        </p>
      )}
    </div>
  );
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({
  icon, title, value, href, desc,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  desc?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const content = (
    <div
      style={{
        ...styles.contactCard,
        borderColor: hovered ? "#111" : "#ebebeb",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.contactCardIcon}>{icon}</div>
      <p style={styles.contactCardTitle}>{title}</p>
      <p style={styles.contactCardValue}>{value}</p>
      {desc && <p style={styles.contactCardDesc}>{desc}</p>}
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{content}</a>;
  }
  return content;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CustomerCarePage() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = () => {
    if (!formName || !formEmail || !formMsg) return;
    // TODO: integrasikan dengan email service / WhatsApp API
    setFormSent(true);
  };

  const faqItems = [
    {
      question: "Berapa lama estimasi pengiriman?",
      // TODO: sesuaikan dengan kebijakan pengiriman toko
      answer: "Estimasi pengiriman 2–5 hari kerja untuk seluruh wilayah Indonesia setelah pesanan dikonfirmasi. Untuk Jabodetabek, tersedia opsi same-day delivery.",
    },
    {
      question: "Apakah ada garansi untuk produk yang diterima dalam kondisi rusak?",
      answer: "Ya, kami menjamin semua produk sampai dalam kondisi baik. Jika ada kerusakan saat pengiriman, hubungi kami dalam 24 jam setelah barang diterima disertai foto, dan kami akan segera memprosesnya.",
    },
    {
      question: "Bagaimana cara melakukan pengembalian barang?",
      answer: "Pengembalian dapat dilakukan dalam 7 hari setelah produk diterima, dengan syarat produk masih dalam kondisi semula dan belum digunakan. Hubungi tim kami melalui WhatsApp untuk memulai proses retur.",
    },
    {
      question: "Apakah tersedia layanan konsultasi pemilihan tanaman?",
      answer: "Tentu! Tim kami siap membantu Anda memilih tanaman yang sesuai dengan kondisi ruangan, pencahayaan, dan kebutuhan Anda. Hubungi kami via WhatsApp atau email.",
    },
    {
      question: "Bagaimana cara merawat tanaman setelah diterima?",
      answer: "Setiap pengiriman disertai panduan perawatan dasar. Untuk pertanyaan lebih lanjut, Anda dapat menghubungi kami kapan saja melalui WhatsApp.",
    },
    {
      question: "Apakah bisa pesan dalam jumlah besar (wholesale)?",
      // TODO: sesuaikan kebijakan wholesale
      answer: "Ya, kami melayani pemesanan wholesale untuk acara, kantor, dan bisnis. Hubungi kami melalui email untuk mendapatkan penawaran khusus.",
    },
  ];

  return (
    <div style={styles.page}>

      {/* Breadcrumb */}
      <div style={{ marginBottom: "48px" }}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Customer Care" },
          ]}
        />
      </div>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <FadeIn>
          <p style={{ ...styles.eyebrow, ...cormorant.style }}>Customer Care</p>
        </FadeIn>
        <FadeIn delay={80}>
          <h1 className={cormorant.className} style={styles.heroTitle}>
            Kami di sini untuk membantu.
          </h1>
        </FadeIn>
        <FadeIn delay={160}>
          <p style={styles.heroSub}>
            {/* TODO: ganti dengan keterangan jam operasional aktual */}
            Tim kami siap melayani Anda setiap hari Senin – Minggu, pukul 08.00 – 18.00 WIB.
          </p>
        </FadeIn>
      </section>

      <div style={styles.divider} />

      {/* ── Contact Cards ── */}
      <FadeIn>
        <section style={styles.contactSection}>
          <div style={styles.sectionHead}>
            <p style={styles.sectionEyebrow}>Hubungi Kami</p>
            <h2 className={cormorant.className} style={styles.sectionTitle}>
              Pilih cara yang paling mudah
            </h2>
          </div>
          <div style={styles.contactGrid}>
            {/* TODO: ganti semua href dan value dengan kontak asli */}
            <FadeIn delay={0}>
              <ContactCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" />
                    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" />
                  </svg>
                }
                title="WhatsApp"
                value="08xx-xxxx-xxxx"
                href="https://wa.me/6208xxxxxxxxxx"
                desc="Respons tercepat, biasanya < 1 jam"
              />
            </FadeIn>
            <FadeIn delay={80}>
              <ContactCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                }
                title="Email"
                value="email@gmail.com"
                href="mailto:email@gmail.com"
                desc="Untuk pertanyaan detail & dokumen"
              />
            </FadeIn>
            <FadeIn delay={160}>
              <ContactCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
                title="Kunjungi Toko"
                value="Jl. Nama Jalan No. 1"
                desc="Senin – Minggu, 08.00 – 18.00 WIB"
              />
            </FadeIn>
            <FadeIn delay={240}>
              <ContactCard
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                }
                title="Instagram"
                value="@namatoko"
                href="https://instagram.com/namatoko"
                desc="Follow untuk info terbaru"
              />
            </FadeIn>
          </div>
        </section>
      </FadeIn>

      <div style={styles.divider} />

      {/* ── FAQ + Form ── */}
      <section style={styles.faqFormSection}>

        {/* FAQ */}
        <FadeIn>
          <div style={styles.faqCol}>
            <p style={styles.sectionEyebrow}>FAQ</p>
            <h2 className={cormorant.className} style={styles.sectionTitle}>
              Pertanyaan yang sering ditanyakan
            </h2>
            <div style={{ marginTop: "8px" }}>
              {faqItems.map((item, i) => (
                <FaqItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={120}>
          <div style={styles.formCol}>
            <p style={styles.sectionEyebrow}>Kirim Pesan</p>
            <h2 className={cormorant.className} style={styles.sectionTitle}>
              Tidak menemukan jawaban?
            </h2>

            {formSent ? (
              <div style={styles.formSuccess}>
                <p className={cormorant.className} style={{ fontSize: 28, fontWeight: 400, color: "#111", marginBottom: 8 }}>
                  Pesan terkirim ✓
                </p>
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  Terima kasih! Tim kami akan menghubungi Anda secepatnya.
                </p>
                <button
                  style={{ ...styles.btnPrimary, marginTop: 20 }}
                  onClick={() => { setFormSent(false); setFormName(""); setFormEmail(""); setFormMsg(""); }}
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <div style={styles.formBody}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Nama</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={styles.formInput}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email</label>
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    style={styles.formInput}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Pesan</label>
                  <textarea
                    placeholder="Tuliskan pertanyaan atau keluhan Anda..."
                    value={formMsg}
                    onChange={(e) => setFormMsg(e.target.value)}
                    rows={5}
                    style={{ ...styles.formInput, resize: "vertical" as const, minHeight: "120px" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    ...styles.btnPrimary,
                    opacity: (!formName || !formEmail || !formMsg) ? 0.4 : 1,
                    cursor: (!formName || !formEmail || !formMsg) ? "not-allowed" : "pointer",
                  }}
                >
                  Kirim Pesan
                </button>
              </div>
            )}
          </div>
        </FadeIn>
      </section>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "100px 32px 80px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    backgroundColor: "#fff",
  },

  // Hero
  hero: {
    maxWidth: "680px",
    marginBottom: "64px",
  },
  eyebrow: {
    fontSize: "13px",
    fontWeight: 300,
    color: "#aaa",
    letterSpacing: "0.06em",
    marginBottom: "16px",
  },
  heroTitle: {
    fontSize: "clamp(34px, 5vw, 58px)",
    fontWeight: 400,
    color: "#111",
    lineHeight: 1.1,
    letterSpacing: "0.01em",
    marginBottom: "20px",
  },
  heroSub: {
    fontSize: "14px",
    color: "#888",
    lineHeight: 1.75,
    fontWeight: 300,
  },

  divider: {
    borderTop: "0.5px solid #ebebeb",
    margin: "64px 0",
  },

  // Section header
  sectionHead: {
    marginBottom: "40px",
  },
  sectionEyebrow: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "10px",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: 400,
    color: "#111",
    lineHeight: 1.15,
    letterSpacing: "0.01em",
  },

  // Contact cards
  contactSection: {},
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginTop: "40px",
  },
  contactCard: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "24px",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#ebebeb",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "border-color 0.2s ease",
    height: "100%",
  },
  contactCardIcon: {
    color: "#111",
    marginBottom: "4px",
  },
  contactCardTitle: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "#aaa",
  },
  contactCardValue: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#111",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  contactCardDesc: {
    fontSize: "11px",
    color: "#bbb",
    lineHeight: 1.5,
    marginTop: "auto",
    paddingTop: "8px",
  },

  // FAQ + Form
  faqFormSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "80px",
    alignItems: "flex-start",
  },
  faqCol: {},
  formCol: {},

  // Form
  formBody: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "32px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  formLabel: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "#aaa",
  },
  formInput: {
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
  formSuccess: {
    marginTop: "32px",
    padding: "32px",
    background: "#fafafa",
    borderRadius: "8px",
    border: "0.5px solid #ebebeb",
  },
  btnPrimary: {
    width: "100%",
    height: "48px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "background 0.2s ease",
  },
};