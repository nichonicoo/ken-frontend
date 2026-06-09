// "use client";

// import React, { useState, useRef } from "react";
// import { Cormorant_Garamond } from "next/font/google";
// import { addToCart } from "@/app/api/graphql/Transaction";

// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
// });

// interface RelatedProduct {
//   id: string;
//   name: string;
//   slug: string;
//   price?: string;
//   regularPrice?: string;
//   salePrice?: string;
//   onSale?: boolean;
//   image?: { sourceUrl: string } | null;
// }

// interface ProductDetail {
//   databaseId: number;
//   id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   shortDescription?: string;
//   onSale?: boolean;
//   purchasable?: boolean;
//   price?: string;
//   regularPrice?: string;
//   salePrice?: string;
//   averageRating: string;
//   image?: { sourceUrl: string } | null;
//   galleryImages?: { nodes: { sourceUrl: string }[] };
//   productCategories?: { nodes: { name: string; slug: string }[] };
//   upsell?: { nodes: RelatedProduct[] };
//   reviewCount: number;
//   crossSell?: { nodes: RelatedProduct[] };
//   productCustomFields?: {
//     shopeeLink: string;
//     tiktokLink: string;
//   };
// }

// // helpers
// const fmt = (val?: string) => {
//   if (!val) return "";
//   const num = parseFloat(val.replace(/[^0-9.]/g, ""));
//   if (isNaN(num)) return val;
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//     minimumFractionDigits: 0,
//   }).format(num);
// };

// // accordian
// function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div style={{ borderBottom: "0.5px solid #ebebeb" }}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         style={{
//           width: "100%", display: "flex", justifyContent: "space-between",
//           alignItems: "center", padding: "15px 0",
//           background: "none", border: "none", cursor: "pointer",
//         }}
//       >
//         <span style={{
//           fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
//           textTransform: "uppercase", color: "#111",
//           fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//         }}>
//           {label}
//         </span>
//         <svg
//           width="13" height="13" viewBox="0 0 24 24" fill="none"
//           stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//           style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.22s ease", flexShrink: 0 }}
//         >
//           <polyline points="9 18 15 12 9 6" />
//         </svg>
//       </button>
//       {open && (
//         <div style={{ paddingBottom: 18 }}>
//           {children}
//         </div>
//       )}
//     </div>
//   );
// }

// // related card
// function RelatedCard({ p }: { p: RelatedProduct }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <a href={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
//       <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
//         <div style={{
//           position: "relative", background: "#f5f3ef",
//           borderRadius: 12, aspectRatio: "1/1",
//           overflow: "hidden", marginBottom: 10,
//         }}>
//           {p.onSale && (
//             <span style={{
//               position: "absolute", top: 10, left: 10, zIndex: 2,
//               background: "#111", color: "#fff", fontSize: 9,
//               fontWeight: 700, letterSpacing: "0.12em",
//               padding: "3px 8px", borderRadius: 2,
//               fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//             }}>SALE</span>
//           )}
//           {p.image?.sourceUrl ? (
//             <img
//               src={p.image.sourceUrl} alt={p.name}
//               style={{
//                 width: "100%", height: "100%", objectFit: "cover", display: "block",
//                 transform: hovered ? "scale(1.04)" : "scale(1)",
//                 transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//               }}
//               loading="lazy"
//             />
//           ) : (
//             <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <span style={{ fontSize: 11, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>No Image</span>
//             </div>
//           )}
//         </div>
//         <p style={{
//           fontSize: 11, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.5,
//           fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//           letterSpacing: "0.06em", textTransform: "uppercase",
//           display: "-webkit-box", WebkitLineClamp: 2,
//           WebkitBoxOrient: "vertical", overflow: "hidden", margin: "0 0 4px",
//         }}>{p.name}</p>
//         <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
//           {p.onSale && p.regularPrice ? (
//             <>
//               <span style={{ fontSize: 11, color: "#bbb", textDecoration: "line-through", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{fmt(p.regularPrice)}</span>
//               <span style={{ fontSize: 12, fontWeight: 500, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{fmt(p.salePrice)}</span>
//             </>
//           ) : (
//             <span style={{ fontSize: 12, fontWeight: 400, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{fmt(p.price)}</span>
//           )}
//         </div>
//       </div>
//     </a>
//   );
// }

// // related carousel
// const GAP = 16;
// const STEP = 4;

// function RelatedCarousel({ title, products }: { title: string; products: RelatedProduct[] }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [arrowHover, setArrowHover] = useState<"left" | "right" | null>(null);
//   const trackRef = useRef<HTMLDivElement>(null);

//   const getCardPxWidth = (): number => {
//     const track = trackRef.current;
//     if (!track) return 0;
//     return (track.offsetWidth - GAP * 3) / 4;
//   };

//   const maxIndex = Math.max(0, products.length - STEP);
//   const goNext = () => setCurrentIndex((p) => Math.min(p + STEP, maxIndex));
//   const goPrev = () => setCurrentIndex((p) => Math.max(p - STEP, 0));
//   const translateX = -((getCardPxWidth() + GAP) * currentIndex);

