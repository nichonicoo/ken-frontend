"use client";

import { useState, useEffect } from "react";

// graphql return
export interface HomeBannerNode {
  title?: string;
  homeBanner1Fields: {
    heading?: string;
    sub?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: {
      node?: {
        sourceUrl?: string;
        altText?: string;
      };
    };
  };
}

interface HeroBannerProps {
  data: HomeBannerNode;
}

export default function HeroBanner({ data }: HeroBannerProps) {
  const fields = data.homeBanner1Fields;

  // mapping graphql
  const badge    = data.title       || "";
  const title    = fields.heading   || "";
  const subHeading = fields.sub || "";
  const description = fields.description || "";
  const ctaLabel = fields.buttonText  || "Shop Now";
  const ctaHref  = fields.buttonLink  || "#";
  const imageUrl = fields.image?.node?.sourceUrl;
  const imageAlt = fields.image?.node?.altText || fields.heading || "";

  const [mounted, setMounted] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500&display=swap');

        .hero-banner {
          position: relative;
          width: 100%;
          min-height: 520px;
          overflow: hidden;
          font-family: 'Barlow', sans-serif;
          background: #0a0e1a;
          border-radius: 12px;
        }

        /* Background image layer */
        .hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 8s ease;
        }
        .hero-banner:hover .hero-bg {
          transform: scale(1.03);
        }

        /* Dark gradient overlay — right side for text legibility */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(5, 10, 25, 0.05) 0%,
            rgba(5, 10, 25, 0.15) 35%,
            rgba(5, 10, 25, 0.70) 60%,
            rgba(5, 10, 25, 0.85) 100%
          );
        }

        /* Content */
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-height: 520px;
          padding: 60px 72px 60px 40%;
          box-sizing: border-box;
        }

        .hero-text-block {
          max-width: 480px;
          width: 100%;
        }

        /* Badge */
        .hero-badge {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #a8c4e0;
          margin-bottom: 14px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s;
        }
        .hero-badge.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Title */
        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.0;
          letter-spacing: -0.01em;
          margin: 0 0 18px 0;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease 0.22s, transform 0.6s ease 0.22s;
        }
        .hero-title.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Subheading */
        .hero-subheading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 10px 0;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease 0.30s, transform 0.6s ease 0.30s;
        }
        .hero-subheading.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Subtitle */
        .hero-subtitle {
          font-size: 15px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.6;
          margin: 0 0 32px 0;
          max-width: 360px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease 0.36s, transform 0.6s ease 0.36s;
        }
        .hero-subtitle.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* CTA Button */
        .hero-cta {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-decoration: none;
          color: #111;
          background: #fff;
          border: none;
          padding: 14px 36px;
          cursor: pointer;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(10px);
          transition:
            opacity 0.55s ease 0.48s,
            transform 0.55s ease 0.48s,
            background 0.25s ease,
            color 0.25s ease,
            box-shadow 0.25s ease;
        }
        .hero-cta.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-cta:hover {
          background: #1a3a5c;
          color: #fff;
          box-shadow: 0 6px 24px rgba(26, 58, 92, 0.45);
        }

        /* Accent line */
        .hero-accent-line {
          position: absolute;
          left: 0;
          top: 0;
          width: 5px;
          height: 0;
          background: #2563eb;
          transition: height 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
        }
        .hero-banner:hover .hero-accent-line {
          height: 100%;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-content {
            padding: 48px 28px;
            justify-content: flex-start;
            align-items: flex-end;
          }
          .hero-overlay {
            background: linear-gradient(
              to top,
              rgba(5, 10, 25, 0.90) 0%,
              rgba(5, 10, 25, 0.55) 50%,
              rgba(5, 10, 25, 0.15) 100%
            );
          }
          .hero-text-block {
            max-width: 100%;
          }
          .hero-subtitle {
            max-width: 100%;
          }
        }
      `}</style>

      <section className="hero-banner">
        {/* background image */}
        <div
          className="hero-bg"
          style={{
            backgroundImage: imageUrl
              ? `url(${imageUrl})`
              : `url('https://placehold.co/1400x520/1a2a40/334466?text=Hero+Banner')`,
          }}
          aria-hidden="true"
        />

        {/* Gradient overlay */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Left accent line */}
        <div className="hero-accent-line" aria-hidden="true" />

        {/* Text content */}
        <div className="hero-content">
          <div className="hero-text-block">
            <p className={`hero-badge${mounted ? " visible" : ""}`}>
              {title}
            </p>

            <h1 className={`hero-title${mounted ? " visible" : ""}`}>
              {fields.sub}
            </h1>

            {/* {fields.sub && (
              <p className={`hero-subheading${mounted ? " visible" : ""}`}>
                {fields.sub}
              </p>
            )} */}

            <p className={`hero-subtitle${mounted ? " visible" : ""}`}>
              {description}
            </p>

            <a
              href={ctaHref}
              className={`hero-cta${mounted ? " visible" : ""}`}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}