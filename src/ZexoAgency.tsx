import React, { useState, useEffect, useRef } from "react";

/**
 * ZEXO AGENCY — single-page brand site
 * Palette:
 *   --bg:      #050807  (void, slightly green-black, not pure #000 so depth reads)
 *   --panel:   #0b1110  (raised panel black)
 *   --line:    #16201d  (hairline borders)
 *   --teal-1:  #0a3d38  (deep core teal, sampled from logo)
 *   --teal-2:  #14b8a6  (mid teal)
 *   --teal-3:  #6dffe0  (bright highlight edge, sampled from logo)
 *   --ink:     #eafff8  (cool-white text)
 *   --mute:    #7a938d  (muted slate-green secondary text)
 */

const COLORS = {
  bg: "#050807",
  panel: "#0b1110",
  panel2: "#0e1715",
  line: "#16201d",
  teal1: "#0a3d38",
  teal2: "#14b8a6",
  teal3: "#6dffe0",
  ink: "#eafff8",
  mute: "#7a938d",
};

const WHATSAPP_NUMBER = "966598369616"; // +966 59 836 9616, no leading zero, no symbols
const PHONE_DISPLAY = "+966 59 836 9616";
const EMAIL = "ziyad@zexoagency.com";
const WEBSITE_DISPLAY = "www.zexoagency.com";
const WEBSITE_HREF = "https://www.zexoagency.com";

// Place your logo file at public/logo.png — Vite serves anything in /public
// from the site root, so "/logo.png" resolves to public/logo.png.
const LOGO_SRC = "/logo.png";

