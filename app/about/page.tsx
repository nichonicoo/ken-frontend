"use client";

import { useState, useEffect, useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import Breadcrumb from "@/components/Breadcrumbs";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// animated number counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(ease * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// fade in on scroll
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// main
export default function AboutPage() {
  return (
    <div style={styles.page}>

      {/* Breadcrumb */}
      <div style={styles.breadcrumbWrap}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "About Us" },
          ]}
        />
      </div>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <FadeIn>
          <p style={{ ...styles.eyebrow, ...cormorant.style }}>Tentang Kami</p>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className={cormorant.className} style={styles.heroTitle}>
            {/* TODO: ganti dengan tagline utama toko */}
            Kami percaya setiap ruang<br />layak memiliki kehidupan.
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p style={styles.heroSub}>
            {/* TODO: ganti dengan deskripsi singkat toko */}
            Toko tanaman hias terpercaya yang menghadirkan keindahan alam ke dalam rumah dan kantor Anda sejak 2018.
          </p>
        </FadeIn>
      </section>

      {/* ── Divider ── */}
      <div style={styles.divider} />

      {/* ── Stats ── */}
      <FadeIn>
        <section style={styles.stats}>
          {[
            { value: 500, suffix: "+", label: "Produk tersedia" },
            { value: 10000, suffix: "+", label: "Pelanggan puas" },
            { value: 7, suffix: " tahun", label: "Pengalaman" },
            { value: 50, suffix: "+", label: "Kota terjangkau" },
          ].map(({ value, suffix, label }) => (
            <div key={label} style={styles.statItem}>
              <p className={cormorant.className} style={styles.statNumber}>
                <Counter target={value} suffix={suffix} />
              </p>
              <p style={styles.statLabel}>{label}</p>
            </div>
          ))}
        </section>
      </FadeIn>

      <div style={styles.divider} />

      {/* ── Story ── */}
      <section style={styles.story}>
        <FadeIn>
          <div style={styles.storyLeft}>
            {/* TODO: ganti dengan foto toko / foto tim */}
            <div style={styles.storyImgWrap}>
              <div style={styles.storyImgPlaceholder}>
                <p style={styles.storyImgLabel}>Foto Toko / Tim</p>
              </div>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={150}>
          <div style={styles.storyRight}>
            <p style={styles.sectionEyebrow}>Cerita Kami</p>
            <h2 className={cormorant.className} style={styles.sectionTitle}>
              {/* TODO: ganti dengan judul section cerita */}
              Dimulai dari kecintaan terhadap alam
            </h2>
            <div style={styles.storyBody}>
              {/* TODO: ganti dengan cerita asal-usul toko */}
              <p>
                Berawal dari hobi merawat tanaman di sudut kecil apartemen, kami menyadari bahwa tanaman bukan sekadar dekorasi — mereka adalah teman hidup yang membawa ketenangan dan kesegaran ke setiap ruang.
              </p>
              <p>
                Sejak 2018, kami telah melayani ribuan pelanggan di seluruh Indonesia dengan menghadirkan tanaman hias berkualitas, pot pilihan, dan layanan konsultasi gratis untuk membantu Anda menemukan tanaman yang tepat.
              </p>
              <p>
                Setiap tanaman yang kami kirim dirawat dengan penuh perhatian, dipilih langsung dari kebun terpercaya, dan dikemas secara aman agar sampai dalam kondisi terbaik di tangan Anda.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      <div style={styles.divider} />

      {/* ── Values ── */}
      <section style={styles.values}>
        <FadeIn>
          <div style={styles.valueHeader}>
            <p style={styles.sectionEyebrow}>Nilai Kami</p>
            <h2 className={cormorant.className} style={styles.sectionTitle}>
              Yang kami pegang teguh
            </h2>
          </div>
        </FadeIn>
        <div style={styles.valueGrid}>
          {[
            {
              num: "01",
              title: "Kualitas Tanpa Kompromi",
              // TODO: ganti deskripsi sesuai nilai toko
              desc: "Setiap produk dipilih dan diseleksi dengan standar ketat sebelum sampai ke tangan Anda.",
            },
            {
              num: "02",
              title: "Pelayanan dari Hati",
              desc: "Kami hadir untuk menjawab setiap pertanyaan dan memastikan pengalaman berbelanja yang menyenangkan.",
            },
            {
              num: "03",
              title: "Ramah Lingkungan",
              desc: "Kami menggunakan kemasan daur ulang dan berkomitmen pada praktik bisnis yang berkelanjutan.",
            },
            {
              num: "04",
              title: "Pengiriman Aman",
              desc: "Sistem pengemasan khusus kami memastikan setiap tanaman tiba dalam kondisi prima di mana pun Anda berada.",
            },
          ].map(({ num, title, desc }, i) => (
            <FadeIn key={num} delay={i * 80}>
              <div style={styles.valueCard}>
                <span className={cormorant.className} style={styles.valueNum}>{num}</span>
                <h3 style={styles.valueTitle}>{title}</h3>
                <p style={styles.valueDesc}>{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div style={styles.divider} />

      {/* ── CTA ── */}
      <FadeIn>
        <section style={styles.cta}>
          <h2 className={cormorant.className} style={styles.ctaTitle}>
            Siap menghijaukan ruang Anda?
          </h2>
          <p style={styles.ctaSub}>
            Jelajahi koleksi lengkap kami dan temukan tanaman yang sempurna untuk rumah Anda.
          </p>
          <a href="/products" style={styles.ctaBtn}>
            Lihat Semua Produk
          </a>
        </section>
      </FadeIn>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "10px 32px 80px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    backgroundColor: "#fff",
  },
  breadcrumbWrap: {
    marginBottom: "48px",
  },

  // Hero
  hero: {
    maxWidth: "780px",
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
    fontSize: "clamp(36px, 5vw, 64px)",
    fontWeight: 400,
    color: "#111",
    lineHeight: 1.1,
    letterSpacing: "0.01em",
    marginBottom: "24px",
  },
  heroSub: {
    fontSize: "15px",
    color: "#666",
    lineHeight: 1.75,
    maxWidth: "560px",
    fontWeight: 300,
  },

  divider: {
    borderTop: "0.5px solid #ebebeb",
    margin: "64px 0",
  },

  // Stats
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "0",
  },
  statItem: {
    padding: "0 32px",
    borderLeft: "0.5px solid #ebebeb",
  },
  statNumber: {
    fontSize: "52px",
    fontWeight: 400,
    color: "#111",
    lineHeight: 1,
    marginBottom: "8px",
    letterSpacing: "-0.01em",
  },
  statLabel: {
    fontSize: "11px",
    color: "#aaa",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },

  // Story
  story: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "80px",
    alignItems: "center",
  },
  storyLeft: {},
  storyImgWrap: {
    borderRadius: "8px",
    overflow: "hidden",
    aspectRatio: "4/5",
  },
  storyImgPlaceholder: {
    width: "100%",
    height: "100%",
    background: "#f5f3ef",
    border: "0.5px solid #e0e0e0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "480px",
  },
  storyImgLabel: {
    fontSize: "11px",
    color: "#bbb",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },
  storyRight: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  sectionEyebrow: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 400,
    color: "#111",
    lineHeight: 1.15,
    letterSpacing: "0.01em",
    marginBottom: "28px",
  },
  storyBody: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontSize: "14px",
    color: "#555",
    lineHeight: 1.8,
  },

  // Values
  values: {
    display: "flex",
    flexDirection: "column",
    gap: "48px",
  },
  valueHeader: {},
  valueGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "32px",
  },
  valueCard: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    paddingTop: "20px",
    borderTop: "0.5px solid #ebebeb",
  },
  valueNum: {
    fontSize: "32px",
    fontWeight: 300,
    color: "#ddd",
    lineHeight: 1,
    letterSpacing: "0.02em",
  },
  valueTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111",
    letterSpacing: "0.04em",
    lineHeight: 1.4,
  },
  valueDesc: {
    fontSize: "13px",
    color: "#888",
    lineHeight: 1.7,
    fontWeight: 300,
  },

  // CTA
  cta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center" as const,
    padding: "64px 0",
    gap: "20px",
  },
  ctaTitle: {
    fontSize: "clamp(28px, 4vw, 48px)",
    fontWeight: 400,
    color: "#111",
    letterSpacing: "0.01em",
    lineHeight: 1.15,
  },
  ctaSub: {
    fontSize: "14px",
    color: "#888",
    maxWidth: "420px",
    lineHeight: 1.7,
  },
  ctaBtn: {
    display: "inline-block",
    marginTop: "8px",
    padding: "13px 40px",
    background: "#111",
    color: "#fff",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    borderRadius: "2px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "background 0.2s ease",
  },
};