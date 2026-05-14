"use client";

import { useState } from "react";

// for dropdown
interface DropdownItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  title: string;
  items: DropdownItem[];
}

export default function NavDropdown({ title, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={styles.wrapper}
    >
      <div style={styles.trigger}>
        {title}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            marginLeft: "4px",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <>
          <div style={styles.bridge} />
          <div style={styles.dropdown}>
            {items.map((item, index) => (
              <a key={index} href={item.href} style={styles.item}>
                {item.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "relative",
  },
  trigger: {
    cursor: "pointer",
    color: "#444",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
  },
  // Bridge transparan menutupi gap agar mouse tidak "keluar" dari wrapper
  bridge: {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "160px",
    height: "12px", // sama dengan gap (top dropdown = calc(100% + 12px))
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 12px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: "white",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "8px 0",
    minWidth: "160px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  item: {
    padding: "10px 20px",
    textDecoration: "none",
    color: "#444",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
};