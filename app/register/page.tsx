"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const REGISTER_MUTATION = `
  mutation Register($username: String!, $email: String!, $password: String!) {
    registerUser(input: {
      username: $username
      email: $email
      password: $password
    }) {
      user {
        id
        name
        email
      }
    }
  }
`;

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      // Register via WooGraphQL
      const res = await fetch(
        process.env.NEXT_PUBLIC_WORDPRESS_URL + "/graphql",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: REGISTER_MUTATION,
            variables: {
              username: email, // pakai email sebagai username
              email,
              password,
            },
          }),
        }
      );

      const { data, errors } = await res.json();

      if (errors || !data?.registerUser) {
        const msg = errors?.[0]?.message || "Registrasi gagal.";
        // handle common WP errors
        if (msg.includes("existing_user_email")) {
          setError("Email sudah terdaftar. Silakan login.");
        } else {
          setError(msg);
        }
        setLoading(false);
        return;
      }

      // Auto login after register
      const loginRes = await signIn("credentials", {
        username: email,
        password,
        redirect: false,
        callbackUrl: "/account",
      });

      if (loginRes?.ok) {
        router.push("/account");
        router.refresh();
      } else {
        // Register berhasil tapi auto-login gagal
        router.push("/login?registered=1");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
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
          <h1 className={cormorant.className} style={styles.title}>
            Buat akun baru
          </h1>
          <p style={styles.subtitle}>
            Sudah punya akun?{" "}
            <Link href="/login" style={styles.link}>Masuk di sini</Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              placeholder="Nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              autoComplete="name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              autoComplete="email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              autoComplete="new-password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Konfirmasi Password</label>
            <input
              type="password"
              placeholder="Ulangi password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                ...styles.input,
                borderColor: confirm && confirm !== password ? "#fca5a5" : "#e0e0e0",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  confirm && confirm !== password ? "#fca5a5" : "#e0e0e0";
              }}
              autoComplete="new-password"
            />
            {confirm && confirm !== password && (
              <p style={styles.fieldError}>Password tidak cocok</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#333"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#111"; }}
          >
            {loading ? "Memproses..." : "Buat Akun"}
          </button>

          <p style={styles.tos}>
            Dengan mendaftar, Anda menyetujui{" "}
            <Link href="/terms" style={styles.link}>Syarat & Ketentuan</Link>
            {" "}dan{" "}
            <Link href="/privacy" style={styles.link}>Kebijakan Privasi</Link>
            {" "}kami.
          </p>
        </div>

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
  fieldError: {
    fontSize: "11px",
    color: "#dc2626",
    marginTop: "3px",
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
    height: "48px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    transition: "background 0.2s ease",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  tos: {
    fontSize: "11px",
    color: "#bbb",
    lineHeight: 1.6,
    textAlign: "center" as const,
  },
};