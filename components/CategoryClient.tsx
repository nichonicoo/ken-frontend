// "use client";

// import { useState, useMemo } from "react";
// import { Cormorant_Garamond } from "next/font/google";
// import ProductCard from "@/components/ProductCard";
// import Breadcrumb from "@/components/Breadcrumbs";

// const cormorant = Cormorant_Garamond({
//   subsets: ["latin"],
//   weight: ["300", "400", "500"],
// });

// type Product = {
//   id?: string;
//   name: string;
//   slug: string;
//   price: string;
//   regularPrice?: string;
//   salePrice?: string;
//   onSale?: boolean;
//   image?: { sourceUrl: string } | null;
//   productCategories?: { nodes: { name: string; slug?: string }[] };
// };

// type Props = {
//   products: Product[];
//   categoryName: string;
//   heroImage?: string;
// };

// const SORT_OPTIONS = [
//   { value: "default",    label: "Default" },
//   { value: "price-asc",  label: "Harga: Terendah" },
//   { value: "price-desc", label: "Harga: Tertinggi" },
//   { value: "name-asc",   label: "Nama: A–Z" },
//   { value: "name-desc",  label: "Nama: Z–A" },
// ];

// const parsePrice = (val?: string) => {
//   if (!val) return 0;
//   return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
// };

// export default function CategoryClient({ products, categoryName, heroImage }: Props) {
//   const [saleFilter, setSaleFilter] = useState<"all" | "on-sale" | "not-sale">("all");

//   const [sort, setSort] = useState("default");

//   const filtered = useMemo(() => {
//     let list = [...products];

//     // filter sale
//     if (saleFilter === "on-sale") list = list.filter((p) => p.onSale);
//     if (saleFilter === "not-sale") list = list.filter((p) => !p.onSale);

//     // sort
//     switch (sort) {
//       case "price-asc":  list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
//       case "price-desc": list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
//       case "name-asc":   list.sort((a, b) => a.name.localeCompare(b.name)); break;
//       case "name-desc":  list.sort((a, b) => b.name.localeCompare(a.name)); break;
//     }

//     return list;
//   }, [products, sort, saleFilter]);

//   return (
//     <div style={styles.page}>
//       {/* Breadcrumb */}
//       <div style={styles.breadcrumbWrap}>
//         <Breadcrumb
//           items={[
//             { label: "Home", href: "/" },
//             { label: "Products", href: "/products" },
//             { label: categoryName },
//           ]}
//         />
//       </div>

//       {/* Hero */}
//       <div style={{
//         ...styles.hero,
//         backgroundImage: heroImage ? `url(${heroImage})` : undefined,
//       }}>
//         {!heroImage && <div style={styles.heroPlaceholder} />}
//         <div style={styles.heroOverlay} />
//         <div style={styles.heroContent}>
//           <p style={{ ...styles.heroEyebrow, ...cormorant.style }}>Koleksi</p>
//           <h1 className={cormorant.className} style={styles.heroTitle}>
//             {categoryName}
//           </h1>
//           <p style={styles.heroCount}>{products.length} produk</p>
//         </div>
//       </div>

//       {/* Body: sidebar + grid */}
//       <div style={styles.body}>

//         {/* Sidebar */}
//         <aside style={styles.sidebar}>
//           <p style={styles.sidebarTitle}>Filter</p>

//           <div style={styles.filterGroup}>
//             <p style={styles.filterLabel}>Status</p>
//             <div style={styles.filterList}>
//               {[
//                 { value: "all",      label: "Semua" },
//                 { value: "on-sale",  label: "On Sale" },
//                 { value: "not-sale", label: "Tidak Sale" },
//               ].map(({ value, label }) => (
//                 <button
//                   key={value}
//                   style={{ ...styles.filterItem, ...(saleFilter === value ? styles.filterItemActive : {}) }}
//                   onClick={() => setSaleFilter(value as "all" | "on-sale" | "not-sale")}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Main */}
//         <div style={styles.main}>

