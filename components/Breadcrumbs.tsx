"use client";

import Link from "next/link";

type Props = {
  items: {
    label: string;
    href?: string;
  }[];
};

export default function Breadcrumb({ items }: Props) {
  return (
    <div style={styles.container}>
      {items.map((item, index) => (
        <span key={index} style={styles.item}>
          {item.href ? (
            <Link href={item.href} style={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span style={styles.current}>{item.label}</span>
          )}

          {index < items.length - 1 && (
            <span style={styles.separator}> / </span>
          )}
        </span>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: "16px",
    fontSize: "14px",
    color: "#888",
  },
  item: {},
  link: {
    textDecoration: "none",
    color: "#6bc1c6",
  },
  current: {
    color: "#333",
    fontWeight: 500,
  },
  separator: {
    margin: "0 6px",
  },
};