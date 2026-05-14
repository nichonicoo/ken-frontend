"use client";

import React, { useState } from "react";
import { addToCart } from "@/app/api/graphql/Transaction"

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
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
  image?: { sourceUrl: string } | null;
  galleryImages?: { nodes: { sourceUrl: string }[] };
  productCategories?: { nodes: { name: string; slug: string }[] };
  upsell?: { nodes: RelatedProduct[] };
  crossSell?: { nodes: RelatedProduct[] };
}

// ── Related Product Card ──────────────────────────────────────────
function RelatedCard({ p }: { p: RelatedProduct }) {
  const fmt = (val?: string) =>
    val
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(Number(val))
      : "";

  const displayPrice = p.onSale ? p.salePrice || p.price : p.price;
  const discount =
    p.onSale && p.regularPrice && p.salePrice
      ? Math.round((1 - Number(p.salePrice) / Number(p.regularPrice)) * 100)
      : null;

  return (
    <a href={`/product/${p.slug}`} style={relatedStyles.card}>
      <div style={relatedStyles.imgWrap}>
        {p.image?.sourceUrl ? (
          <img src={p.image.sourceUrl} alt={p.name} style={relatedStyles.img} />
        ) : (
          <div style={relatedStyles.noImg}>No Image</div>
        )}
      </div>
      <div style={relatedStyles.info}>
        <p style={relatedStyles.name}>{p.name}</p>
        {p.onSale && p.regularPrice ? (
          <>
            <p style={relatedStyles.regularPrice}>{fmt(p.regularPrice)}</p>
            <p style={relatedStyles.salePrice}>
              Now {fmt(displayPrice)}{discount ? ` Save ${discount}%` : ""}
            </p>
          </>
        ) : (
          <p style={relatedStyles.normalPrice}>{fmt(displayPrice)}</p>
        )}
      </div>
    </a>
  );
}

