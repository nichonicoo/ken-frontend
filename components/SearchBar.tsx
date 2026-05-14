"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchProducts } from "@/app/api/graphql/page";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price?: string;
  image?: { sourceUrl: string } | null;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fmt = (val?: string) =>
    val
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(Number(val))
      : "";

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query.trim());
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/products/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      {/* Search icon button */}
      {!open && (
        <button onClick={handleOpen} style={styles.iconBtn} aria-label="Search">
          <SearchIcon />
        </button>
      )}

      {/* Search input + dropdown */}
      {open && (
        <div style={styles.searchBox}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              style={styles.input}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setResults([]); }}
                style={styles.clearBtn}
              >
                ✕
              </button>
            )}
          </form>

          {/* Dropdown results */}
          {(loading || results.length > 0 || query.trim()) && (
            <div style={styles.dropdown}>
              {loading && (
                <div style={styles.dropdownMsg}>Mencari...</div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <div style={styles.dropdownMsg}>
                  Tidak ada produk untuk "<strong>{query}</strong>"
                </div>
              )}

              {!loading && results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.slug)}
                  style={styles.resultItem}
                >
                  <div style={styles.resultImg}>
                    {item.image?.sourceUrl ? (
                      <img src={item.image.sourceUrl} alt={item.name} style={styles.img} />
                    ) : (
                      <div style={styles.noImg}>
                        <SearchIcon size={14} color="#ccc" />
                      </div>
                    )}
                  </div>
                  <div style={styles.resultInfo}>
                    <span style={styles.resultName}>{item.name}</span>
                    {item.price && (
                      <span style={styles.resultPrice}>{fmt(item.price)}</span>
                    )}
                  </div>
                </button>
              ))}

              {!loading && results.length > 0 && (
                <button
                  onClick={handleSubmit as any}
                  style={styles.seeAllBtn}
                >
                  Lihat semua hasil untuk "{query}" →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "relative",
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
  },
  searchBox: {
    position: "relative",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1.5px solid #6bc1c6",
    borderRadius: "8px",
    padding: "6px 10px",
    background: "white",
    width: "240px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "13px",
    color: "#333",
    background: "transparent",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#aaa",
    fontSize: "12px",
    padding: "0 2px",
    lineHeight: 1,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    background: "white",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    zIndex: 200,
    overflow: "hidden",
    minWidth: "280px",
  },
  dropdownMsg: {
    padding: "14px 16px",
    fontSize: "13px",
    color: "#888",
  },
  resultItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    borderBottom: "1px solid #f5f5f5",
    transition: "background 0.15s",
  },
  resultImg: {
    width: "40px",
    height: "40px",
    borderRadius: "4px",
    overflow: "hidden",
    background: "#f6f6f6",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  noImg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  resultInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    minWidth: 0,
  },
  resultName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#111",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  resultPrice: {
    fontSize: "12px",
    color: "#6bc1c6",
    fontWeight: 700,
  },
  seeAllBtn: {
    width: "100%",
    padding: "12px 14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: "#6bc1c6",
    fontWeight: 700,
    textAlign: "left",
    letterSpacing: "0.3px",
  },
};