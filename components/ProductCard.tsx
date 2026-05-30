// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// interface ProductProps {
//   name: string;
//   slug: string;
//   price: string;
//   regularPrice?: string;
//   salePrice?: string;
//   onSale?: boolean;
//   image?: string;
//   category?: string;
// }

// export default function ProductCard({
//   name,
//   slug,
//   price,
//   regularPrice,
//   salePrice,
//   onSale,
//   image,
//   category,
// }: ProductProps) {
//   const [hovered, setHovered] = useState(false);
 
//   const fmt = (val?: string) => {
//     if (!val) return "";
//     const num = parseFloat(val.replace(/[^0-9.]/g, ""));
//     if (isNaN(num)) return val;
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(num);
//   };
 
//   return (
//     <Link
//       href={`/products/${slug}`}
//       style={{ textDecoration: "none", color: "inherit", display: "block" }}
//     >
//       <div
//         style={{
//           ...styles.card,
//           ...(hovered ? styles.cardHover : {}),
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         {/* Image */}
//         <div style={styles.imageContainer}>
//           {onSale && <span style={styles.saleBadge}>SALE</span>}
//           {image ? (
//             <img src={image} alt={name} style={styles.image} loading="lazy" />
//           ) : (
//             <div style={styles.imagePlaceholder} />
//           )}
//         </div>
 
//         {/* Info */}
//         <div style={styles.info}>
//           {category && (
//             <span style={styles.category}>{category.toUpperCase()}</span>
//           )}
 
//           <p style={styles.name}>{name}</p>
 
//           {/* Price */}
//           {onSale && regularPrice ? (
//             <div style={styles.priceRow}>
//               <span style={styles.priceOriginal}>{fmt(regularPrice)}</span>
//               <span style={styles.priceSale}>{fmt(salePrice)}</span>
//             </div>
//           ) : (
//             <p style={styles.price}>{fmt(price)}</p>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }

// // const styles: { [key: string]: React.CSSProperties } = {
// //   card: {
// //     width: "220px",
// //     backgroundColor: "#fff",
// //     display: "flex",
// //     flexDirection: "column",
// //     cursor: "pointer",
// //     transition: "opacity 0.2s ease"
// //   },
// //   cardHover: {
// //     opacity: 0.85,
// //   },
// //   imageContainer: {
// //     width: "100%",
// //     height: "200px",
// //     backgroundColor: "#f4f4f4",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     overflow: "hidden",
// //     marginBottom: "12px",
// //     padding: "15px",
// //     boxSizing: "border-box",
// //     borderRadius: "12px"
// //   },
// //   image: {
// //     maxWidth: "100%",
// //     maxHeight: "100%",
// //     objectFit: "contain",
// //     display: "block",
// //   },
// //   imagePlaceholder: {
// //     width: "60%",
// //     height: "60%",
// //     backgroundColor: "#e0e0e0",
// //     borderRadius: "4px",
// //   },
// //   info: {
// //     display: "flex",
// //     flexDirection: "column",
// //     gap: "4px",
// //   },
// //   category: {
// //     fontSize: "11px",
// //     color: "#888",
// //     letterSpacing: "0.08em",
// //     fontWeight: 500,
// //     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
// //     marginBottom: "2px",
// //   },
// //   name: {
// //     fontSize: "13px",
// //     fontWeight: 600,
// //     color: "#111",
// //     margin: 0,
// //     lineHeight: "1.4",
// //     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
// //     textTransform: "uppercase",
// //     letterSpacing: "0.02em",
// //     display: "-webkit-box",
// //     WebkitLineClamp: 2,
// //     WebkitBoxOrient: "vertical",
// //     overflow: "hidden",
// //   },
// //   price: {
// //     fontSize: "13px",
// //     fontWeight: 400,
// //     color: "#111",
// //     margin: 0,
// //     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
// //     marginTop: "4px",
// //   },
// // };

