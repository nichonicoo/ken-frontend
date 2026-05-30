"use client";

import { useEffect, useState, useRef } from "react";
import NavDropdown from "./NavDropdown";
import SearchBar from "./SearchBar";
import { getCategories } from "@/app/api/graphql/front_api";
import { getCart } from "@/app/api/graphql/Transaction";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

type ProductItems = {
  label: string;
  href: string;
};

export default function Header() {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [productItems, setProductItems] = useState<ProductItems[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)){
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  },[]);

  // scroll hide show
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // fetchcategories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await getCategories();
        const mapped = categories.map((cat: any) => ({
          label: cat.name,
          href: `/products/category/${cat.slug}`,
        }));
        mapped.unshift({ label: "Best Seller", href: "/products/category/best-seller/" });
        mapped.unshift({ label: "All Product", href: "/products" });
        setProductItems(mapped);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch cart count — dijalankan saat mount dan setiap kali window focus
  useEffect(() => {
    async function fetchCartCount() {
      try {
        const cart = await getCart();
        const total = (cart?.contents?.nodes || []).reduce(
          (sum: number, node: any) => sum + (node.quantity || 0),
          0
        );
        setCartCount(total);
      } catch {
        // silent fail — tidak perlu tampilkan error
      }
    }

    fetchCartCount();

    // Re-fetch saat user kembali ke tab
    window.addEventListener("focus", fetchCartCount);
    return () => window.removeEventListener("focus", fetchCartCount);
  }, []);

  const firstName = session?.user?.name?.split(" ")[0] || "Akun";

  return (
    <header
      style={{
        ...styles.header,
        transform: show ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      {/* center: logo n nav */}
      <div style={styles.centerContainer}>
        <div style={styles.logo}>Store</div>
        <nav style={styles.menu}>
          <a href="/" style={styles.link}>Home</a>
          <NavDropdown title="Products" items={productItems} />
          <a href="/about" style={styles.link}>About Us</a>
          <a href="/customer-care" style={styles.link}>Customer Care</a>
        </nav>
      </div>

      {/* right icons */}
      <div style={styles.rightIcons}>
        <SearchBar />

        {/* cart w/ badge */}
        <button
          style={styles.iconBtn}
          aria-label="Cart"
          onClick={() => router.push("/cart")}
        >
          <div style={styles.cartWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span style={styles.badge}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </div>
        </button>

        {/* <button style={styles.iconBtn} aria-label="Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button> */}
        {/* user loading stat */}
        {status == "loading" && (
          <div style={styles.iconBtn}>
            <div style={styles.avatarSkeleton} />
          </div>
        )}
        {/* User — not logged in */}
        {status === "unauthenticated" && (
          <button
            style={styles.iconBtn}
            aria-label="Login"
            onClick={() => router.push("/login")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        )}
        {status == "authenticated" && (
          <div ref={userMenuRef} style={{ position: "relative" }}>
            <button
              style={styles.avatarBtn}
              onClick={() => setUserMenuOpen((o) => !o)}
              aria-label="User menu"
            >
              <div style={styles.avatarCircle}>
                {firstName.charAt(0).toUpperCase()}
              </div>
            </button>

            {userMenuOpen && (
              <div style={styles.dropdown}>
                {/* User info */}
                <div style={styles.dropdownHeader}>
                  <p style={styles.dropdownName}>{session.user?.name}</p>
                  <p style={styles.dropdownEmail}>{session.user?.email}</p>
                </div>
                <div style={styles.dropdownDivider} />
 
                {/* Menu items */}
                <a href="/account" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  My Account
                </a>
                <a href="/orders" style={styles.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Pesanan Saya
                </a>
 
                <div style={styles.dropdownDivider} />
 
                <button
                  style={{ ...styles.dropdownItem, ...styles.dropdownLogout }}
                  onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 40px",
    zIndex: 1000,
    borderBottom: "1px solid #eee",
    transition: "transform 0.3s ease",
    boxSizing: "border-box",
  },
  centerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  logo: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#6bc1c6",
    fontFamily: "Georgia, serif",
    letterSpacing: "2px",
    lineHeight: 1,
  },
  menu: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#444",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.5px",
    transition: "color 0.2s",
  },
  rightIcons: {
    position: "absolute",
    right: "40px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#444",
    padding: "6px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s, color 0.2s",
  },
  cartWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    background: "#6bc1c6",
    color: "white",
    fontSize: "10px",
    fontWeight: 700,
    minWidth: "18px",
    height: "18px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    lineHeight: 1,
    pointerEvents: "none",
  },
 
  // Avatar
  avatarBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#111",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  avatarSkeleton: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#f0f0f0",
  },
 
  // Dropdown
  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    width: "220px",
    background: "#fff",
    borderRadius: "8px",
    border: "0.5px solid #ebebeb",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    overflow: "hidden",
    zIndex: 100,
  },
  dropdownHeader: {
    padding: "14px 16px",
  },
  dropdownName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    marginBottom: "2px",
  },
  dropdownEmail: {
    fontSize: "11px",
    color: "#aaa",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  dropdownDivider: {
    borderTop: "0.5px solid #f0f0f0",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 16px",
    fontSize: "12px",
    color: "#444",
    textDecoration: "none",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    background: "none",
    border: "none",
    width: "100%",
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
  dropdownLogout: {
    color: "#dc2626",
  },
};