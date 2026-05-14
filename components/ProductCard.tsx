// // type Props = {
// //   name: string;
// //   price: string;
// //   image: string;
// //   category?: string;
// // };

// // export default function ProductCard({ name, price, image, category = "Gardening"}: Props) {
// //   return (
// //     <div style={styles.card} className="product-card">
// //       {/* Label Best Seller / Tag */}
// //       <div style={styles.badge}>Best Seller</div>

// //       {/* Container Gambar */}
// //       <div style={styles.imageContainer}>
// //         <img src={image} alt={name} style={styles.image} />
// //       </div>

// //       {/* Info Produk */}
// //       <div style={styles.info}>
// //         <span style={styles.category}>{category}</span>
// //         {/* <h3 style={styles.name}>{name}</h3>
// //          */}
// //         <div style={styles.nameContainer}>
// //           <h3 style={styles.name}>{name}</h3>
// //         </div>
        
// //         {/* Rating Bintang (Menambah kesan "berisi") */}
// //         <div style={styles.rating}>
// //           <span style={{ color: "#FFD700" }}>★★★★★</span>
// //           <span style={styles.reviewCount}>(24)</span>
// //         </div>

// //         <div style={styles.priceRow}>
// //           <span style={styles.price}>{price}</span>
// //           {/* Tombol Add to Cart Kecil */}
// //           <button style={styles.addButton}>+</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // const styles = {
// //   card: {
// //     width: "220px",
// //     height: "100%",
// //     backgroundColor: "#fff",
// //     borderRadius: "12px",
// //     overflow: "hidden" as const,
// //     border: "1px solid #f0f0f0",
// //     transition: "all 0.3s ease",
// //     position: "relative" as const,
// //     cursor: "pointer",
// //   },
// //   badge: {
// //     position: "absolute" as const,
// //     top: "10px",
// //     left: "10px",
// //     backgroundColor: "#6bc1c6",
// //     color: "white",
// //     fontSize: "10px",
// //     fontWeight: "bold",
// //     padding: "4px 8px",
// //     borderRadius: "4px",
// //     zIndex: 2,
// //   },
// //   imageContainer: {
// //     backgroundColor: "#f6f6f6", // Warna abu-abu yang lebih soft
// //     padding: "20px",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     height: "200px",
// //   },
// //   image: {
// //     maxWidth: "100%",
// //     maxHeight: "100%",
// //     objectFit: "contain" as const,
// //   },
// //   info: {
// //     padding: "15px",
// //     display: "flex",
// //     flexDirection: "column" as const,
// //     gap: "4px",
// //     flexGrow: 1,
// //   },
// //   category: {
// //     fontSize: "11px",
// //     color: "#6bc1c6",
// //     fontWeight: "600",
// //     textTransform: "uppercase" as const,
// //     letterSpacing: "0.5px",
// //   },
// //   nameContainer: {
// //     /* FIX: Tinggi tetap untuk 2 baris teks (kira-kira 40px - 45px) */
// //     minHeight: "45px", 
// //     maxHeight: "45px",
// //     overflow: "hidden",
// //     display: "flex",
// //     alignItems: "flex-start",
// //     marginBottom: "4px",
// //   },
// //   name: {
// //     fontSize: "15px",
// //     fontWeight: "600",
// //     color: "#333",
// //     margin: "0",
// //   },
// //   rating: {
// //     display: "flex",
// //     alignItems: "center",
// //     gap: "5px",
// //     fontSize: "12px",
// //   },
// //   reviewCount: {
// //     color: "#999",
// //   },
// //   priceRow: {
// //     display: "flex",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginTop: "10px",
// //   },
// //   price: {
// //     fontSize: "18px",
// //     fontWeight: "bold",
// //     color: "#000",
// //   },
// //   addButton: {
// //     backgroundColor: "#000",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "50%",
// //     width: "30px",
// //     height: "30px",
// //     fontSize: "20px",
// //     cursor: "pointer",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// // };

// "use client";

// import React from "react";

// interface ProductProps {
//   name: string;
//   price: string;
//   image: string;
//   category?: string;
// }

// export default function ProductCard({ name, price, image, category }: ProductProps) {
//   return (
//     <div style={styles.card}>
//       <div style={styles.badge}>Best Seller</div>

//       <div style={styles.imageContainer}>
//         <div style={styles.badge}>Best Seller</div>
//         <img src={image} alt={name} style={styles.image} />
//       </div>

//       <div style={styles.info}>
//         <span style={styles.category}>{category}</span>
        