// ---- Signature element: the logo's zigzag, redrawn as a live circuit line ----
function ZigzagPulse({
  width = 1200,
  height = 60,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  // Build a long repeating zigzag path that echoes the double-V mark
  const segments = 14;
  const segW = width / segments;
  let d = `M 0 ${height / 2}`;
  for (let i = 0; i < segments; i++) {
    const x1 = segW * (i + 0.5);
    const x2 = segW * (i + 1);
    const up = i % 2 === 0;
    d += ` L ${x1} ${up ? height * 0.15 : height * 0.85} L ${x2} ${height / 2}`;
  }
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id="zz-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={COLORS.line} />
          <stop offset="50%" stopColor={COLORS.teal2} />
          <stop offset="100%" stopColor={COLORS.line} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#zz-grad)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.5}
      />
      <path
        d={d}
        fill="none"
        stroke={COLORS.teal3}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="40 1400"
        opacity={0.9}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="1440"
          to="0"
          dur="5.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transform: visible ? "translateY(0)" : "translateY(18px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const SERVICES = [
  {
    label: "Brand Identity",
    detail:
      "Marks, systems, and guidelines built to hold up across every surface you touch.",
  },
  {
    label: "Web & Product Design",
    detail:
      "Interfaces engineered for clarity first, then given a point of view worth remembering.",
  },
  {
    label: "Performance Marketing",
    detail:
      "Campaigns tuned by data, not guesswork — built to convert and to compound.",
  },
  {
    label: "Content & Motion",
    detail:
      "Photo, video, and animation that carries your voice across every channel.",
  },
];

export default function ZexoAgency() {
  const [year] = useState(() => new Date().getFullYear());

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}`;
  const mailHref = `mailto:${EMAIL}`;
  const telHref = `tel:+${WHATSAPP_NUMBER}`;

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.ink,
        minHeight: "100vh",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Anton&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .zx-display {
          font-family: 'Anton', 'Inter', sans-serif;
          letter-spacing: 0.01em;
        }
        .zx-eyebrow {
          font-size: 12px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: ${COLORS.teal2};
          font-weight: 600;
        }
        .zx-link-card {
          transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
        }
        .zx-link-card:hover {
          border-color: ${COLORS.teal2};
          transform: translateY(-3px);
          background: ${COLORS.panel2};
        }
        .zx-link-card:focus-visible, .zx-nav-link:focus-visible, .zx-cta:focus-visible {
          outline: 2px solid ${COLORS.teal3};
          outline-offset: 3px;
        }
        .zx-nav-link {
          color: ${COLORS.mute};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .zx-nav-link:hover { color: ${COLORS.ink}; }
        .zx-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, ${COLORS.teal2}, ${COLORS.teal1});
          color: #021a17;
          font-weight: 700;
          padding: 14px 26px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 15px;
          transition: filter 0.2s ease, transform 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .zx-cta:hover { filter: brightness(1.12); transform: translateY(-2px); }
        .zx-service-card {
          border: 1px solid ${COLORS.line};
          background: ${COLORS.panel};
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .zx-service-card:hover {
          border-color: ${COLORS.teal1};
          background: ${COLORS.panel2};
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
        .zx-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (max-width: 420px) {
          .zx-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 720px) {
          .zx-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
        }
        .zx-contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 720px) {
          .zx-contact-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .zx-hero-title {
          font-size: clamp(40px, 13vw, 130px);
          line-height: 0.95;
        }
        .zx-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .zx-cta-label-full { display: inline; }
        .zx-cta-label-short { display: none; }
        @media (max-width: 640px) {
          .zx-nav-links { gap: 14px; }
          .zx-nav-link-text { display: none; }
          .zx-cta-label-full { display: none; }
          .zx-cta-label-short { display: inline; }
          .zx-cta {
            padding: 11px 16px;
            font-size: 14px;
          }
        }
        @media (max-width: 420px) {
          .zx-hero-cta-row {
            flex-direction: column;
            align-items: stretch;
          }
          .zx-hero-cta-row .zx-cta {
            width: 100%;
            justify-content: center;
          }
        }
        .zx-section {
          padding: 72px 24px;
        }
        @media (max-width: 640px) {
          .zx-section {
            padding: 48px 20px;
          }
          .zx-link-card {
            padding: 20px 18px !important;
          }
        }
        a, button {
          -webkit-tap-highlight-color: transparent;
        }
        .zx-link-card, .zx-cta {
          touch-action: manipulation;
        }
      `}</style>

      {/* ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1100px",
          height: "700px",
          background: `radial-gradient(ellipse at center, ${COLORS.teal1}33 0%, transparent 65%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* NAV */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(10px)",
          background: "rgba(5,8,7,0.72)",
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <a
            href="#top"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <img
              src={LOGO_SRC}
              alt="Zexo Agency"
              style={{ height: 48, width: "auto", display: "block" }}
            />
          </a>
          <nav className="zx-nav-links">
            <a className="zx-nav-link zx-nav-link-text" href="#services">
              Services
            </a>
            <a className="zx-nav-link zx-nav-link-text" href="#contact">
              Contact
            </a>
            <a className="zx-cta" href={waHref} target="_blank" rel="noopener noreferrer">
              <span className="zx-cta-label-full">WhatsApp Us</span>
              <span className="zx-cta-label-short">WhatsApp</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="top" style={{ position: "relative", zIndex: 1 }}>
        {/* HERO */}
        <section
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "72px 20px 56px",
            textAlign: "center",
          }}
        >
          <Reveal delay={80}>
            <div className="zx-eyebrow" style={{ marginBottom: 18 }}>
              Digital &amp; Brand Agency Dammam  Al Khobar, Saudi Arabia
            </div>
          </Reveal>

          <Reveal delay={140}>
            <h1
              className="zx-display zx-hero-title"
              style={{
                margin: "0 0 22px",
                color: COLORS.ink,
              }}
            >
              ZEXO{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${COLORS.teal3}, ${COLORS.teal2})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AGENCY
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p
              style={{
                color: COLORS.mute,
                fontSize: 18,
                maxWidth: 560,
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              We build brands, websites, and campaigns that move with intent.
              From first sketch to final pixel — one team, one signal.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div
              className="zx-hero-cta-row"
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a className="zx-cta" href={waHref} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
              <a
                className="zx-cta"
                href={mailHref}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.teal2}`,
                  color: COLORS.teal3,
                }}
              >
                Email Us
              </a>
            </div>
          </Reveal>
        </section>

        <div style={{ height: 56, maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          <ZigzagPulse height={56} />
        </div>

        {/* SERVICES */}
        <section id="services" className="zx-section" style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <div className="zx-eyebrow" style={{ marginBottom: 12, textAlign: "center" }}>
              What We Do
            </div>
            <h2
              className="zx-display"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                textAlign: "center",
                margin: "0 0 48px",
                color: COLORS.ink,
              }}
            >
              Built for brands that move
            </h2>
          </Reveal>

          <div className="zx-grid">
            {SERVICES.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div
                  className="zx-service-card"
                  style={{
                    borderRadius: 14,
                    padding: "26px 20px",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 3,
                      background: COLORS.teal2,
                      marginBottom: 18,
                      borderRadius: 2,
                    }}
                  />
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      margin: "0 0 10px",
                      color: COLORS.ink,
                    }}
                  >
                    {s.label}
                  </h3>
                  <p style={{ fontSize: 13.5, color: COLORS.mute, lineHeight: 1.55, margin: 0 }}>
                    {s.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div style={{ height: 56, maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          <ZigzagPulse height={56} />
        </div>

        {/* CONTACT */}
        <section id="contact" className="zx-section" style={{ maxWidth: 1160, margin: "0 auto", paddingBottom: 100 }}>
          <Reveal>
            <div className="zx-eyebrow" style={{ marginBottom: 12, textAlign: "center" }}>
              Get In Touch
            </div>
            <h2
              className="zx-display"
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                textAlign: "center",
                margin: "0 0 14px",
                color: COLORS.ink,
              }}
            >
              Let's start the signal
            </h2>
            <p
              style={{
                textAlign: "center",
                color: COLORS.mute,
                maxWidth: 480,
                margin: "0 auto 48px",
                fontSize: 15.5,
                lineHeight: 1.6,
              }}
            >
              Reach out directly — every channel below opens straight to us, no
              forms, no waiting.
            </p>
          </Reveal>

          <div className="zx-contact-grid">
            <Reveal delay={0}>
              <a
                className="zx-link-card"
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 14,
                  padding: "26px 22px",
                  background: COLORS.panel,
                  height: "100%",
                }}
              >
                <ContactIcon kind="whatsapp" />
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: COLORS.teal2,
                    fontWeight: 700,
                    margin: "16px 0 6px",
                  }}
                >
                  WhatsApp
                </div>
                <div style={{ color: COLORS.ink, fontSize: 16, fontWeight: 600 }}>
                  {PHONE_DISPLAY}
                </div>
                <div style={{ color: COLORS.mute, fontSize: 13, marginTop: 4 }}>
                  Tap to start a chat
                </div>
              </a>
            </Reveal>

            <Reveal delay={90}>
              <a
                className="zx-link-card"
                href={mailHref}
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 14,
                  padding: "26px 22px",
                  background: COLORS.panel,
                  height: "100%",
                }}
              >
                <ContactIcon kind="mail" />
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: COLORS.teal2,
                    fontWeight: 700,
                    margin: "16px 0 6px",
                  }}
                >
                  Email
                </div>
                <div style={{ color: COLORS.ink, fontSize: 16, fontWeight: 600, wordBreak: "break-all" }}>
                  {EMAIL}
                </div>
                <div style={{ color: COLORS.mute, fontSize: 13, marginTop: 4 }}>
                  Tap to email us
                </div>
              </a>
            </Reveal>

            <Reveal delay={180}>
              <a
                className="zx-link-card"
                href={WEBSITE_HREF}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textDecoration: "none",
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 14,
                  padding: "26px 22px",
                  background: COLORS.panel,
                  height: "100%",
                }}
              >
                <ContactIcon kind="web" />
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: COLORS.teal2,
                    fontWeight: 700,
                    margin: "16px 0 6px",
                  }}
                >
                  Website
                </div>
                <div style={{ color: COLORS.ink, fontSize: 16, fontWeight: 600 }}>
                  {WEBSITE_DISPLAY}
                </div>
                <div style={{ color: COLORS.mute, fontSize: 13, marginTop: 4 }}>
                  Visit our site
                </div>
              </a>
            </Reveal>
          </div>

          <Reveal delay={260}>
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <a
                className="zx-cta"
                href={telHref}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.teal2}`,
                  color: COLORS.teal3,
                }}
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `1px solid ${COLORS.line}`,
          padding: "28px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 13, color: COLORS.mute }}>
            © {year} Zexo Agency. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

function ContactIcon({ kind }: { kind: "whatsapp" | "mail" | "web" }) {
  if (kind === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
        <path
          d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"
          stroke={COLORS.teal3}
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M8.5 8.2c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.4.2.5.6 1.6.7 1.7.1.2.1.3 0 .5-.1.2-.2.3-.3.4-.2.2-.3.3-.1.6.2.4.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1 .2-.2.4-.2.6-.1.2.1 1.5.7 1.8.9.3.1.5.2.5.4 0 .2 0 1-.4 1.4-.4.4-1.4.8-2.5.6-1.1-.2-2.6-.9-4.2-2.4-1.7-1.7-2.3-3-2.5-3.4-.1-.4-.6-1.2-.4-1.8z"
          fill={COLORS.teal3}
        />
      </svg>
    );
  }
  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={COLORS.teal3} strokeWidth="1.4" fill="none" />
        <path d="M4 7l8 6 8-6" stroke={COLORS.teal3} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={COLORS.teal3} strokeWidth="1.4" fill="none" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" stroke={COLORS.teal3} strokeWidth="1.2" fill="none" />
    </svg>
  );
}