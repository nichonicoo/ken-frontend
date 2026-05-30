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
  const [hovered, setHovered] = useState(false);

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
    <div
      style={styles.wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
            <img src={image} alt={slide.title} style={styles.image} />
          </div>
        );
      })}

      {validSlides.length > 1 && (
        <>
          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous"
            style={{
              ...styles.arrow,
              left: "28px",
              opacity: hovered ? 1 : 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Next"
            style={{
              ...styles.arrow,
              right: "28px",
              opacity: hovered ? 1 : 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Dash-style dots */}
          <div style={styles.dots}>
            {validSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Slide ${index + 1}`}
                style={{
                  ...styles.dot,
                  width: index === current ? "28px" : "8px",
                  background: index === current ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.4)",
                }}
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
    paddingBottom: "42%",
    overflow: "hidden",
    backgroundColor: "#111",
  },
  slide: {
    position: "absolute",
    inset: 0,
    transition: "opacity 0.8s ease",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "50%",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    transition: "opacity 0.25s ease, background 0.2s ease",
  },
  dots: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    zIndex: 10,
  },
  dot: {
    height: "3px",
    borderRadius: "2px",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "width 0.3s ease, background 0.3s ease",
  },
};