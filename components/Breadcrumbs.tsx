"use client";

import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

type Props = {
  items: {
    label: string;
    href?: string;
  }[];
};

export default function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={cormorant.className} style={styles.container}>
      <ol style={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} style={styles.item}>
              {item.href && !isLast ? (
                <Link href={item.href} style={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span
                  style={styles.current}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <svg
                  style={styles.chevron}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4.5 2.5L7.5 6L4.5 9.5"
                    stroke="#c8c8c8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: "20px",
  },
  list: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "2px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  link: {
    textDecoration: "none",
    color: "#999",
    fontSize: "15px",
    fontWeight: 300,
    letterSpacing: "0.04em",
    transition: "color 0.15s ease",
  },
  current: {
    color: "#111",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: "0.04em",
  },
  chevron: {
    flexShrink: 0,
    marginLeft: "2px",
    marginRight: "2px",
  },
};