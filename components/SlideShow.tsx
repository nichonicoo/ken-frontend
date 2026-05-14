"use client";

import { useState, useEffect, useCallback } from "react";

type Slide = {
  title: string;
  sliderFields: {
    sliderType: string;
    slideOrderNumber: number;
    slideImageHomes?: {
      node?: {
        sourceUrl: string;
      };
    };
  };
};

type Props = {
  slides: Slide[];
  autoPlayInterval?: number;
};

export default function Slider({ slides, autoPlayInterval = 4000 }: Props) {
  const validSlides = [...slides]
    .sort((a, b) => a.sliderFields.slideOrderNumber - b.sliderFields.slideOrderNumber)
    .filter((s) => s.sliderFields.slideImageHomes?.node?.sourceUrl);

  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + validSlides.length) % validSlides.length);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % validSlides.length),
    [validSlides.length]
  );

  useEffect(() => {
    if (validSlides.length <= 1) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval, validSlides.length]);

  if (validSlides.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      {validSlides.map((slide, index) => {
        const image = slide.sliderFields.slideImageHomes!.node!.sourceUrl;
        return (
          <div
            key={index}
            style={{
              ...styles.slide,
              opacity: index === current ? 1 : 0,
              zIndex: index === current ? 1 : 0,
            }}
          >
            <img
              src={image}
              alt={slide.title}
              style={styles.image}
            />
          </div>
        );
      })}

      {validSlides.length > 1 && (
        <>
          <button onClick={prev} style={{ ...styles.arrow, left: "16px" }} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button onClick={next} style={{ ...styles.arrow, right: "16px" }} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div style={styles.dots}>
            {validSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                style={{ ...styles.dot, ...(index === current ? styles.dotActive : {}) }}
                aria-label={`Slide ${index + 1}`}
              />
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
    width: "100%",
    // Aspect ratio ~21:9 mirip screenshot — ubah paddingBottom untuk menyesuaikan
    paddingBottom: "42%",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  slide: {
    position: "absolute",
    inset: 0,
    transition: "opacity 0.5s ease",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",       // selalu mengisi area, crop jika perlu
    objectPosition: "center", // fokus ke tengah gambar
    display: "block",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "rgba(255,255,255,0.85)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#333",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  dots: {
    position: "absolute",
    bottom: "14px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    zIndex: 10,
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.5)",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "background 0.2s, transform 0.2s",
  },
  dotActive: {
    background: "white",
    transform: "scale(1.3)",
  },
};