//   if (products.length === 0) return null;

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28 }}>
//         <h2
//           className={cormorant.className}
//           style={{ fontSize: 30, fontWeight: 400, color: "#111", margin: 0, letterSpacing: "0.01em", lineHeight: 1 }}
//         >
//           {title}
//         </h2>
//         <span style={{
//           fontSize: 10, fontWeight: 500, color: "#aaa",
//           letterSpacing: "0.12em", textTransform: "uppercase",
//           fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//         }}>
//           {products.length} items
//         </span>
//       </div>

//       <div
//         style={{ position: "relative" }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <div style={{ overflow: "hidden" }}>
//           <div
//             ref={trackRef}
//             style={{
//               display: "grid",
//               gridTemplateColumns: `repeat(${products.length}, calc((100% - ${GAP * 3}px) / 4))`,
//               gap: GAP,
//               transform: `translateX(${translateX}px)`,
//               transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//               willChange: "transform",
//             }}
//           >
//             {products.map((p) => <RelatedCard key={p.id} p={p} />)}
//           </div>
//         </div>

//         {(["left", "right"] as const).map((dir) => {
//           const isLeft = dir === "left";
//           const disabled = isLeft ? currentIndex === 0 : currentIndex >= maxIndex;
//           const visible = isHovered && !disabled;
//           return (
//             <button
//               key={dir}
//               onClick={isLeft ? goPrev : goNext}
//               disabled={disabled}
//               aria-label={isLeft ? "Previous" : "Next"}
//               onMouseEnter={() => setArrowHover(dir)}
//               onMouseLeave={() => setArrowHover(null)}
//               style={{
//                 position: "absolute", top: "38%",
//                 [isLeft ? "left" : "right"]: -18,
//                 transform: "translateY(-50%)",
//                 zIndex: 10, width: 36, height: 36, borderRadius: "50%",
//                 background: arrowHover === dir ? "#111" : "#fff",
//                 color: arrowHover === dir ? "#fff" : "#111",
//                 border: "1px solid #e0e0e0",
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                 cursor: disabled ? "not-allowed" : "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 opacity: visible ? 1 : 0,
//                 pointerEvents: visible ? "auto" : "none",
//                 transition: "opacity 0.2s ease, background 0.18s ease, color 0.18s ease",
//               }}
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                 {isLeft ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
//               </svg>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // icon
// function TikTokIcon() {
//   return <img src="/tiktok_logo.svg" alt="TikTok" width={16} height={16} style={{ objectFit: "contain" }} />;
// }
// function ShopeeIcon() {
//   return <img src="/shopee_logo.svg" alt="Shopee" width={16} height={16} style={{ objectFit: "contain" }} />;
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function ProductDetails({ product }: { product: ProductDetail }) {
//   const allImages = [
//     product.image?.sourceUrl,
//     ...(product.galleryImages?.nodes?.map((img) => img.sourceUrl) || []),
//   ].filter(Boolean) as string[];

//   const [activeImg, setActiveImg] = useState(0);
//   const [qty, setQty] = useState(1);
//   const [tiktokHovered, setTiktokHovered] = useState(false);
//   const [shopeeHovered, setShopeeHovered] = useState(false);
//   const [addBtnHovered, setAddBtnHovered] = useState(false);
//   // const [buyBtnHovered, setBuyBtnHovered] = useState(false);

//   const category = product.productCategories?.nodes?.[0];
//   const displayPrice = product.onSale ? product.salePrice || product.price : product.price;
//   const displayRegular = product.onSale ? product.regularPrice : undefined;
//   const upsellProducts = product.upsell?.nodes || [];
//   const crossSellProducts = product.crossSell?.nodes || [];
//   const hasRelated = upsellProducts.length > 0 || crossSellProducts.length > 0;
//   const rating = parseFloat(product.averageRating || "0");
//   const ratingRounded = Math.round(rating);

//   return (
//     <div style={styles.page}>

//       {/* Breadcrumb */}
//       <nav style={styles.breadcrumb}>
//         <a href="/" style={styles.breadLink}>Home</a>
//         <span style={styles.breadSep}>›</span>
//         {category && (
//           <>
//             <a href={`/category/${category.slug}`} style={styles.breadLink}>{category.name}</a>
//             <span style={styles.breadSep}>›</span>
//           </>
//         )}
//         <span style={styles.breadCurrent}>{product.name}</span>
//       </nav>

//       {/* Main layout */}
//       <div style={styles.layout}>

//         {/* Gallery */}
//         <div style={styles.gallerySection}>
//           <div style={styles.thumbCol}>
//             {allImages.map((src, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveImg(i)}
//                 style={{ ...styles.thumb, ...(i === activeImg ? styles.thumbActive : {}) }}
//               >
//                 <img src={src} alt={`view ${i + 1}`} style={styles.thumbImg} />
//               </button>
//             ))}
//           </div>
//           <div style={styles.mainImgWrap}>
//             {product.onSale && <div style={styles.saleBadge}>SALE</div>}
//             <img src={allImages[activeImg]} alt={product.name} style={styles.mainImg} />
//           </div>
//         </div>

//         {/* Info col */}
//         <div style={styles.infoCol}>

//           <p style={styles.categoryLabel}>{category?.name?.toUpperCase()}</p>

//           <h1 className={cormorant.className} style={styles.productName}>
//             {product.name}
//           </h1>

//           <div style={styles.priceRow}>
//             <span style={styles.price}>{fmt(displayPrice)}</span>
//             {product.onSale && displayRegular && (
//               <span style={styles.strikePrice}>{fmt(displayRegular)}</span>
//             )}
//           </div>

//           <div style={styles.ratingRow}>
//             <span style={styles.stars}>
//               {"★".repeat(ratingRounded)}{"☆".repeat(5 - ratingRounded)}
//             </span>
//             <span style={styles.ratingNum}>{rating.toFixed(1)}</span>
//             <span style={styles.ratingCountBtn}>
//               ({product.reviewCount} ulasan)
//             </span>
//           </div>

//           <div style={styles.divider} />

//           {/* Trust badges */}
//           <div style={styles.trustRow}>
//             {[
//               // { icon: "🚚", text: "Gratis ongkir seluruh Indonesia" },
//               { icon: "🛡️", text: "Garansi 7 hari retur" },
//               { icon: "✓",  text: "100% produk original" },
//             ].map(({ icon, text }) => (
//               <div key={text} style={styles.trustItem}>
//                 <span style={styles.trustIcon}>{icon}</span>
//                 <span style={styles.trustTxt}>{text}</span>
//               </div>
//             ))}
//           </div>

//           <div style={styles.divider} />

//           {/* Qty + Add to cart */}
//           <div style={styles.cartRow}>
//             <div style={styles.qtyWrap}>
//               <button style={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
//               <span style={styles.qtyNum}>{qty}</span>
//               <button style={styles.qtyBtn} onClick={() => setQty((q) => q + 1)}>+</button>
//             </div>
//             <button
//               style={{ ...styles.addBtn, ...(addBtnHovered ? styles.addBtnHover : {}) }}
//               onMouseEnter={() => setAddBtnHovered(true)}
//               onMouseLeave={() => setAddBtnHovered(false)}
//               onClick={
//               async () => {
//                   try{
//                       await addToCart(product.databaseId, qty)
//                       alert("added to cart")
//                   } catch(e){
//                       console.error
//                   }
//               }
//             }
//             >
//               TAMBAH KE KERANJANG
//             </button>
//           </div>

//           {/* marketplace */}
//           <p style={styles.marketplaceLabel}>Atau beli di marketplace:</p>
//           <div style={styles.marketplaceRow}>
//             <a
//               href={product.productCustomFields?.tiktokLink}
//               target="_blank" rel="noopener noreferrer"
//               style={{ ...styles.marketplaceBtn, ...(tiktokHovered ? styles.mpTiktokHover : {}) }}
//               onMouseEnter={() => setTiktokHovered(true)}
//               onMouseLeave={() => setTiktokHovered(false)}
//             >
//               <TikTokIcon /> TikTok Shop
//             </a>
//             <a
//               href={product.productCustomFields?.shopeeLink}
//               target="_blank" rel="noopener noreferrer"
//               style={{ ...styles.marketplaceBtn, ...(shopeeHovered ? styles.mpShopeeHover : {}) }}
//               onMouseEnter={() => setShopeeHovered(true)}
//               onMouseLeave={() => setShopeeHovered(false)}
//             >
//               <ShopeeIcon /> Shopee
//             </a>
//           </div>

//           <div style={{ ...styles.divider, marginTop: 20 }} />

//           {/* Accordions */}
//           <Accordion label="Detail Produk">
//             <div
//               style={{ fontSize: 13, color: "#666", lineHeight: 1.85, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
//               dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || "<p>Tidak ada deskripsi produk.</p>" }}
//             />
//           </Accordion>

//           <Accordion label="Pengiriman & Pengembalian">
//             <div style={{ fontSize: 13, color: "#666", lineHeight: 1.85, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", display: "flex", flexDirection: "column", gap: 16 }}>
//               <div>
//                 <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", marginBottom: 8, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Pengiriman</p>
//                 <p>Gratis ongkir ke seluruh Indonesia. Estimasi tiba 2–5 hari kerja setelah pesanan dikonfirmasi.</p>
//               </div>
//               <div>
//                 <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", marginBottom: 8, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Pengembalian</p>
//                 <p>Pengembalian barang dapat dilakukan dalam 7 hari setelah produk diterima, dengan kondisi produk masih dalam keadaan semula.</p>
//               </div>
//             </div>
//           </Accordion>

//           <Accordion label={`Ulasan (${product.reviewCount})`}>
//             <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
//               <span className={cormorant.className} style={{ fontSize: 40, fontWeight: 400, color: "#111", lineHeight: 1 }}>
//                 {rating.toFixed(1)}
//               </span>
//               <div>
//                 <div style={{ color: "#d4a017", fontSize: 13, letterSpacing: "2px" }}>
//                   {"★".repeat(ratingRounded)}{"☆".repeat(5 - ratingRounded)}
//                 </div>
//                 <p style={{ fontSize: 11, color: "#aaa", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginTop: 3 }}>
//                   dari {product.reviewCount} ulasan
//                 </p>
//               </div>
//             </div>
//             <p style={{ fontSize: 13, color: "#aaa", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
//               Belum ada ulasan yang ditampilkan.
//             </p>
//           </Accordion>
//         </div>
//       </div>

//       {/* related */}
//       {hasRelated && (
//         <div style={{ marginTop: 80, borderTop: "1px solid #ebebeb", paddingTop: 64 }}>
//           {upsellProducts.length > 0 && (
//             <RelatedCarousel title="Produk Terkait" products={upsellProducts} />
//           )}
//           {crossSellProducts.length > 0 && (
//             <RelatedCarousel title="Sering Dibeli Bersama" products={crossSellProducts} />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // style
// const styles: { [key: string]: React.CSSProperties } = {
//   page: {
//     maxWidth: "1300px", margin: "0 auto",
//     padding: "0px 32px 35px",
//     fontFamily: "'Helvetica Neue', Arial, sans-serif",
//     backgroundColor: "#fff",
//   },
//   breadcrumb: {
//     display: "flex", alignItems: "center", gap: "6px",
//     marginBottom: "32px", fontSize: "11px",
//     textTransform: "uppercase", letterSpacing: "0.1em",
//   },
//   breadLink: { color: "#999", textDecoration: "none" },
//   breadSep: { color: "#ccc", fontSize: "13px" },
//   breadCurrent: { color: "#111", fontWeight: 600 },
//   layout: { display: "flex", gap: "64px", alignItems: "flex-start" },
//   gallerySection: {
//     flex: 1, display: "flex", gap: "12px",
//     position: "sticky", top: "32px",
//   },
//   thumbCol: { display: "flex", flexDirection: "column", gap: "8px", width: "72px", flexShrink: 0 },
//   thumb: {
//     width: "72px", height: "72px", border: "1px solid #e0e0e0",
//     padding: "4px", cursor: "pointer", background: "transparent",
//     borderRadius: "4px", boxSizing: "border-box",
//     transition: "border-color 0.15s ease",
//   },
//   thumbActive: { border: "1.5px solid #111" },
//   thumbImg: { width: "100%", height: "100%", objectFit: "contain" },
//   mainImgWrap: {
//     flex: 1, position: "relative", background: "transparent",
//     border: "1px solid #111",
//     aspectRatio: "1/1", display: "flex", alignItems: "center",
//     justifyContent: "center", overflow: "hidden", borderRadius: "4px",
//     maxWidth: "700px"
//   },
//   mainImg: { width: "65%", height: "65%", objectFit: "contain" },
//   saleBadge: {
//     position: "absolute", top: "16px", left: "16px",
//     background: "#111", color: "white", fontSize: "9px",
//     fontWeight: 700, padding: "3px 10px", letterSpacing: "0.12em",
//     zIndex: 2, borderRadius: "2px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   infoCol: { width: "400px", flexShrink: 0, display: "flex", flexDirection: "column" },
//   categoryLabel: {
//     fontSize: "10px", fontWeight: 600, color: "#aaa",
//     letterSpacing: "0.16em", margin: "0 0 8px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     textTransform: "uppercase",
//   },
//   productName: {
//     fontSize: "34px", fontWeight: 400, color: "#111",
//     margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "0.01em",
//   },
//   priceRow: { display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" },
//   price: {
//     fontSize: "22px", fontWeight: 500, color: "#111",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   strikePrice: {
//     fontSize: "14px", color: "#bbb", textDecoration: "line-through",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   ratingRow: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" },
//   stars: { color: "#d4a017", fontSize: "13px", letterSpacing: "1px" },
//   ratingNum: {
//     fontSize: "12px", fontWeight: 600, color: "#111",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   ratingCountBtn: {
//     fontSize: "12px", color: "#6bc1c6",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     background: "none", border: "none", cursor: "pointer",
//     padding: 0, textDecoration: "underline",
//   },
//   divider: { border: "none", borderTop: "0.5px solid #ebebeb", margin: "16px 0" },
//   trustRow: { display: "flex", gap: "8px" },
//   trustItem: {
//     flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
//     gap: "5px", padding: "12px 8px",
//     background: "#fafafa", borderRadius: "6px",
//     border: "0.5px solid #f0f0f0",
//   },
//   trustIcon: { fontSize: "16px" },
//   trustTxt: {
//     fontSize: "10px", color: "#888", textAlign: "center",
//     lineHeight: 1.4, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   cartRow: { display: "flex", gap: "8px", marginBottom: "8px" },
//   qtyWrap: {
//     display: "flex", alignItems: "center",
//     border: "0.5px solid #e0e0e0", borderRadius: "4px",
//     overflow: "hidden", height: "50px",
//   },
//   qtyBtn: {
//     width: "36px", height: "100%", border: "none",
//     background: "white", fontSize: "18px", cursor: "pointer", color: "#333",
//   },
//   qtyNum: {
//     width: "32px", textAlign: "center", fontWeight: 600,
//     fontSize: "14px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   addBtn: {
//     flex: 1, height: "50px", background: "#111", color: "white",
//     border: "none", fontWeight: 600, fontSize: "10px",
//     letterSpacing: "0.12em", cursor: "pointer", borderRadius: "4px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     transition: "background 0.2s ease",
//   },
//   addBtnHover: { background: "#333" },
//   buyNowBtn: {
//     width: "100%", height: "50px", background: "transparent",
//     color: "#111", border: "0.5px solid #111",
//     fontWeight: 600, fontSize: "10px", letterSpacing: "0.12em",
//     cursor: "pointer", marginBottom: "16px", borderRadius: "4px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     transition: "background 0.2s ease, color 0.2s ease",
//   },
//   buyNowBtnHover: { background: "#111", color: "#fff" },
//   marketplaceLabel: {
//     fontSize: "10px", color: "#aaa", letterSpacing: "0.08em", marginBottom: "8px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", textTransform: "uppercase",
//   },
//   marketplaceRow: { display: "flex", gap: "8px", marginBottom: "4px" },
//   marketplaceBtn: {
//     flex: 1, height: "40px", display: "flex", alignItems: "center",
//     justifyContent: "center", gap: "7px",
//     border: "0.5px solid #e0e0e0", background: "#fff",
//     color: "#555", fontWeight: 500, fontSize: "11px", letterSpacing: "0.06em",
//     borderRadius: "4px", textDecoration: "none",
//     transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
//     cursor: "pointer", whiteSpace: "nowrap",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   mpTiktokHover: { background: "#111", color: "#fff", borderColor: "#111" },
//   mpShopeeHover: { background: "#ee4d2d", color: "#fff", borderColor: "#ee4d2d" },
//   drawerTrigger: {
//     width: "100%", display: "flex", justifyContent: "space-between",
//     alignItems: "center", padding: "15px 0",
//     borderBottom: "0.5px solid #ebebeb",
//     background: "transparent", border: "none",
//     borderBottomWidth: "0.5px", borderBottomStyle: "solid", borderBottomColor: "#ebebeb",
//     cursor: "pointer",
//   }
// };

"use client";

import React, { useState, useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { addToCart } from "@/app/api/graphql/Transaction";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
  stockStatus?: string;
  image?: { sourceUrl: string } | null;
}

interface ProductDetail {
  databaseId: number;
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  onSale?: boolean;
  purchasable?: boolean;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  stockQuantity?: number;
  averageRating: string;
  image?: { sourceUrl: string } | null;
  galleryImages?: { nodes: { sourceUrl: string }[] };
  productCategories?: { nodes: { name: string; slug: string }[] };
  upsell?: { nodes: RelatedProduct[] };
  reviewCount: number;
  crossSell?: { nodes: RelatedProduct[] };
  productCustomFields?: { shopeeLink: string; tiktokLink: string };
}

const fmt = (val?: string) => {
  if (!val) return "";
  const num = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return val;
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
};

function Accordion({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "0.5px solid #ebebeb" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{label}</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.22s ease", flexShrink: 0 }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      {open && <div style={{ paddingBottom: 18 }}>{children}</div>}
    </div>
  );
}

function RelatedCard({ p }: { p: RelatedProduct }) {
  const [hovered, setHovered] = useState(false);
  const isOutOfStock = p.stockStatus === "OUT_OF_STOCK";
  return (
    <a href={`/products/${p.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div style={{ position: "relative", background: "#f5f3ef", borderRadius: 12, aspectRatio: "1/1", overflow: "hidden", marginBottom: 10 }}>
          {p.onSale && !isOutOfStock && (
            <span style={{ position: "absolute", top: 10, left: 10, zIndex: 2, background: "#111", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", padding: "3px 8px", borderRadius: 2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>SALE</span>
          )}
          {isOutOfStock && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#fff", background: "#888", padding: "3px 8px", borderRadius: 2, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>SOLD OUT</span>
            </div>
          )}
          {p.image?.sourceUrl ? (
            <img src={p.image.sourceUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hovered && !isOutOfStock ? "scale(1.04)" : "scale(1)", transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)", opacity: isOutOfStock ? 0.45 : 1 }} loading="lazy" />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "#bbb" }}>No Image</span>
            </div>
          )}
        </div>
        <p style={{ fontSize: 11, fontWeight: 600, color: isOutOfStock ? "#bbb" : "#1a1a1a", lineHeight: 1.5, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: "0 0 4px" }}>{p.name}</p>
        {isOutOfStock ? (
          <p style={{ fontSize: 11, color: "#bbb", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Stok habis</p>
        ) : (
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            {p.onSale && p.regularPrice ? (
              <>
                <span style={{ fontSize: 11, color: "#bbb", textDecoration: "line-through", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{fmt(p.regularPrice)}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{fmt(p.salePrice)}</span>
              </>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 400, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{fmt(p.price)}</span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

const GAP = 16;
const STEP = 4;

function RelatedCarousel({ title, products }: { title: string; products: RelatedProduct[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [arrowHover, setArrowHover] = useState<"left" | "right" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const getCardPxWidth = (): number => {
    const track = trackRef.current;
    if (!track) return 0;
    return (track.offsetWidth - GAP * 3) / 4;
  };

  const maxIndex = Math.max(0, products.length - STEP);
  const goNext = () => setCurrentIndex((p) => Math.min(p + STEP, maxIndex));
  const goPrev = () => setCurrentIndex((p) => Math.max(p - STEP, 0));
  const translateX = -((getCardPxWidth() + GAP) * currentIndex);

  if (products.length === 0) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 28 }}>
        <h2 className={cormorant.className} style={{ fontSize: 30, fontWeight: 400, color: "#111", margin: 0, letterSpacing: "0.01em", lineHeight: 1 }}>{title}</h2>
        <span style={{ fontSize: 10, fontWeight: 500, color: "#aaa", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{products.length} items</span>
      </div>
      <div style={{ position: "relative" }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div style={{ overflow: "hidden" }}>
          <div ref={trackRef} style={{ display: "grid", gridTemplateColumns: `repeat(${products.length}, calc((100% - ${GAP * 3}px) / 4))`, gap: GAP, transform: `translateX(${translateX}px)`, transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)", willChange: "transform" }}>
            {products.map((p) => <RelatedCard key={p.id} p={p} />)}
          </div>
        </div>
        {(["left", "right"] as const).map((dir) => {
          const isLeft = dir === "left";
          const disabled = isLeft ? currentIndex === 0 : currentIndex >= maxIndex;
          const visible = isHovered && !disabled;
          return (
            <button key={dir} onClick={isLeft ? goPrev : goNext} disabled={disabled} aria-label={isLeft ? "Previous" : "Next"} onMouseEnter={() => setArrowHover(dir)} onMouseLeave={() => setArrowHover(null)} style={{ position: "absolute", top: "38%", [isLeft ? "left" : "right"]: -18, transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: arrowHover === dir ? "#111" : "#fff", color: arrowHover === dir ? "#fff" : "#111", border: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none", transition: "opacity 0.2s ease, background 0.18s ease, color 0.18s ease" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {isLeft ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TikTokIcon() { return <img src="/tiktok_logo.svg" alt="TikTok" width={16} height={16} style={{ objectFit: "contain" }} />; }
function ShopeeIcon() { return <img src="/shopee_logo.svg" alt="Shopee" width={16} height={16} style={{ objectFit: "contain" }} />; }

export default function ProductDetails({ product }: { product: ProductDetail }) {
  const allImages = [product.image?.sourceUrl, ...(product.galleryImages?.nodes?.map((img) => img.sourceUrl) || [])].filter(Boolean) as string[];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tiktokHovered, setTiktokHovered] = useState(false);
  const [shopeeHovered, setShopeeHovered] = useState(false);
  const [addBtnHovered, setAddBtnHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const category = product.productCategories?.nodes?.[0];
  const displayPrice = product.onSale ? product.salePrice || product.price : product.price;
  const displayRegular = product.onSale ? product.regularPrice : undefined;
  const upsellProducts = product.upsell?.nodes || [];
  const crossSellProducts = product.crossSell?.nodes || [];
  const hasRelated = upsellProducts.length > 0 || crossSellProducts.length > 0;
  const rating = parseFloat(product.averageRating || "0");
  const ratingRounded = Math.round(rating);
  const isOutOfStock = product.stockStatus === "OUT_OF_STOCK" || product.stockQuantity === 0;

  const handleAddToCart = async () => {
    try {
      await addToCart(product.databaseId, qty);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (e) { console.error(e); }
  };

  return (
    <div style={styles.page}>

      <nav style={styles.breadcrumb}>
        <a href="/" style={styles.breadLink}>Home</a>
        <span style={styles.breadSep}>›</span>
        {category && (<><a href={`/category/${category.slug}`} style={styles.breadLink}>{category.name}</a><span style={styles.breadSep}>›</span></>)}
        <span style={styles.breadCurrent}>{product.name}</span>
      </nav>

      <div style={styles.layout}>
        <div style={styles.gallerySection}>
          <div style={styles.thumbCol}>
            {allImages.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{ ...styles.thumb, ...(i === activeImg ? styles.thumbActive : {}) }}>
                <img src={src} alt={`view ${i + 1}`} style={styles.thumbImg} />
              </button>
            ))}
          </div>
          <div style={styles.mainImgWrap}>
            {product.onSale && !isOutOfStock && <div style={styles.saleBadge}>SALE</div>}
            {isOutOfStock && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: "#fff", background: "#888", padding: "6px 18px", borderRadius: "2px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>SOLD OUT</span>
              </div>
            )}
            <img src={allImages[activeImg]} alt={product.name} style={{ ...styles.mainImg, opacity: isOutOfStock ? 0.5 : 1 }} />
          </div>
        </div>

        <div style={styles.infoCol}>
          <p style={styles.categoryLabel}>{category?.name?.toUpperCase()}</p>
          <h1 className={cormorant.className} style={styles.productName}>{product.name}</h1>

          <div style={styles.priceRow}>
            <span style={styles.price}>{fmt(displayPrice)}</span>
            {product.onSale && displayRegular && <span style={styles.strikePrice}>{fmt(displayRegular)}</span>}
          </div>

          <div style={styles.ratingRow}>
            <span style={styles.stars}>{"★".repeat(ratingRounded)}{"☆".repeat(5 - ratingRounded)}</span>
            <span style={styles.ratingNum}>{rating.toFixed(1)}</span>
            <span style={styles.ratingCountBtn}>({product.reviewCount} ulasan)</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.trustRow}>
            {[{ icon: "🛡️", text: "Garansi 7 hari retur" }, { icon: "✓", text: "100% produk original" }].map(({ icon, text }) => (
              <div key={text} style={styles.trustItem}>
                <span style={styles.trustIcon}>{icon}</span>
                <span style={styles.trustTxt}>{text}</span>
              </div>
            ))}
          </div>

          <div style={styles.divider} />

          {/* Qty + CTA — conditional on stock */}
          {isOutOfStock ? (
            <div style={styles.soldOutWrap}>
              <span style={styles.soldOutBadge}>SOLD OUT</span>
              <p style={styles.soldOutText}>Produk ini sedang tidak tersedia. Silakan cek kembali nanti.</p>
            </div>
          ) : (
            <>
              <div style={styles.cartRow}>
                <div style={styles.qtyWrap}>
                  <button style={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span style={styles.qtyNum}>{qty}</span>
                  <button style={styles.qtyBtn} onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
                <button
                  style={{ ...styles.addBtn, ...(addBtnHovered ? styles.addBtnHover : {}), ...(addedToCart ? styles.addBtnDone : {}) }}
                  onMouseEnter={() => setAddBtnHovered(true)}
                  onMouseLeave={() => setAddBtnHovered(false)}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? "✓ DITAMBAHKAN" : "TAMBAH KE KERANJANG"}
                </button>
              </div>
            </>
          )}

          <p style={styles.marketplaceLabel}>Atau beli di marketplace:</p>
          <div style={styles.marketplaceRow}>
            <a href={product.productCustomFields?.tiktokLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.marketplaceBtn, ...(tiktokHovered ? styles.mpTiktokHover : {}) }} onMouseEnter={() => setTiktokHovered(true)} onMouseLeave={() => setTiktokHovered(false)}>
              <TikTokIcon /> TikTok Shop
            </a>
            <a href={product.productCustomFields?.shopeeLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.marketplaceBtn, ...(shopeeHovered ? styles.mpShopeeHover : {}) }} onMouseEnter={() => setShopeeHovered(true)} onMouseLeave={() => setShopeeHovered(false)}>
              <ShopeeIcon /> Shopee
            </a>
          </div>

          <div style={{ ...styles.divider, marginTop: 20 }} />

          <Accordion label="Detail Produk">
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.85, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }} dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || "<p>Tidak ada deskripsi produk.</p>" }} />
          </Accordion>

          <Accordion label="Pengiriman & Pengembalian">
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.85, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", marginBottom: 8, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Pengiriman</p>
                <p>Estimasi tiba 2–5 hari kerja setelah pesanan dikonfirmasi.</p>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", marginBottom: 8, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Pengembalian</p>
                <p>Pengembalian barang dapat dilakukan dalam 7 hari setelah produk diterima.</p>
              </div>
            </div>
          </Accordion>

          <Accordion label={`Ulasan (${product.reviewCount})`}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
              <span className={cormorant.className} style={{ fontSize: 40, fontWeight: 400, color: "#111", lineHeight: 1 }}>{rating.toFixed(1)}</span>
              <div>
                <div style={{ color: "#d4a017", fontSize: 13, letterSpacing: "2px" }}>{"★".repeat(ratingRounded)}{"☆".repeat(5 - ratingRounded)}</div>
                <p style={{ fontSize: 11, color: "#aaa", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", marginTop: 3 }}>dari {product.reviewCount} ulasan</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#aaa", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Belum ada ulasan yang ditampilkan.</p>
          </Accordion>
        </div>
      </div>

      {hasRelated && (
        <div style={{ marginTop: 80, borderTop: "1px solid #ebebeb", paddingTop: 64 }}>
          {upsellProducts.length > 0 && <RelatedCarousel title="Produk Terkait" products={upsellProducts} />}
          {crossSellProducts.length > 0 && <RelatedCarousel title="Sering Dibeli Bersama" products={crossSellProducts} />}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: { maxWidth: "1300px", margin: "0 auto", padding: "0px 32px 35px", fontFamily: "'Helvetica Neue', Arial, sans-serif", backgroundColor: "#fff" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "32px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" },
  breadLink: { color: "#999", textDecoration: "none" },
  breadSep: { color: "#ccc", fontSize: "13px" },
  breadCurrent: { color: "#111", fontWeight: 600 },
  layout: { display: "flex", gap: "64px", alignItems: "flex-start" },
  gallerySection: { flex: 1, display: "flex", gap: "12px", position: "sticky", top: "32px" },
  thumbCol: { display: "flex", flexDirection: "column", gap: "8px", width: "72px", flexShrink: 0 },
  thumb: { width: "72px", height: "72px", border: "1px solid #e0e0e0", padding: "4px", cursor: "pointer", background: "transparent", borderRadius: "4px", boxSizing: "border-box", transition: "border-color 0.15s ease" },
  thumbActive: { border: "1.5px solid #111" },
  thumbImg: { width: "100%", height: "100%", objectFit: "contain" },
  mainImgWrap: { flex: 1, position: "relative", background: "transparent", border: "1px solid #111", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: "4px", maxWidth: "700px" },
  mainImg: { width: "65%", height: "65%", objectFit: "contain", transition: "opacity 0.2s ease" },
  saleBadge: { position: "absolute", top: "16px", left: "16px", background: "#111", color: "white", fontSize: "9px", fontWeight: 700, padding: "3px 10px", letterSpacing: "0.12em", zIndex: 2, borderRadius: "2px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  infoCol: { width: "400px", flexShrink: 0, display: "flex", flexDirection: "column" },
  categoryLabel: { fontSize: "10px", fontWeight: 600, color: "#aaa", letterSpacing: "0.16em", margin: "0 0 8px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", textTransform: "uppercase" },
  productName: { fontSize: "34px", fontWeight: 400, color: "#111", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "0.01em" },
  priceRow: { display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" },
  price: { fontSize: "22px", fontWeight: 500, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  strikePrice: { fontSize: "14px", color: "#bbb", textDecoration: "line-through", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  ratingRow: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px" },
  stars: { color: "#d4a017", fontSize: "13px", letterSpacing: "1px" },
  ratingNum: { fontSize: "12px", fontWeight: 600, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  ratingCountBtn: { fontSize: "12px", color: "#6bc1c6", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" },
  divider: { border: "none", borderTop: "0.5px solid #ebebeb", margin: "16px 0" },
  trustRow: { display: "flex", gap: "8px" },
  trustItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "12px 8px", background: "#fafafa", borderRadius: "6px", border: "0.5px solid #f0f0f0" },
  trustIcon: { fontSize: "16px" },
  trustTxt: { fontSize: "10px", color: "#888", textAlign: "center", lineHeight: 1.4, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  soldOutWrap: { display: "flex", flexDirection: "column", gap: "8px", padding: "16px", background: "#fafafa", border: "0.5px solid #ebebeb", borderRadius: "4px", marginBottom: "12px" },
  soldOutBadge: { display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#fff", background: "#888", padding: "4px 12px", borderRadius: "2px", width: "fit-content", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  soldOutText: { fontSize: "12px", color: "#aaa", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  cartRow: { display: "flex", gap: "8px", marginBottom: "8px" },
  qtyWrap: { display: "flex", alignItems: "center", border: "0.5px solid #e0e0e0", borderRadius: "4px", overflow: "hidden", height: "50px" },
  qtyBtn: { width: "36px", height: "100%", border: "none", background: "white", fontSize: "18px", cursor: "pointer", color: "#333" },
  qtyNum: { width: "32px", textAlign: "center", fontWeight: 600, fontSize: "14px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  addBtn: { flex: 1, height: "50px", background: "#111", color: "white", border: "none", fontWeight: 600, fontSize: "10px", letterSpacing: "0.12em", cursor: "pointer", borderRadius: "4px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", transition: "background 0.2s ease" },
  addBtnHover: { background: "#333" },
  addBtnDone: { background: "#065f46" },
  buyNowBtn: { width: "100%", height: "50px", background: "transparent", color: "#111", border: "0.5px solid #111", fontWeight: 600, fontSize: "10px", letterSpacing: "0.12em", cursor: "pointer", marginBottom: "16px", borderRadius: "4px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", transition: "background 0.2s ease, color 0.2s ease" },
  buyNowBtnHover: { background: "#111", color: "#fff" },
  marketplaceLabel: { fontSize: "10px", color: "#aaa", letterSpacing: "0.08em", marginBottom: "8px", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", textTransform: "uppercase" },
  marketplaceRow: { display: "flex", gap: "8px", marginBottom: "4px" },
  marketplaceBtn: { flex: 1, height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", borderWidth: "0.5px", borderStyle: "solid", borderColor: "#e0e0e0", background: "#fff", color: "#555", fontWeight: 500, fontSize: "11px", letterSpacing: "0.06em", borderRadius: "4px", textDecoration: "none", transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  mpTiktokHover: { background: "#111", color: "#fff", borderColor: "#111" },
  mpShopeeHover: { background: "#ee4d2d", color: "#fff", borderColor: "#ee4d2d" },
};