//           {/* Toolbar */}
//           <div style={styles.toolbar}>
//             <p style={styles.resultCount}>
//               {filtered.length} produk
//             </p>
//             <div style={styles.sortWrap}>
//               <label style={styles.sortLabel}>Sort by:</label>
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 style={styles.sortSelect}
//               >
//                 {SORT_OPTIONS.map((o) => (
//                   <option key={o.value} value={o.value}>{o.label}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Grid */}
//           {filtered.length === 0 ? (
//             <div style={styles.empty}>
//               <p style={styles.emptyText}>Tidak ada produk ditemukan.</p>
//               <button style={styles.emptyReset} onClick={() => { setSaleFilter("all"); setSort("default"); }}>
//                 Reset filter
//               </button>
//             </div>
//           ) : (
//             <div style={styles.grid}>
//               {filtered.map((p, i) => (
//                 <ProductCard
//                   key={p.id || i}
//                   name={p.name}
//                   slug={p.slug}
//                   price={p.price}
//                   regularPrice={p.regularPrice}
//                   salePrice={p.salePrice}
//                   onSale={p.onSale}
//                   image={p.image?.sourceUrl}
//                   category={p.productCategories?.nodes?.[0]?.name}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // styles
// const styles: { [key: string]: React.CSSProperties } = {
//   page: {
//     width: "100%",
//     maxWidth: "1300px",
//     margin: "0 auto",
//     padding: "10px 32px 80px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     backgroundColor: "#fff",
//   },
//   breadcrumbWrap: {
//     marginBottom: "24px",
//   },

//   // Hero
//   hero: {
//     position: "relative",
//     width: "100%",
//     height: "220px",
//     borderRadius: "8px",
//     overflow: "hidden",
//     marginBottom: "40px",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundColor: "#f5f3ef",
//     display: "flex",
//     alignItems: "flex-end",
//   },
//   heroPlaceholder: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(135deg, #f5f3ef 0%, #e8e4de 100%)",
//   },
//   heroOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)",
//   },
//   heroContent: {
//     position: "relative",
//     zIndex: 2,
//     padding: "28px 32px",
//   },
//   heroEyebrow: {
//     fontSize: "12px",
//     color: "rgba(255,255,255,0.7)",
//     letterSpacing: "0.1em",
//     marginBottom: "4px",
//   },
//   heroTitle: {
//     fontSize: "40px",
//     fontWeight: 400,
//     color: "#fff",
//     margin: 0,
//     lineHeight: 1.1,
//     letterSpacing: "0.01em",
//   },
//   heroCount: {
//     fontSize: "11px",
//     color: "rgba(255,255,255,0.6)",
//     marginTop: "6px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     letterSpacing: "0.08em",
//   },

//   // Body
//   body: {
//     display: "flex",
//     gap: "40px",
//     alignItems: "flex-start",
//   },

//   // Sidebar
//   sidebar: {
//     width: "200px",
//     flexShrink: 0,
//     position: "sticky",
//     top: "32px",
//   },
//   sidebarTitle: {
//     fontSize: "10px",
//     fontWeight: 600,
//     letterSpacing: "0.16em",
//     textTransform: "uppercase",
//     color: "#111",
//     marginBottom: "20px",
//   },
//   filterGroup: {
//     marginBottom: "24px",
//   },
//   filterLabel: {
//     fontSize: "9px",
//     fontWeight: 600,
//     letterSpacing: "0.14em",
//     textTransform: "uppercase",
//     color: "#aaa",
//     marginBottom: "10px",
//   },
//   filterList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "2px",
//   },
//   filterItem: {
//     textAlign: "left",
//     padding: "7px 10px",
//     fontSize: "12px",
//     color: "#555",
//     background: "transparent",
//     border: "none",
//     borderRadius: "4px",
//     cursor: "pointer",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     transition: "background 0.15s ease, color 0.15s ease",
//   },
//   filterItemActive: {
//     background: "#111",
//     color: "#fff",
//   },

//   // Main
//   main: {
//     flex: 1,
//     minWidth: 0,
//   },
//   toolbar: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "24px",
//     paddingBottom: "16px",
//     borderBottom: "0.5px solid #ebebeb",
//   },
//   resultCount: {
//     fontSize: "12px",
//     color: "#aaa",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   sortWrap: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   },
//   sortLabel: {
//     fontSize: "11px",
//     color: "#aaa",
//     letterSpacing: "0.06em",
//   },
//   sortSelect: {
//     fontSize: "11px",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//     color: "#111",
//     background: "transparent",
//     border: "0.5px solid #e0e0e0",
//     borderRadius: "4px",
//     padding: "6px 10px",
//     cursor: "pointer",
//     outline: "none",
//     appearance: "none" as const,
//     WebkitAppearance: "none" as const,
//     paddingRight: "28px",
//     backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "right 10px center",
//   },
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
//     gap: "24px",
//   },

//   // Empty state
//   empty: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "40vh",
//     gap: "16px",
//   },
//   emptyText: {
//     fontSize: "14px",
//     color: "#999",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
//   emptyReset: {
//     fontSize: "11px",
//     fontWeight: 600,
//     color: "#111",
//     background: "transparent",
//     border: "0.5px solid #111",
//     borderRadius: "20px",
//     padding: "8px 20px",
//     cursor: "pointer",
//     letterSpacing: "0.08em",
//     fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
//   },
// };

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Cormorant_Garamond } from "next/font/google";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumbs";

