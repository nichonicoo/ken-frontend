"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Cormorant_Garamond } from "next/font/google";
// import { getLatestProduct } from "@/app/api/graphql/Products";
import { useRouter } from "next/navigation";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  price?: string;
  onSale?: boolean;
  regularPrice?: string;
  salePrice?: string;
  image?: { sourceUrl: string } | null;
}

const formatRupiah = (raw?: string): string => {
  if (!raw) return "-";
  const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return raw;
  return "Rp " + num.toLocaleString("id-ID");
};

const CARD_WIDTH = "calc((100% - 64px) / 4.5)";
const GAP = 16;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ flex: "none", width: CARD_WIDTH }}>
      <div style={{ borderRadius: 12, aspectRatio: "3/4", background: "#f0f0f0", marginBottom: 12, animation: "pulse 1.4s ease infinite" }} />
      <div style={{ height: 11, background: "#f0f0f0", borderRadius: 4, marginBottom: 8, animation: "pulse 1.4s ease infinite" }} />
      <div style={{ height: 11, background: "#f0f0f0", borderRadius: 4, width: "70%", marginBottom: 8, animation: "pulse 1.4s ease infinite" }} />
      <div style={{ height: 13, background: "#f0f0f0", borderRadius: 4, width: "50%", animation: "pulse 1.4s ease infinite" }} />
    </div>
  );
}

function ProductCard({ product}: { product: Product}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  return (
    <div
      style={{ flex: "none", width: CARD_WIDTH, cursor: "pointer" }}
      onClick={() => router.push(`/products/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative",
        background: "#f5f3ef",
        borderRadius: 12,
        aspectRatio: "3/4",
        overflow: "hidden",
        marginBottom: 12,
      }}>
        {product.onSale && (
          <span style={{
            position: "absolute", top: 10, left: 10, zIndex: 2,
            background: "#d82a2a", color: "#fff",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
            padding: "3px 8px", borderRadius: 2,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            SALE
          </span>
        )}
        <img
          src={product.image?.sourceUrl || "https://placehold.co/300x400/eeece8/aaa?text=No+Image"}
          alt={product.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
          loading="lazy"
        />
      </div>

      <p style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#1a1a1a",
        lineHeight: 1.5,
        marginBottom: 5,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {product.name}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {product.onSale && product.regularPrice ? (
          <>
            <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              {formatRupiah(product.regularPrice)}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              {formatRupiah(product.salePrice)}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 400, color: "#111", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            {formatRupiah(product.price)}
          </span>
        )}
      </div>
    </div>
  );
}

function ArrowBtn({ direction, onClick, visible, disabled }: {
  direction: "left" | "right";
  onClick: () => void;
  visible: boolean;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        top: "38%",
        [direction === "left" ? "left" : "right"]: -18,
        transform: "translateY(-50%)",
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: hovered ? "#111" : "#fff",
        color: hovered ? "#fff" : "#111",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible && !disabled ? 1 : 0,
        pointerEvents: visible && !disabled ? "auto" : "none",
        transition: "opacity 0.2s ease, background 0.18s ease, color 0.18s ease",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />
        }
      </svg>
    </button>
  );
}

const STEP = 4;
interface CarouselProps {
  word1?: string; 
  word2?: string;
  products: Product[];
}

export default function Carousel({ word1, word2, products}: CarouselProps) {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [selected, setSelected] = useState<Product | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   getLatestProduct()
  //     .then((data: LatestProduct[]) => { setProducts(data.map(toProduct)); setLoading(false); })
  //     .catch((err: Error) => { setError(err.message); setLoading(false); });
  // }, []);

  const getCardPxWidth = useCallback((): number => {
    const track = trackRef.current;
    if (!track) return 0;
    return (track.offsetWidth - GAP * 4) / 4.5;
  }, []);

  const maxIndex = Math.max(0, products.length - STEP);
  const goNext = () => setCurrentIndex((p) => Math.min(p + STEP, maxIndex));
  const goPrev = () => setCurrentIndex((p) => Math.max(p - STEP, 0));
  const translateX = -((getCardPxWidth() + GAP) * currentIndex);

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes pulse   { 0%, 100% { opacity: 1 } 50% { opacity: 0.45 } }
      `}</style>

      <section style={{ padding: "60px 48px 64px", background: "#fff" }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "36px" }}>
          <h2
            className={cormorant.className}
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: "#111",
              margin: 0,
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            {word1}{/* New Arrivals */}
          </h2>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: "#aaa",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            paddingBottom: "2px",
          }}>
            {word2}
          </span>
        </div>

        {/* Carousel */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              ref={trackRef}
              style={{
                display: "flex",
                gap: GAP,
                transform: `translateX(${translateX}px)`,
                transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform",
              }}
            >
              {/* {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                : products.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                  ))} */}
              {products.length === 0 ? (
              <p style={{ padding: "20px", fontSize: "14px", color: "#999" }}>
                No products
              </p>
              ) : (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>

          <ArrowBtn direction="left"  onClick={goPrev} visible={isHovered} disabled={currentIndex === 0} />
          <ArrowBtn direction="right" onClick={goNext} visible={isHovered} disabled={currentIndex >= maxIndex} />
        </div>

        {/* {error && (
          <p style={{
            marginTop: 16, fontSize: 11, color: "#bbb", textAlign: "right",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            ⚠ Gagal memuat produk: {error}
          </p>
        )} */}
        {/* {!loading && products.length === 0 && <p>No products</p>} */}
      </section>
    </>
  );
}