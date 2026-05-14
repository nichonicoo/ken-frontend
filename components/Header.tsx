// "use client";

// import { useEffect, useState } from "react";
// import NavDropdown from "./NavDropdown";
// import { getCategories } from "@/app/api/graphql/page";
// import { useRouter } from "next/navigation";

// type ProductItems = {
//   label: string;
//   href: string;
// }


// export default function Header() {
//   const [show, setShow] = useState(true);
//   const [lastScroll, setLastScroll] = useState(0);
//   const [productItems, setProductItems] = useState<ProductItems[]>([]);

//   const router = useRouter();

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScroll = window.scrollY;
//       if (currentScroll > lastScroll && currentScroll > 50) {
//         setShow(false);
//       } else {
//         setShow(true);
//       }
//       setLastScroll(currentScroll);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScroll]);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const categories = await getCategories();
//         const mapped = categories.map((cat: any) => ({
//           label: cat.name,
//           href: `/products/category/${cat.slug}`,
//         }));
//         // add manual
//         mapped.unshift({
//           label: "Best Seller",
//           href: "/products/category/best-seller/",
//         });
//         mapped.unshift({
//           label: "All Product",
//           href: "/products",
//         });
//         setProductItems(mapped);
//       } catch (err) {
//         console.error("Failed to fetch categories", err);
//       }
//     }
//     fetchCategories();
//   }, []);

//   return (
//     <header
//       style={{
//         ...styles.header,
//         transform: show ? "translateY(0)" : "translateY(-100%)",
//       }}
//     >
//       {/* CENTER CONTAINER: Logo + Nav stacked */}
//       <div style={styles.centerContainer}>
//         <div style={styles.logo}>ecentio</div>
//         <nav style={styles.menu}>
//           <a href="/" style={styles.link}>Home</a>
//           <NavDropdown title="Products" items={productItems}/>
//           <a href="/about" style={styles.link}>About Us</a>
//           <a href="/customer-care" style={styles.link}>Customer Care</a>
//         </nav>
//       </div>

//       {/* RIGHT ICONS: absolute so they don't shift the center */}
//       <div style={styles.rightIcons}>
//         <button style={styles.iconBtn} aria-label="Search">
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="11" cy="11" r="8" />
//             <line x1="21" y1="21" x2="16.65" y2="16.65" />
//           </svg>
//         </button>
//         <button style={styles.iconBtn} aria-label="Cart" onClick={() => router.push("/cart")}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <circle cx="9" cy="21" r="1" />
//             <circle cx="20" cy="21" r="1" />
//             <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
//           </svg>
//         </button>
//         <button style={styles.iconBtn} aria-label="Profile">
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//             <circle cx="12" cy="7" r="4" />
//           </svg>
//         </button>
//       </div>
//     </header>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   header: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     background: "white",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "12px 40px",
//     zIndex: 1000,
//     borderBottom: "1px solid #eee",
//     transition: "transform 0.3s ease",
//     boxSizing: "border-box",
//   },
//   centerContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "8px",
//   },
//   logo: {
//     fontSize: "30px",
//     fontWeight: "bold",
//     color: "#6bc1c6",
//     fontFamily: "Georgia, serif",
//     letterSpacing: "2px",
//     lineHeight: 1,
//   },
//   menu: {
//     display: "flex",
//     gap: "32px",
//     alignItems: "center",
//   },
//   link: {
//     textDecoration: "none",
//     color: "#444",
//     fontSize: "14px",
//     fontWeight: 500,
//     letterSpacing: "0.5px",
//     transition: "color 0.2s",
//   },
//   rightIcons: {
//     position: "absolute",
//     right: "40px",
//     top: "50%",
//     transform: "translateY(-50%)",
//     display: "flex",
//     gap: "8px",
//     alignItems: "center",
//   },
//   iconBtn: {
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     color: "#444",
//     padding: "6px",
//     borderRadius: "6px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "background 0.2s, color 0.2s",
//   },
// };

"use client";

import { useEffect, useState } from "react";
import NavDropdown from "./NavDropdown";
import SearchBar from "./SearchBar";
import { getCategories } from "@/app/api/graphql/page";
import { getCart } from "@/app/api/graphql/Transaction";
import { useRouter } from "next/navigation";

type ProductItems = {
  label: string;
  href: string;
};

export default function Header() {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [productItems, setProductItems] = useState<ProductItems[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();

  // Scroll hide/show
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

  // Fetch categories
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

  return (
    <header
      style={{
        ...styles.header,
        transform: show ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      {/* CENTER: Logo + Nav */}
      <div style={styles.centerContainer}>
        <div style={styles.logo}>ecentio</div>
        <nav style={styles.menu}>
          <a href="/" style={styles.link}>Home</a>
          <NavDropdown title="Products" items={productItems} />
          <a href="/about" style={styles.link}>About Us</a>
          <a href="/customer-care" style={styles.link}>Customer Care</a>
        </nav>
      </div>

      {/* RIGHT ICONS */}
      <div style={styles.rightIcons}>
        <SearchBar />

        {/* Cart dengan badge */}
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

        <button style={styles.iconBtn} aria-label="Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
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
};