// Slider thumb styles injected globally
const sliderCSS = `
  input[type='range'].price-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #111;
    cursor: pointer;
    pointer-events: all;
    position: relative;
    z-index: 2;
  }
  input[type='range'].price-slider::-moz-range-thumb {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #111;
    cursor: pointer;
    pointer-events: all;
    border: none;
  }
  input[type='range'].price-slider {
    pointer-events: none;
  }
  .slider-track {
    position: absolute;
    width: 100%;
    height: 3px;
    background: #e0e0e0;
    border-radius: 2px;
  }
`;

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

type Product = {
  id?: string;
  name: string;
  slug: string;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
  image?: { sourceUrl: string } | null;
  stockStatus: string;
  productCategories?: { nodes: { name: string; slug?: string }[] };
};

type Props = {
  products: Product[];
  categoryName: string;
  heroImage?: string;
};

const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price-asc",  label: "Harga: Terendah" },
  { value: "price-desc", label: "Harga: Tertinggi" },
  { value: "name-asc",   label: "Nama: A–Z" },
  { value: "name-desc",  label: "Nama: Z–A" },
];

const parsePrice = (val?: string) => {
  if (!val) return 0;
  return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
};

const fmtPrice = (val: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

export default function CategoryClient({ products, categoryName, heroImage }: Props) {
  const [saleFilter, setSaleFilter] = useState<"all" | "on-sale" | "not-sale">("all");
  const [sort, setSort] = useState("default");

  // price range
  const allPrices = useMemo(() => products.map((p) => parsePrice(p.price)).filter((v) => v > 0), [products]);
  const minPrice = useMemo(() => allPrices.length ? Math.min(...allPrices) : 0, [allPrices]);
  const maxPrice = useMemo(() => allPrices.length ? Math.max(...allPrices) : 0, [allPrices]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [priceReady, setPriceReady] = useState(false);

  useEffect(() => {
    if (!priceReady && allPrices.length > 0) {
      setPriceRange([minPrice, maxPrice]);
      setPriceReady(true);
    }
  }, [minPrice, maxPrice, allPrices.length, priceReady]);

  const filtered = useMemo(() => {
    let list = [...products];

    // filter sale
    if (saleFilter === "on-sale") list = list.filter((p) => p.onSale);
    if (saleFilter === "not-sale") list = list.filter((p) => !p.onSale);

    // filter price
    if (priceReady) {
      list = list.filter((p) => {
        const price = parsePrice(p.price);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // sort
    switch (sort) {
      case "price-asc":  list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case "price-desc": list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      case "name-asc":   list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc":  list.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    return list;
  }, [products, sort, saleFilter, priceRange, priceReady]);

  return (
    <div style={styles.page}>
      <style>{sliderCSS}</style>
      {/* Breadcrumb */}
      <div style={styles.breadcrumbWrap}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: categoryName },
          ]}
        />
      </div>

      {/* Hero */}
      <div style={{
        ...styles.hero,
        backgroundImage: heroImage ? `url(${heroImage})` : undefined,
      }}>
        {!heroImage && <div style={styles.heroPlaceholder} />}
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <p style={{ ...styles.heroEyebrow, ...cormorant.style }}>Koleksi</p>
          <h1 className={cormorant.className} style={styles.heroTitle}>
            {categoryName}
          </h1>
          <p style={styles.heroCount}>{products.length} produk</p>
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <div style={styles.body}>

        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <p style={styles.sidebarTitle}>Filter</p>

          {/* Price range */}
          {priceReady && (
            <div style={styles.filterGroup}>
              <p style={styles.filterLabel}>Harga</p>
              <div style={styles.priceLabels}>
                <span style={styles.priceLabel}>{fmtPrice(priceRange[0])}</span>
                <span style={styles.priceLabel}>{fmtPrice(priceRange[1])}</span>
              </div>
              <div style={styles.sliderWrap}>
                {/* base track */}
                <div className="slider-track" />
                {/* track fill */}
                <div style={{
                  ...styles.sliderTrackFill,
                  left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                }} />
                {/* min thumb */}
                <input
                  type="range"
                  className="price-slider"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < priceRange[1]) setPriceRange([val, priceRange[1]]);
                  }}
                  style={styles.sliderInput}
                />
                {/* max thumb */}
                <input
                  type="range"
                  className="price-slider"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > priceRange[0]) setPriceRange([priceRange[0], val]);
                  }}
                  style={styles.sliderInput}
                />
              </div>
            </div>
          )}

          <div style={styles.filterGroup}>
            <p style={styles.filterLabel}>Status</p>
            <div style={styles.filterList}>
              {[
                { value: "all",      label: "Semua" },
                { value: "on-sale",  label: "On Sale" },
                { value: "not-sale", label: "Tidak Sale" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  style={{ ...styles.filterItem, ...(saleFilter === value ? styles.filterItemActive : {}) }}
                  onClick={() => setSaleFilter(value as "all" | "on-sale" | "not-sale")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={styles.main}>

          {/* Toolbar */}
          <div style={styles.toolbar}>
            <p style={styles.resultCount}>
              {filtered.length} produk
            </p>
            <div style={styles.sortWrap}>
              <label style={styles.sortLabel}>Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={styles.sortSelect}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>Tidak ada produk ditemukan.</p>
              <button style={styles.emptyReset} onClick={() => { setSaleFilter("all"); setSort("default"); setPriceRange([minPrice, maxPrice]); }}>
                Reset filter
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((p, i) => (
                <div key={p.id || i} style={{ width: "100%" }}>
                  <ProductCard
                    name={p.name}
                    slug={p.slug}
                    price={p.price}
                    regularPrice={p.regularPrice}
                    salePrice={p.salePrice}
                    onSale={p.onSale}
                    image={p.image?.sourceUrl}
                    category={p.productCategories?.nodes?.[0]?.name}
                    stockStatus={p.stockStatus}
                  />
                </div>
              ))}
              {/* )) */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: "100%",
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "32px 80px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    backgroundColor: "#fff",
  },
  breadcrumbWrap: {
    marginBottom: "24px",
  },

  // Hero
  hero: {
    position: "relative",
    width: "100%",
    height: "220px",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "40px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#f5f3ef",
    display: "flex",
    alignItems: "flex-end",
  },
  heroPlaceholder: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #f5f3ef 0%, #e8e4de 100%)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    padding: "28px 32px",
  },
  heroEyebrow: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.1em",
    marginBottom: "4px",
  },
  heroTitle: {
    fontSize: "40px",
    fontWeight: 400,
    color: "#fff",
    margin: 0,
    lineHeight: 1.1,
    letterSpacing: "0.01em",
  },
  heroCount: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    marginTop: "6px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    letterSpacing: "0.08em",
  },

  // Body
  body: {
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
  },

  // Sidebar
  sidebar: {
    width: "200px",
    flexShrink: 0,
    position: "sticky",
    top: "32px",
  },
  sidebarTitle: {
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#111",
    marginBottom: "20px",
  },
  filterGroup: {
    marginBottom: "24px",
  },
  filterLabel: {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "10px",
  },
  filterList: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  filterItem: {
    textAlign: "left",
    padding: "7px 10px",
    fontSize: "12px",
    color: "#555",
    background: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    transition: "background 0.15s ease, color 0.15s ease",
  },
  filterItemActive: {
    background: "#111",
    color: "#fff",
  },

  // Main
  main: {
    flex: 1,
    minWidth: 0,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "0.5px solid #ebebeb",
  },
  resultCount: {
    fontSize: "12px",
    color: "#aaa",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  sortWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sortLabel: {
    fontSize: "11px",
    color: "#aaa",
    letterSpacing: "0.06em",
  },
  sortSelect: {
    fontSize: "11px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    color: "#111",
    background: "transparent",
    border: "0.5px solid #e0e0e0",
    borderRadius: "4px",
    padding: "6px 10px",
    cursor: "pointer",
    outline: "none",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    paddingRight: "28px",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "24px",
  },

  // Price slider
  priceLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  priceLabel: {
    fontSize: "11px",
    color: "#555",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  sliderWrap: {
    position: "relative",
    height: "20px",
    display: "flex",
    alignItems: "center",
  },
  sliderTrackFill: {
    position: "absolute",
    height: "3px",
    background: "#111",
    borderRadius: "2px",
    pointerEvents: "none",
    zIndex: 1,
  },
  sliderInput: {
    position: "absolute",
    width: "100%",
    height: "3px",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    background: "transparent",
    pointerEvents: "none",
    outline: "none",
    margin: 0,
  },

  // Empty state
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40vh",
    gap: "16px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#999",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  emptyReset: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#111",
    background: "transparent",
    border: "0.5px solid #111",
    borderRadius: "20px",
    padding: "8px 20px",
    cursor: "pointer",
    letterSpacing: "0.08em",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};