"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Area = {
  id: string;
  name: string;
  label: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
};

type Props = {
  onSelect: (area: Area) => void;
  value?: string;
};

export default function CitySearch({ onSelect, value }: Props) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (value !== undefined) setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (val: string) => {
    if (val.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/biteship-areas?input=${encodeURIComponent(val)}`);
      const data = await res.json();
      setResults(data.areas || []);
      setOpen(true);
    } catch (e) {
      console.error("Area search error:", e);
    }
    setLoading(false);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  };

  const handleSelect = (area: Area) => {
    setQuery(area.label);
    setResults([]);
    setOpen(false);
    onSelect(area);
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", gridColumn: "span 2" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <label style={styles.label}>Kota / Kecamatan *</label>
      <div style={styles.inputWrap}>
        <input
          type="text"
          placeholder="Ketik nama kota atau kecamatan..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#111";
            if (results.length > 0) setOpen(true);
          }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; }}
          style={styles.input}
          autoComplete="off"
        />
        {loading && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", animation: "spin 0.8s linear infinite" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={styles.dropdown}>
          {results.map((area) => (
            <button
              key={area.id}
              type="button"
              style={styles.dropdownItem}
              onClick={() => handleSelect(area)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f5f3ef"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <p style={styles.itemMain}>
                {area.district ? `${area.district}, ` : ""}{area.city}
              </p>
              <p style={styles.itemSub}>
                {area.province} · {area.postalCode}
              </p>
            </button>
          ))}
        </div>
      )}

      {open && !loading && query.length >= 2 && results.length === 0 && (
        <div style={styles.dropdown}>
          <p style={styles.noResult}>Tidak ditemukan. Coba kata kunci lain.</p>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  label: {
    display: "block",
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "#aaa",
    marginBottom: 6,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "11px 36px 11px 14px",
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
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    background: "#fff",
    border: "0.5px solid #e0e0e0",
    borderRadius: "6px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    zIndex: 100,
    maxHeight: "240px",
    overflowY: "auto",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "10px 14px",
    textAlign: "left" as const,
    background: "transparent",
    border: "none",
    borderBottom: "0.5px solid #f5f5f5",
    cursor: "pointer",
    transition: "background 0.1s ease",
  },
  itemMain: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#111",
    margin: 0,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  itemSub: {
    fontSize: "11px",
    color: "#aaa",
    margin: "2px 0 0",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  noResult: {
    padding: "14px",
    fontSize: "12px",
    color: "#aaa",
    textAlign: "center" as const,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
};