// ── Related Section ───────────────────────────────────────────────
function RelatedSection({ title, products }: { title: string; products: RelatedProduct[] }) {
  return (
    <div style={relatedStyles.section}>
      <h2 style={relatedStyles.sectionTitle}>{title}</h2>
      {products.length === 0 ? (
        <p style={relatedStyles.empty}>Tidak ada produk terkait.</p>
      ) : (
        <div style={relatedStyles.grid}>
          {products.map((p) => (
            <RelatedCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function ProductDetails({ product }: { product: ProductDetail }) {
  const allImages = [
    product.image?.sourceUrl,
    ...(product.galleryImages?.nodes?.map((img) => img.sourceUrl) || []),
  ].filter(Boolean) as string[];

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [detailOpen, setDetailOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  const category = product.productCategories?.nodes?.[0];

  const fmt = (val?: string) =>
    val
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(Number(val))
      : "";

  const displayPrice = product.onSale ? product.salePrice || product.price : product.price;
  const displayRegular = product.onSale ? product.regularPrice : undefined;

  const upsellProducts = product.upsell?.nodes || [];
  const crossSellProducts = product.crossSell?.nodes || [];
  const hasRelated = upsellProducts.length > 0 || crossSellProducts.length > 0;

  return (
    <div style={styles.page}>
      {/* BREADCRUMB */}
      <nav style={styles.breadcrumb}>
        <a href="/" style={styles.breadLink}>Home</a>
        <span style={styles.breadSep}>/</span>
        {category && (
          <>
            <a href={`/category/${category.slug}`} style={styles.breadLink}>{category.name}</a>
            <span style={styles.breadSep}>/</span>
          </>
        )}
        <span style={styles.breadCurrent}>{product.name}</span>
      </nav>

      <div style={styles.layout}>
        {/* ── LEFT: GALLERY ── */}
        <div style={styles.gallerySection}>
          <div style={styles.thumbCol}>
            {allImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                style={{ ...styles.thumb, ...(i === activeImg ? styles.thumbActive : {}) }}
              >
                <img src={src} alt={`view ${i + 1}`} style={styles.thumbImg} />
              </button>
            ))}
          </div>

          <div style={styles.mainImgWrap}>
            <button
              onClick={() => setWishlist((w) => !w)}
              style={{ ...styles.wishFloatBtn, ...(wishlist ? styles.wishFloatActive : {}) }}
              aria-label="Wishlist"
            >
              {wishlist ? "♥" : "♡"}
            </button>
            {product.onSale && <div style={styles.saleBadge}>SALE</div>}
            <img src={allImages[activeImg]} alt={product.name} style={styles.mainImg} />
          </div>
        </div>

        {/* ── RIGHT: INFO ── */}
        <div style={styles.infoCol}>
          <p style={styles.categoryLabel}>{category?.name?.toUpperCase()}</p>
          <h1 style={styles.productName}>{product.name}</h1>

          <div style={styles.priceRow}>
            <span style={{ ...styles.price, ...(product.onSale ? styles.priceOnSale : {}) }}>
              {fmt(displayPrice)}
            </span>
            {product.onSale && displayRegular && (
              <span style={styles.strikePrice}>{fmt(displayRegular)}</span>
            )}
          </div>

          <div style={styles.ratingRow}>
            <span style={styles.stars}>★★★★★</span>
            <span style={styles.ratingNum}>4.8</span>
            <span style={styles.ratingCount}>(1.122 ulasan)</span>
            <span style={styles.ratingDot}>·</span>
            <span style={styles.soldCount}>1.122 terjual</span>
          </div>

          <div style={styles.shippingBanner}>
            <span style={styles.shippingIcon}>🚚</span>
            <div>
              <p style={styles.shippingTitle}>GRATIS ONGKIR ke seluruh Indonesia</p>
              <p style={styles.shippingLink}>Cek opsi pengiriman lainnya</p>
            </div>
          </div>

          <div style={styles.cartRow}>
            <div style={styles.qtyWrap}>
              <button style={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span style={styles.qtyNum}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button style={styles.addBtn}>TAMBAH KE KERANJANG</button>
            <button
              onClick={() => setWishlist((w) => !w)}
              style={{ ...styles.wishBtnSide, ...(wishlist ? styles.wishBtnActive : {}) }}
            >
              {wishlist ? "♥" : "♡"}
            </button>
          </div>

          <button style={styles.buyNowBtn} onClick={
            async () => {
                try{
                    await addToCart(product.databaseId, qty)
                    alert("added to cart")
                } catch(e){
                    console.error
                }
            }
          }>BELI SEKARANG</button>

          <div style={styles.divider} />

          <div style={styles.accordion}>
            <button style={styles.accordionHeader} onClick={() => setDetailOpen((o) => !o)}>
              <span style={styles.accordionTitle}>DETAIL PRODUK</span>
              <span style={{ transition: "transform .2s", display: "inline-block", transform: detailOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {detailOpen && (
              <div
                style={styles.accordionBody}
                dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription || "" }}
              />
            )}
          </div>

          <div style={styles.accordion}>
            <button style={styles.accordionHeader} onClick={() => setShippingOpen((o) => !o)}>
              <span style={styles.accordionTitle}>PENGIRIMAN & PENGEMBALIAN</span>
              <span style={{ transition: "transform .2s", display: "inline-block", transform: shippingOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {shippingOpen && (
              <div style={styles.accordionBody}>
                <p>Pengiriman gratis untuk semua pesanan. Estimasi tiba 2–5 hari kerja.</p>
                <p style={{ marginTop: "8px" }}>Pengembalian barang dapat dilakukan dalam 30 hari setelah produk diterima.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── UPSELL & CROSS SELL ── */}
      {hasRelated && (
        <div style={relatedStyles.wrapper}>
          <div style={relatedStyles.divider} />
          {upsellProducts.length > 0 && (
            <RelatedSection title="Produk Terkait" products={upsellProducts} />
          )}
          {crossSellProducts.length > 0 && (
            <RelatedSection title="Sering Dibeli Bersama" products={crossSellProducts} />
          )}
        </div>
      )}

      {/* STICKY BOTTOM BAR */}
      <div style={styles.stickyBar}>
        <div style={styles.stickyLeft}>
          <img src={allImages[0]} alt={product.name} style={styles.stickyThumb} />
          <div>
            <p style={styles.stickyName}>{product.name}</p>
            <p style={styles.stickyCategory}>{category?.name}</p>
          </div>
        </div>
        <div style={styles.stickyRight}>
          <div style={styles.stickyPriceWrap}>
            <span style={{ ...styles.stickyPrice, ...(product.onSale ? styles.priceOnSale : {}) }}>
              {fmt(displayPrice)}
            </span>
            {product.onSale && displayRegular && (
              <span style={styles.stickyStrike}>{fmt(displayRegular)}</span>
            )}
          </div>
          <button style={styles.stickyBuyBtn}>BELI SEKARANG</button>
          {/* <button style={styles.stickyCartBtn}>TAMBAH KE KERANJANG</button> */}
          <button style={styles.stickyCartBtn} onClick={
            async () => {
                try{
                    await addToCart(product.databaseId, qty)
                    alert("added to cart")
                } catch(e){
                    console.error
                }
            }
          }>TAMBAH KE KERANJANG</button>
        </div>
      </div>
    </div>
  );
}

// ── Main styles ───────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "100px 24px 120px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#fff",
  },
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "28px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" },
  breadLink: { color: "#999", textDecoration: "none" },
  breadSep: { color: "#ddd" },
  breadCurrent: { color: "#111", fontWeight: 700 },
  layout: { display: "flex", gap: "52px", alignItems: "flex-start" },
  gallerySection: { flex: 1, display: "flex", gap: "12px" },
  thumbCol: { display: "flex", flexDirection: "column", gap: "8px", width: "72px", flexShrink: 0 },
  thumb: { width: "72px", height: "72px", border: "1px solid #e0e0e0", padding: "4px", cursor: "pointer", background: "#fafafa", borderRadius: "2px", boxSizing: "border-box" },
  thumbActive: { border: "2px solid #111" },
  thumbImg: { width: "100%", height: "100%", objectFit: "contain" },
  mainImgWrap: { flex: 1, position: "relative", background: "#f6f6f6", aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: "2px" },
  mainImg: { width: "80%", height: "80%", objectFit: "contain" },
  wishFloatBtn: { position: "absolute", top: "16px", right: "16px", background: "white", border: "1px solid #e0e0e0", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, color: "#bbb", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  wishFloatActive: { color: "#e53e3e", borderColor: "#e53e3e" },
  saleBadge: { position: "absolute", top: "16px", left: "16px", background: "#e53e3e", color: "white", fontSize: "10px", fontWeight: 800, padding: "4px 10px", letterSpacing: "1px", zIndex: 2, borderRadius: "2px" },
  infoCol: { width: "420px", flexShrink: 0, display: "flex", flexDirection: "column" },
  categoryLabel: { fontSize: "11px", fontWeight: 700, color: "#6bc1c6", letterSpacing: "2px", margin: "0 0 6px" },
  productName: { fontSize: "24px", fontWeight: 900, color: "#111", margin: "0 0 16px", lineHeight: 1.2, textTransform: "uppercase" },
  priceRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  price: { fontSize: "26px", fontWeight: 900, color: "#111" },
  priceOnSale: { color: "#e53e3e" },
  strikePrice: { fontSize: "16px", color: "#aaa", textDecoration: "line-through", fontWeight: 400 },
  ratingRow: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", marginBottom: "20px" },
  stars: { color: "#FFD700", fontSize: "14px" },
  ratingNum: { fontWeight: 700, color: "#111" },
  ratingCount: { color: "#6bc1c6", cursor: "pointer", textDecoration: "underline" },
  ratingDot: { color: "#ccc" },
  soldCount: { color: "#888" },
  shippingBanner: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid #e8e8e8", background: "#fafafa", marginBottom: "24px", borderRadius: "4px" },
  shippingIcon: { fontSize: "22px" },
  shippingTitle: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", margin: 0 },
  shippingLink: { fontSize: "10px", color: "#6bc1c6", textDecoration: "underline", cursor: "pointer", margin: "2px 0 0" },
  cartRow: { display: "flex", gap: "8px", marginBottom: "10px" },
  qtyWrap: { display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "2px", overflow: "hidden", height: "52px" },
  qtyBtn: { width: "36px", height: "100%", border: "none", background: "white", fontSize: "18px", cursor: "pointer", color: "#333" },
  qtyNum: { width: "32px", textAlign: "center", fontWeight: 700, fontSize: "14px" },
  addBtn: { flex: 1, height: "52px", background: "#6bc1c6", color: "white", border: "none", fontWeight: 900, fontSize: "12px", letterSpacing: "1px", cursor: "pointer", borderRadius: "2px" },
  wishBtnSide: { width: "52px", height: "52px", border: "1px solid #e0e0e0", background: "white", fontSize: "20px", cursor: "pointer", borderRadius: "2px", color: "#bbb", display: "flex", alignItems: "center", justifyContent: "center" },
  wishBtnActive: { color: "#e53e3e", borderColor: "#e53e3e" },
  buyNowBtn: { width: "100%", height: "52px", background: "#111", color: "white", border: "none", fontWeight: 900, fontSize: "12px", letterSpacing: "1.5px", cursor: "pointer", marginBottom: "24px", borderRadius: "2px" },
  divider: { borderTop: "1px solid #e8e8e8" },
  accordion: { borderBottom: "1px solid #e8e8e8" },
  accordionHeader: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, letterSpacing: "2px" },
  accordionTitle: { color: "#111" },
  accordionBody: { fontSize: "13px", color: "#555", lineHeight: 1.7, paddingBottom: "16px" },
  stickyBar: { position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e8e8e8", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" },
  stickyLeft: { display: "flex", alignItems: "center", gap: "12px" },
  stickyThumb: { width: "48px", height: "48px", objectFit: "contain", background: "#f6f6f6", borderRadius: "2px" },
  stickyName: { fontSize: "13px", fontWeight: 700, margin: 0, color: "#111" },
  stickyCategory: { fontSize: "11px", color: "#6bc1c6", margin: "2px 0 0", fontWeight: 600 },
  stickyRight: { display: "flex", alignItems: "center", gap: "10px" },
  stickyPriceWrap: { display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "8px" },
  stickyPrice: { fontSize: "20px", fontWeight: 900, color: "#111" },
  stickyStrike: { fontSize: "11px", color: "#aaa", textDecoration: "line-through" },
  stickyBuyBtn: { height: "42px", padding: "0 24px", background: "#111", color: "white", border: "none", fontWeight: 800, fontSize: "11px", letterSpacing: "1px", cursor: "pointer", borderRadius: "2px" },
  stickyCartBtn: { height: "42px", padding: "0 24px", background: "#6bc1c6", color: "white", border: "none", fontWeight: 800, fontSize: "11px", letterSpacing: "1px", cursor: "pointer", borderRadius: "2px" },
};

// ── Related section styles ────────────────────────────────────────
const relatedStyles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    marginTop: "64px",
  },
  divider: {
    borderTop: "1px solid #e8e8e8",
    marginBottom: "48px",
  },
  section: {
    marginBottom: "56px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#111",
    margin: "0 0 24px",
    letterSpacing: "-0.3px",
  },
  empty: {
    fontSize: "13px",
    color: "#999",
    padding: "24px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    color: "inherit",
    cursor: "pointer",
  },
  imgWrap: {
    background: "#f6f6f6",
    aspectRatio: "3/4",
    overflow: "hidden",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  noImg: {
    fontSize: "12px",
    color: "#bbb",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "0 2px",
  },
  name: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#111",
    margin: 0,
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  normalPrice: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#111",
    margin: 0,
  },
  regularPrice: {
    fontSize: "13px",
    color: "#999",
    textDecoration: "line-through",
    margin: 0,
  },
  salePrice: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#e53e3e",
    margin: 0,
  },
};