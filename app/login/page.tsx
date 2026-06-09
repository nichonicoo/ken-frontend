// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Cormorant_Garamond } from "next/font/google";
// import Link from "next/link";

// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["300", "400", "500"],
// });

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") || "/account";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async () => {
//     if (!email || !password) {
//       setError("Email dan password wajib diisi.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const res = await signIn("credentials", {
//       username: email,
//       password,
//       redirect: false,
//       callbackUrl,
//     });

//     setLoading(false);

//     if (res?.error) {
//         // console.log('res: ', res);
//       setError("Email atau password salah. Silakan coba lagi.");
//     } else if (res?.ok) {
//         // console.log('res ok: ', res);
//       router.push(callbackUrl);
//       router.refresh();
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>

//         {/* Header */}
//         <div style={styles.header}>
//           <Link href="/" style={styles.logoLink}>
//             {/* TODO: ganti dengan logo toko */}
//             <span className={cormorant.className} style={styles.logo}>Store</span>
//           </Link>
//           <h1 className={cormorant.className} style={styles.title}>
//             Masuk ke akun Anda
//           </h1>
//           <p style={styles.subtitle}>
//             Belum punya akun?{" "}
//             <Link href="/register" style={styles.link}>Daftar di sini</Link>
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div style={styles.errorBox}>
//             <p style={styles.errorText}>{error}</p>
//           </div>
//         )}

//         {/* Form */}
//         <div style={styles.form}>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Email</label>
//             <input
//               type="email"
//               placeholder="email@contoh.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//               style={styles.input}
//               onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
//               onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
//               autoComplete="email"
//             />
//           </div>

//           <div style={styles.formGroup}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <label style={styles.label}>Password</label>
//               {/* TODO: arahkan ke halaman forgot password WordPress */}
//               <a
//                 href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-login.php?action=lostpassword`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={styles.forgotLink}
//               >
//                 Lupa password?
//               </a>
//             </div>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//               style={styles.input}
//               onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
//               onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
//               autoComplete="current-password"
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               ...styles.submitBtn,
//               opacity: loading ? 0.6 : 1,
//               cursor: loading ? "not-allowed" : "pointer",
//             }}
//             onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#333"; }}
//             onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#111"; }}
//           >
//             {loading ? "Memproses..." : "Masuk"}
//           </button>
//         </div>

//         {/* Divider */}
//         <div style={styles.dividerWrap}>
//           <div style={styles.dividerLine} />
//           <span style={styles.dividerText}>atau</span>
//           <div style={styles.dividerLine} />
//         </div>

//         {/* Register CTA */}
//         <Link href="/register" style={styles.registerBtn}>
//           Buat akun baru
//         </Link>

//       </div>
//     </div>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   page: {
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "40px 20px",
//     backgroundColor: "#fafafa",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   card: {
//     width: "100%",
//     maxWidth: "420px",
//     background: "#fff",
//     borderRadius: "8px",
//     border: "0.5px solid #ebebeb",
//     padding: "48px 40px",
//     boxShadow: "0 4px 40px rgba(0,0,0,0.04)",
//   },
//   header: {
//     marginBottom: "32px",
//   },
//   logoLink: {
//     textDecoration: "none",
//     display: "block",
//     marginBottom: "24px",
//   },
//   logo: {
//     fontSize: "24px",
//     fontWeight: 400,
//     color: "#111",
//     letterSpacing: "0.04em",
//   },
//   title: {
//     fontSize: "26px",
//     fontWeight: 400,
//     color: "#111",
//     margin: "0 0 8px",
//     lineHeight: 1.15,
//   },
//   subtitle: {
//     fontSize: "13px",
//     color: "#888",
//   },
//   link: {
//     color: "#111",
//     fontWeight: 500,
//     textDecoration: "underline",
//   },
//   errorBox: {
//     background: "#fff5f5",
//     border: "0.5px solid #fca5a5",
//     borderRadius: "4px",
//     padding: "10px 14px",
//     marginBottom: "20px",
//   },
//   errorText: {
//     fontSize: "12px",
//     color: "#dc2626",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "18px",
//   },
//   formGroup: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "6px",
//   },
//   label: {
//     fontSize: "9px",
//     fontWeight: 600,
//     letterSpacing: "0.16em",
//     textTransform: "uppercase" as const,
//     color: "#aaa",
//   },
//   input: {
//     width: "100%",
//     padding: "11px 14px",
//     fontSize: "13px",
//     color: "#111",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     background: "#fff",
//     borderWidth: "0.5px",
//     borderStyle: "solid",
//     borderColor: "#e0e0e0",
//     borderRadius: "4px",
//     outline: "none",
//     transition: "border-color 0.15s ease",
//     boxSizing: "border-box" as const,
//   },
//   forgotLink: {
//     fontSize: "11px",
//     color: "#aaa",
//     textDecoration: "none",
//   },
//   submitBtn: {
//     width: "100%",
//     height: "48px",
//     background: "#111",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     fontSize: "11px",
//     fontWeight: 600,
//     letterSpacing: "0.12em",
//     textTransform: "uppercase" as const,
//     transition: "background 0.2s ease",
//     marginTop: "4px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   dividerWrap: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     margin: "24px 0",
//   },
//   dividerLine: {
//     flex: 1,
//     borderTop: "0.5px solid #ebebeb",
//   },
//   dividerText: {
//     fontSize: "11px",
//     color: "#bbb",
//   },
//   registerBtn: {
//     display: "block",
//     width: "100%",
//     height: "48px",
//     background: "transparent",
//     color: "#111",
//     borderWidth: "0.5px",
//     borderStyle: "solid",
//     borderColor: "#e0e0e0",
//     borderRadius: "4px",
//     fontSize: "11px",
//     fontWeight: 600,
//     letterSpacing: "0.12em",
//     textTransform: "uppercase" as const,
//     textDecoration: "none",
//     // display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     transition: "border-color 0.15s ease",
//   } as React.CSSProperties,
// };

"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username: email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
    } else if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <Link href="/" style={styles.logoLink}>
            {/* TODO: ganti dengan logo toko */}
            <span className={cormorant.className} style={styles.logo}>Store</span>
          </Link>
          <h1 className={cormorant.className} style={styles.title}>
            Masuk ke akun Anda
          </h1>
          <p style={styles.subtitle}>
            Belum punya akun?{" "}
            <Link href="/register" style={styles.link}>Daftar di sini</Link>
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
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={styles.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              autoComplete="email"
            />
          </div>

          <div style={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={styles.label}>Password</label>
              {/* TODO: arahkan ke halaman forgot password WordPress */}
              <a
                href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-login.php?action=lostpassword`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.forgotLink}
              >
                Lupa password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={styles.input}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#111"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
              autoComplete="current-password"
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
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#333"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#111"; }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>

        {/* Divider */}
        <div style={styles.dividerWrap}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>atau</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Register CTA */}
        <Link href="/register" style={styles.registerBtn}>
          Buat akun baru
        </Link>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} />}>
      <LoginForm />
    </Suspense>
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
  forgotLink: {
    fontSize: "11px",
    color: "#aaa",
    textDecoration: "none",
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
    marginTop: "4px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  dividerWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    borderTop: "0.5px solid #ebebeb",
  },
  dividerText: {
    fontSize: "11px",
    color: "#bbb",
  },
  registerBtn: {
    display: "block",
    width: "100%",
    height: "48px",
    background: "transparent",
    color: "#111",
    borderWidth: "0.5px",
    borderStyle: "solid",
    borderColor: "#e0e0e0",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    // display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "border-color 0.15s ease",
  } as React.CSSProperties,
};