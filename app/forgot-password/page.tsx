"use client";

import { useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { sendPasswordResetEmail } from "@/app/api/graphql/forgotPassword";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(email);
      setSuccess(true);
      setEmail("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <Link href="/" style={styles.logoLink}>
            <span className={cormorant.className} style={styles.logo}>Store</span>
          </Link>
          {!success ? (
            <>
              <h1 className={cormorant.className} style={styles.title}>
                Lupa password
              </h1>
              <p style={styles.subtitle}>
                Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset password.
              </p>
            </>
          ) : (
            <>
              <h1 className={cormorant.className} style={styles.title}>
                Cek email Anda
              </h1>
              <p style={styles.subtitle}>
                Tautan reset password telah dikirim ke email Anda. Silakan periksa kotak masuk
                (atau folder spam) Anda.
              </p>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {!success ? (
          /* Form */
          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#111";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
                autoComplete="email"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  (e.currentTarget as HTMLButtonElement).style.background = "#333";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#111";
              }}
            >
              {loading ? "Mengirim..." : "Kirim Tautan Reset"}
            </button>

            <p style={styles.backLink}>
              <Link href="/login" style={styles.link}>
                Kembali ke halaman masuk
              </Link>
            </p>
          </div>
        ) : (
          /* Success state */
          <div style={styles.form}>
            <div style={styles.successBox}>
              <p style={styles.successText}>
                Jika email terdaftar di sistem kami, Anda akan menerima tautan reset password
                dalam beberapa menit.
              </p>
            </div>

            <p style={styles.backLink}>
              <Link href="/login" style={styles.link}>
                Kembali ke halaman masuk
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    backgroundColor: "#fafafa",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "8px",
    border: "0.5px solid #ebebeb",
    padding: "48px 40px",
    boxShadow: "0 4px 40px rgba(0,0,0,0.04)",
  },
  header: {
    marginBottom: "32px",
  },
  logoLink: {
    textDecoration: "none",
    display: "block",
    marginBottom: "24px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: 400,
    color: "#111",
    letterSpacing: "0.04em",
  },
  title: {
    fontSize: "26px",
    fontWeight: 400,
    color: "#111",
    margin: "0 0 8px",
    lineHeight: 1.15,
  },
  subtitle: {
    fontSize: "13px",
    color: "#888",
    lineHeight: 1.6,
  },
  link: {
    color: "#111",
    fontWeight: 500,
    textDecoration: "underline",
  },
  errorBox: {
    background: "#fff5f5",
    border: "0.5px solid #fca5a5",
    borderRadius: "4px",
    padding: "10px 14px",
    marginBottom: "20px",
  },
  errorText: {
    fontSize: "12px",
    color: "#dc2626",
  },
  successBox: {
    background: "#f0fdf4",
    border: "0.5px solid #86efac",
    borderRadius: "4px",
    padding: "14px",
    marginBottom: "4px",
  },
  successText: {
    fontSize: "12px",
    color: "#16a34a",
    lineHeight: 1.6,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
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
  submitBtn: {
    width: "100%",
    padding: "13px",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#fff",
    background: "#111",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  backLink: {
    textAlign: "center" as const,
    fontSize: "12px",
    color: "#888",
    margin: 0,
  },
};