//         {/* FIX: Container Nama dengan tinggi tetap */}
//         <div style={styles.nameContainer}>
//           <h3 style={styles.name}>{name}</h3>
//         </div>

//         {/* <div style={{ flexGrow: 1 }}></div> */}
        
//         <div style={styles.rating}>
//           <span style={{ color: "#FFD700" }}>★★★★★</span>
//           <span style={styles.reviewCount}>(24)</span>
//         </div>

//         {/* FIX: Harga sekarang terkunci di bawah */}
//         <div style={styles.priceRow}>
//           <span style={styles.price}>{price}</span>
//           <button style={styles.addButton}>+</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   card: {
//     width: "220px",
//     height: "100%", // Memastikan card dalam grid memiliki tinggi yang sama
//     backgroundColor: "#fff",
//     borderRadius: "12px",
//     overflow: "hidden" as const,
//     border: "1px solid #f0f0f0",
//     display: "flex",
//     flexDirection: "column" as const,
//     position: "relative" as const,
//   },
//   imageContainer: {
//     position: "relative",
//     width: "100%",
//     height: "200px",
//     backgroundColor: "#f6f6f6",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "15px",
//     boxSizing: "border-box",
//   },
//   image: {
//     maxWidth: "100%",
//     maxHeight: "100%",
//     objectFit: "contain" as const,
//   },
//   info: {
//     padding: "15px",
//     display: "flex",
//     flexDirection: "column" as const,
//     flexGrow: 1, // Memaksa area info mengisi sisa ruang card
//   },
//   nameContainer: {
//     /* FIX: Tinggi tetap untuk 2 baris teks (kira-kira 40px - 45px) */
//     minHeight: "45px", 
//     maxHeight: "45px",
//     overflow: "hidden",
//     display: "flex",
//     alignItems: "flex-start",
//     // marginBottom: "4px",
//   },
//   name: {
//     fontSize: "14px",
//     fontWeight: "700",
//     color: "#333",
//     margin: "0",
//     lineHeight: "1.2",
//     display: "-webkit-box",
//     WebkitLineClamp: 2, // Membatasi maksimal 2 baris
//     WebkitBoxOrient: "vertical" as const,
//   },
//   priceRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "auto", // KUNCI: Mendorong baris harga ke paling bawah area info
//     paddingTop: "10px",
//   },
//   // Style lainnya tetap sama...
//   badge: { position: "absolute" as const, top: "10px", left: "10px", backgroundColor: "#6bc1c6", color: "white", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "4px", zIndex: 2 },
//   category: { fontSize: "10px", color: "#6bc1c6", fontWeight: "bold", marginBottom: "4px" },
//   rating: { display: "flex", alignItems: "center", gap: "5px", fontSize: "11px" },
//   reviewCount: { color: "#999" },
//   price: { fontSize: "18px", fontWeight: "800", color: "#000" },
//   addButton: { backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "50%", width: "30px", height: "30px", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
// };
"use client";

import React from "react";
import Link from "next/link";

interface ProductProps {
  name: string;
  slug: string;
  price: string;
  image: string;
  category?: string;
}

export default function ProductCard({ name, slug, price, image, category }: ProductProps) {
  return (
    <Link
      href={`/products/${slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <div style={styles.badge}>Best Seller</div>
        <img src={image} alt={name} style={styles.image} />
      </div>

      <div style={styles.info}>
        <span style={styles.category}>{category}</span>

        {/* Nama: max 2 baris, tinggi mengikuti konten — tidak ada minHeight */}
        <h3 style={styles.name}>{name}</h3>

        <div style={styles.rating}>
          <span style={{ color: "#FFD700" }}>★★★★★</span>
          <span style={styles.reviewCount}>(24)</span>
        </div>

        <div style={styles.priceRow}>
          <span style={styles.price}>{price}</span>
          <button style={styles.addButton}>+</button>
        </div>
      </div>
    </div>
    </Link>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "220px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "200px",
    backgroundColor: "#f6f6f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    boxSizing: "border-box",
  },
  badge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    backgroundColor: "#6bc1c6",
    color: "white",
    fontSize: "10px",
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: "4px",
    zIndex: 2,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },
  info: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: "6px", // jarak konsisten antar elemen
  },
  category: {
    fontSize: "10px",
    color: "#6bc1c6",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  name: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#333",
    margin: "0",
    lineHeight: "1.35",
    // Batasi 2 baris — tinggi mengikuti konten secara natural
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
  },
  reviewCount: {
    color: "#999",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto", // dorong harga ke bawah
    paddingTop: "6px",
  },
  price: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};