// const styles: { [key: string]: React.CSSProperties } = {
//   card: {
//     width: "100%",
//     backgroundColor: "#fff",
//     display: "flex",
//     flexDirection: "column",
//     cursor: "pointer",
//     transition: "opacity 0.2s ease",
//   },
//   cardHover: {
//     opacity: 0.85,
//   },
//   imageContainer: {
//     position: "relative",
//     width: "100%",
//     height: "200px",
//     backgroundColor: "#f4f4f4",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     marginBottom: "12px",
//     padding: "15px",
//     boxSizing: "border-box",
//     borderRadius: "12px",
//   },
//   saleBadge: {
//     position: "absolute",
//     top: "10px",
//     left: "10px",
//     zIndex: 2,
//     background: "#d02828",
//     color: "#fff",
//     fontSize: "9px",
//     fontWeight: 700,
//     letterSpacing: "0.12em",
//     padding: "3px 8px",
//     borderRadius: "2px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   image: {
//     maxWidth: "100%",
//     maxHeight: "100%",
//     objectFit: "contain",
//     display: "block",
//   },
//   imagePlaceholder: {
//     width: "60%",
//     height: "60%",
//     backgroundColor: "#e0e0e0",
//     borderRadius: "4px",
//   },
//   info: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px",
//   },
//   category: {
//     fontSize: "11px",
//     color: "#888",
//     letterSpacing: "0.08em",
//     fontWeight: 500,
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     marginBottom: "2px",
//   },
//   name: {
//     fontSize: "13px",
//     fontWeight: 600,
//     color: "#111",
//     margin: 0,
//     lineHeight: "1.4",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     textTransform: "uppercase",
//     letterSpacing: "0.02em",
//     display: "-webkit-box",
//     WebkitLineClamp: 2,
//     WebkitBoxOrient: "vertical",
//     overflow: "hidden",
//   },
//   priceRow: {
//     display: "flex",
//     alignItems: "baseline",
//     gap: "8px",
//     marginTop: "4px",
//   },
//   priceOriginal: {
//     fontSize: "11px",
//     color: "#bbb",
//     textDecoration: "line-through",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   priceSale: {
//     fontSize: "13px",
//     fontWeight: 500,
//     color: "#111",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   price: {
//     fontSize: "13px",
//     fontWeight: 400,
//     color: "#111",
//     margin: 0,
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     marginTop: "4px",
//   },
// };
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ProductProps {
  name: string;
  slug: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
  image?: string;
  category?: string;
}

export default function ProductCard({
  name,
  slug,
  price,
  regularPrice,
  salePrice,
  onSale,
  image,
  category,
}: ProductProps) {
  const [hovered, setHovered] = useState(false);

  const fmt = (val?: string) => {
    if (!val) return "";
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return val;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  return (
    <Link
      href={`/products/${slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={styles.card}
      >
        {/* Image */}
        <div style={styles.imageContainer}>
          {/* Sale badge */}
          {onSale && (
            <span style={styles.saleBadge}>SALE</span>
          )}

          {image ? (
            <img
              src={image}
              alt={name}
              style={{
                ...styles.image,
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
              loading="lazy"
            />
          ) : (
            <div style={styles.imagePlaceholder} />
          )}
        </div>

        {/* Info */}
        <div style={styles.info}>
          {category && (
            <span style={styles.category}>{category.toUpperCase()}</span>
          )}

          <p style={styles.name}>{name}</p>

          {onSale && regularPrice ? (
            <div style={styles.priceRow}>
              <span style={styles.priceOriginal}>{fmt(regularPrice)}</span>
              <span style={styles.priceSale}>{fmt(salePrice)}</span>
            </div>
          ) : (
            <p style={styles.price}>{fmt(price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "1/1",
    backgroundColor: "#f5f3ef",
    overflow: "hidden",
    marginBottom: "10px",
    borderRadius: "8px",
  },
  saleBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 2,
    background: "#111",
    color: "#fff",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    padding: "3px 8px",
    borderRadius: "2px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ece9e3",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    padding: "0 2px",
  },
  category: {
    fontSize: "10px",
    color: "#aaa",
    letterSpacing: "0.1em",
    fontWeight: 500,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    marginBottom: "1px",
  },
  name: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#111",
    margin: 0,
    lineHeight: "1.45",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: "0.03em",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "7px",
    marginTop: "4px",
  },
  priceOriginal: {
    fontSize: "11px",
    color: "#bbb",
    textDecoration: "line-through",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  priceSale: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#111",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  price: {
    fontSize: "13px",
    fontWeight: 400,
    color: "#111",
    margin: 0,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    marginTop: "4px",
  },
};