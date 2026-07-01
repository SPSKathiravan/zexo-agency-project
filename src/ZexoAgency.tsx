import { useState, useEffect, type ReactNode } from "react";
import RotatingText from "./RotatingText";
import LightRays from "./LightRays.tsx";
import Stack from "./Stack.tsx";
import ImageTrail from "./ImageTrail.tsx";
import FallingText from "./FallingText"; // Ensure this file exists in your directory

interface ProjectItem {
  title: string;
  tag: string;
  badge: string;
  bg: string;
  image?: string;
  type: "glass" | "workflow" | "social" | "twitch";
}

interface SocialProjectItem {
  title: string;
  tag: string;
  badge: string;
  bg: string;
  type: "social";
  images: string[];
}

/* NEW: one entry per PDF brochure card */
interface BrochureItem {
  title: string;
  file: string; // path to the PDF, e.g. /brochures/triton-arabia-materia.pdf
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html { -webkit-text-size-adjust: 100%; }
  :root { --bg: #0a0a0a; --bg-card: #111111; --accent: #0c8665; --accent-dim: #0a6e53; --text: #ffffff; --muted: #9ca3af; --border: #1e1e1e; --font-display: 'Poppins', sans-serif; --font-body: 'Inter', sans-serif; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; }

  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 22px 60px; background: transparent; transition: background .3s, backdrop-filter .3s, padding .3s; }
  .navbar.scrolled { background: rgba(10,10,10,0.72); backdrop-filter: blur(18px); padding: 16px 60px; }
  .nav-logo { display: flex; align-items: center; text-decoration: none; font-family: var(--font-display); font-size: 22px; font-weight: 800; color: var(--text); min-width: 0; }
  .nav-logo-static { color: var(--text); }
  .nav-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .btn-primary { background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 10px 24px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .2s; white-space: nowrap; flex-shrink: 0; }
  .btn-call { display: flex; align-items: center; justify-content: center; gap: 7px; background: transparent; color: #fff; border: 1.5px solid #333; border-radius: 8px; padding: 10px 18px; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; transition: border-color .2s, background .2s; white-space: nowrap; min-height: 40px; }
  .btn-call svg { width: 16px; height: 16px; flex-shrink: 0; }

  .hero { min-height: 100svh; padding: 120px 60px 80px; display: flex; align-items: center; position: relative; overflow: hidden; background: radial-gradient(ellipse 65% 70% at 78% 50%, rgba(12,134,101,0.07) 0%, transparent 60%), var(--bg); }
  .hero-content { max-width: 520px; position: relative; z-index: 5; }
  .hero-title { font-family: var(--font-display); font-size: 60px; font-weight: 900; line-height: 1.05; letter-spacing: -2px; margin-bottom: 22px; }
  .hero-title .highlight { color: var(--accent); font-style: italic; border: 2.5px solid var(--accent); padding: 0 10px; border-radius: 6px; display: inline-block; }
  .hero-subtitle { color: var(--muted); font-size: 15px; line-height: 1.75; margin-bottom: 36px; max-width: 430px; }

  .hero-buttons { display: flex; gap: 14px; margin-top: 8px; flex-wrap: wrap; }
  .btn-whatsapp { background: #0c8665; color: #fff; border: none; border-radius: 8px; padding: 12px 26px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; transition: background .2s; min-height: 48px; }
  .btn-mail { background: transparent; color: #fff; border: 1.5px solid #333; border-radius: 8px; padding: 12px 26px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; transition: border-color .2s; min-height: 48px; }

  .portfolio { background: var(--bg); padding: 80px 60px 100px; }
  .portfolio-title { font-family: var(--font-display); font-size: 42px; font-weight: 900; margin-bottom: 44px; }
  .portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }

  .project-card { border-radius: 14px; overflow: hidden; position: relative; cursor: pointer; aspect-ratio: 16 / 10; background: #111; transition: transform .3s ease, box-shadow .3s ease, aspect-ratio .4s ease; }
  .project-card-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
  .project-card-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%); }
  .project-card-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: #fff; }
  .project-card-tag { font-size: 11px; color: var(--accent); font-weight: 600; margin-top: 4px; }
  .project-card-badge { position: absolute; top: 16px; right: 16px; background: rgba(12,134,101,0.15); border: 1px solid rgba(12,134,101,0.35); color: var(--accent); font-size: 9px; padding: 4px 8px; border-radius: 6px; font-weight: 700; letter-spacing: 0.5px; }

  /* ───── Tap-to-expand: shows the FULL image (no cropping) ───── */
  .project-card.active {
    aspect-ratio: unset;
    background: #000;
    cursor: zoom-out;
    grid-column: 1 / -1;
    box-shadow: 0 16px 50px rgba(0,0,0,0.55);
  }
  .project-card.active .project-card-img {
    position: relative;
    width: 100%;
    height: auto;
    max-height: 80vh;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }
  .project-card.active .project-card-info {
    position: relative;
    background: rgba(0,0,0,0.9);
  }
  .project-card-close {
    position: absolute;
    top: 14px;
    left: 14px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(0,0,0,0.55);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    z-index: 3;
    cursor: pointer;
  }

  .social-card { border-radius: 14px; overflow: hidden; cursor: pointer; transition: transform .3s ease, box-shadow .3s ease; }
  .social-card-thumb { height: auto; display: flex; align-items: center; justify-content: center; position: relative; padding: 8px; }
  .social-card-stack-wrap { width: 100%; max-width: 220px; aspect-ratio: 1 / 1; height: auto; }
  .social-card-body { padding: 16px 18px 18px; background: #111; }
  .social-card-title { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin: 0 0 6px; color: #fff; }
  .social-card-desc { font-size: 13px; color: var(--accent); margin: 0 0 16px; line-height: 1.5; }

  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 44px; flex-wrap: wrap; gap: 12px; }
  .section-title-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .dot-grid { display: grid; grid-template-columns: repeat(3, 8px); gap: 4px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #0c8665; }

  .logo-section { background: var(--bg); padding: 40px 60px 100px; margin-top: -40px; }
  .logo-section .portfolio-grid { display: block; max-width: 1200px; margin: 0 auto; }

  .image-trail-section {
    background: var(--bg);
    padding: 0 60px 120px;
    position: relative;
  }
  .image-trail-section .section-header {
    margin-bottom: 24px;
  }
  .image-trail-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: #0d0d0d;
  }
  .image-trail-hint {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0.7;
    transition: opacity 0.5s;
    font-family: var(--font-body);
  }
  .image-trail-hint svg {
    width: 16px;
    height: 16px;
    stroke: var(--muted);
  }

  /* ───── Mobile logo grid (replaces cursor-trail on touch devices) ───── */
  .logo-grid-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 12px;
    background: transparent;
    padding: 0;
  }
  .logo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    align-items: center;
  }
  .logo-grid-item {
    aspect-ratio: 1 / 1;
    border-radius: 14px;
    overflow: hidden;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .logo-grid-item img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  /* Custom Highlight for Falling Text */
  .falling-highlight {
    color: var(--accent) !important;
    font-weight: 800;
  }

  /* ───── Footer ───── */
  .footer {
    background: #060606;
    border-top: 1px solid var(--border);
    padding: 56px 60px 32px;
    position: relative;
    overflow: hidden;
  }
  .footer::before {
    content: '';
    position: absolute;
    top: -140px;
    right: -100px;
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(12,134,101,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    position: relative;
    z-index: 2;
  }
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    color: #fff;
  }
  .footer-brand span { color: var(--accent); }
  .footer-tagline {
    color: var(--muted);
    font-size: 13px;
    margin-top: 8px;
  }
  .footer-social {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .footer-instagram {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(12,134,101,0.1);
    border: 1.5px solid rgba(12,134,101,0.35);
    color: var(--accent);
    text-decoration: none;
    position: relative;
    transition: transform .35s ease, background .35s ease, border-color .35s ease, color .35s ease;
    animation: footer-pulse 2.6s ease-in-out infinite;
  }
  .footer-instagram svg { width: 20px; height: 20px; }
  @keyframes footer-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(12,134,101,0.35); }
    50% { box-shadow: 0 0 0 9px rgba(12,134,101,0); }
  }
  .footer-bottom {
    max-width: 1200px;
    margin: 40px auto 0;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
    color: var(--muted);
    font-size: 12px;
    position: relative;
    z-index: 2;
  }

  /* ───── Upcoming Projects ───── */
  .upcoming-projects {
    background: var(--bg);
    padding: 0 60px 120px;
  }
  .upcoming-subtitle {
    color: var(--muted);
    font-size: 14px;
    max-width: 480px;
    margin-top: -28px;
    margin-bottom: 36px;
  }
  .upcoming-grid {
    columns: 3 280px;
    column-gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .upcoming-card {
    break-inside: avoid;
    margin-bottom: 20px;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    background: #111;
    box-shadow: 0 0 0 1px var(--border);
  }
  .upcoming-card img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform .6s cubic-bezier(.22,.61,.36,1), filter .6s ease;
  }
  .upcoming-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 55%, transparent 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
  }
  .upcoming-card-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
    color: #fff;
    transform: translateY(0);
    opacity: 1;
    transition: transform .4s ease, opacity .4s ease;
  }
  .upcoming-card-tag {
    font-size: 11px;
    color: var(--accent);
    font-weight: 600;
    margin-top: 4px;
    transform: translateY(0);
    opacity: 1;
    transition: transform .4s ease .05s, opacity .4s ease .05s;
  }
  .upcoming-card-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(12,134,101,0.18);
    border: 1px solid rgba(12,134,101,0.45);
    color: var(--accent);
    font-size: 9px;
    padding: 5px 10px;
    border-radius: 20px;
    font-weight: 700;
    letter-spacing: 0.5px;
    backdrop-filter: blur(6px);
    z-index: 2;
    animation: upcoming-badge-pulse 2.4s ease-in-out infinite;
  }
  @keyframes upcoming-badge-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* ───── Company Brochure (NEW) ───── */
  .brochure-section {
    background: var(--bg);
    padding: 0 60px 120px;
  }
  .brochure-subtitle {
    color: var(--muted);
    font-size: 14px;
    max-width: 480px;
    margin-top: -28px;
    margin-bottom: 40px;
  }
  .brochure-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 26px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .brochure-card {
    position: relative;
    width: 100%;
    max-width: 150px;
    margin: 0 auto;
    aspect-ratio: 1 / 0.86;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    display: block;
    text-decoration: none;
    color: inherit;
  }
  /* solid green folder shape — icon + PDF tag sit directly on it, no white card */
  .brochure-folder {
    position: absolute;
    inset: 14px 0 0 0;
    border-radius: 18px;
    background: linear-gradient(160deg, var(--accent) 0%, #064e3b 100%);
    box-shadow: 0 16px 30px -10px rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform .35s ease, box-shadow .35s ease;
  }
  .brochure-folder::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 14%;
    width: 40%;
    height: 22px;
    border-radius: 10px 10px 0 0;
    background: inherit;
  }
  .brochure-folder svg {
    width: 38%;
    height: 38%;
    stroke: rgba(255,255,255,0.92);
  }
  .brochure-pdf-tag {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #fff;
    background: #d92626;
    padding: 3px 10px;
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  }
  .brochure-caption {
    margin-top: 20px;
    text-align: center;
  }
  .brochure-caption-title {
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }
  .brochure-card-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ───── Hover-only effects (real mouse/trackpad devices).
     Keeps touch/tap on mobile from triggering hover states, which was
     cropping/zooming images and obscuring photos on first touch. ───── */
  @media (hover: hover) and (pointer: fine) {
    .btn-primary:hover { background: var(--accent-dim); }
    .btn-whatsapp:hover { background: #0a6e53; }
    .btn-mail:hover { border-color: #0c8665; }
    .btn-call:hover { border-color: #0c8665; background: rgba(12,134,101,0.08); }
    .project-card:not(.active):hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
    .social-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
    .upcoming-card:hover img { transform: scale(1.1); filter: brightness(.65); }
    .footer-instagram:hover {
      transform: translateY(-4px) scale(1.08) rotate(-6deg);
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
      animation-play-state: paused;
    }
    .brochure-card:hover .brochure-folder { transform: translateY(-6px); box-shadow: 0 24px 40px -10px rgba(0,0,0,0.6); }
  }

  /* ═══════════════════════════ TABLET ═══════════════════════════ */
  @media (max-width: 900px) {
    .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
    .hero { padding: 110px 32px 64px; }
    .portfolio { padding: 60px 32px 80px; }
    .logo-section { padding: 40px 32px 80px; }
    .image-trail-section { padding: 0 32px 80px; }
    .navbar { padding: 16px 24px; }
    .navbar.scrolled { padding: 12px 24px; }
    .hero-title { font-size: 44px; letter-spacing: -1px; }
    .portfolio-title { font-size: 32px; }
    .image-trail-wrapper { height: 360px; }
    .footer { padding: 48px 32px 28px; }
    .upcoming-projects { padding: 0 32px 90px; }
    .upcoming-grid { columns: 2 240px; }
    .logo-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
    .brochure-section { padding: 0 32px 90px; }
    .brochure-grid { grid-template-columns: repeat(2, 1fr); gap: 22px; }
  }

  /* ═══════════════════════════ MOBILE ═══════════════════════════ */
  @media (max-width: 640px) {
    .navbar { padding: 14px 16px; }
    .navbar.scrolled { padding: 12px 16px; }
    .nav-logo { font-size: 16px; }
    .nav-logo img { width: 20px; height: 20px; margin-right: 6px; }
    .nav-actions { gap: 8px; }
    .btn-primary { padding: 9px 14px; font-size: 12px; border-radius: 7px; min-height: 38px; }
    .btn-call { padding: 9px 12px; font-size: 12px; border-radius: 7px; min-height: 38px; }
    .btn-call-text { display: none; }

    .hero { padding: 96px 20px 56px; min-height: auto; padding-bottom: 64px; }
    .hero-content { max-width: 100%; }
    .hero-title { font-size: 32px; letter-spacing: -0.5px; margin-bottom: 16px; }
    .hero-subtitle { font-size: 14px; line-height: 1.65; margin-bottom: 28px; max-width: 100%; }
    .hero-buttons { flex-direction: column; gap: 12px; }
    .btn-whatsapp, .btn-mail { width: 100%; padding: 15px 20px; font-size: 14.5px; min-height: 52px; }

    .portfolio { padding: 44px 16px 56px; }
    .portfolio-title { font-size: 24px; margin-bottom: 24px; }
    .portfolio-grid { grid-template-columns: 1fr; gap: 14px; }
    .project-card { aspect-ratio: 16 / 11; }

    .section-header { margin-bottom: 22px; }
    .social-card-thumb { padding: 6px; }
    .social-card-stack-wrap { max-width: 100%; }
    .social-card-body { padding: 14px 16px 16px; }

    .logo-section { padding: 20px 16px 56px; }
    .image-trail-section { padding: 0 16px 56px; }
    .logo-grid-wrapper { padding: 0; border-radius: 12px; }
    .logo-grid { grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 10px; }
    .logo-grid-item { border-radius: 12px; }

    .footer { padding: 36px 16px 22px; }
    .footer-inner { flex-direction: column; align-items: flex-start; gap: 18px; }
    .footer-brand { font-size: 17px; }
    .footer-bottom { margin-top: 26px; font-size: 11px; }
    .footer-instagram { width: 48px; height: 48px; }

    .upcoming-projects { padding: 0 16px 56px; }
    .upcoming-subtitle { margin-top: -14px; margin-bottom: 20px; font-size: 13px; }
    .upcoming-grid { columns: 2 140px; column-gap: 10px; }
    .upcoming-card { margin-bottom: 10px; border-radius: 12px; }
    .upcoming-card-overlay { padding: 12px; }
    .upcoming-card-title { font-size: 13px; }
    .upcoming-card-tag { font-size: 10px; }
    .upcoming-card-badge { top: 8px; right: 8px; font-size: 8px; padding: 4px 8px; }

    .brochure-section { padding: 0 16px 56px; }
    .brochure-subtitle { margin-top: -14px; margin-bottom: 22px; font-size: 13px; }
    .brochure-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .brochure-card { max-width: 120px; }
    .brochure-folder { inset: 12px 0 0 0; border-radius: 14px; }
    .brochure-pdf-tag { font-size: 9px; padding: 2px 8px; bottom: -7px; }
    .brochure-caption { margin-top: 16px; }
    .brochure-caption-title { font-size: 12.5px; }
  }

  /* ═══════════════════════════ SMALL PHONES ═══════════════════════════ */
  @media (max-width: 400px) {
    .navbar { padding: 12px 14px; }
    .nav-logo { font-size: 14.5px; }
    .btn-primary, .btn-call { padding: 8px 10px; font-size: 11px; }
    .hero-title { font-size: 27px; }
    .hero { padding-top: 92px; }
    .portfolio-title { font-size: 21px; }
    .logo-grid { grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); }
    .upcoming-grid { columns: 1 280px; }
    .brochure-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }
`;

const projectsData: ProjectItem[] = [
  { title: "Triton Arabia", tag: "Web Design", badge: "WEB", bg: "#0f1612", image: "/triton-arabia-web.jpg", type: "glass" },
  { title: "Nex Vision Arabia", tag: "Web Design", badge: "WEB", bg: "#0d1220", image: "/nex-vision-arabia-web.jpg", type: "workflow" },
  { title: "Kaka Grill", tag: "Web Design", badge: "WEB", bg: "#18101a", image: "/kaka-grill-web.jpg", type: "social" },
  { title: "Spice Mantra", tag: "Web Design", badge: "WEB", bg: "#10101e", image: "/spice-mantra-web.jpg", type: "twitch" },
  { title: "Zelebrate Moments", tag: "Web Design", badge: "WEB", bg: "#121212", image: "/zelebrate-moments-web.jpg", type: "glass" },
  { title: "Max Gym", tag: "Web Design", badge: "WEB", bg: "#1a1010", image: "/max-gym-web.jpg", type: "workflow" },
];

const socialMediaData: SocialProjectItem[] = [
  { title: "Kaka Grill Jubail", tag: "Social Media", badge: "SOCIAL", bg: "#1a1212", type: "social", images: ["/kaka-1.jpg", "/kaka-2.jpg", "/kaka-3.jpg", "/kaka-4.jpg", "/kaka-5.jpg", "/kaka-6.jpg", "/kaka-7.jpg", "/kaka-8.jpg"] },
  { title: "Zelebrate Moments", tag: "Social Media", badge: "SOCIAL", bg: "#121a12", type: "social", images: ["/zelebrate-1.jpg", "/zelebrate-2.jpg", "/zelebrate-3.jpg", "/zelebrate-4.jpg", "/zelebrate-5.jpg", "/zelebrate-6.jpg", "/zelebrate-7.jpg", "/zelebrate-8.jpg", "/zelebrate-9.jpg", "/zelebrate-10.jpg"] },
  { title: "Triton Arabia", tag: "Social Media", badge: "SOCIAL", bg: "#12121a", type: "social", images: ["/triton-1.jpg", "/triton-2.jpg", "/triton-3.jpg", "/triton-4.jpg", "/triton-5.jpg", "/triton-6.jpg", "/triton-7.jpg", "/triton-8.jpg", "/triton-9.jpg"] },
  { title: "Biriyani Point", tag: "Social Media", badge: "SOCIAL", bg: "#1a121a", type: "social", images: ["/biriyani-1.jpg", "/biriyani-2.jpg", "/biriyani-3.jpg", "/biriyani-4.jpg", "/biriyani-5.jpg", "/biriyani-6.jpg", "/biriyani-9.jpg"] },
  { title: "Beauty Salon Oman", tag: "Social Media", badge: "SOCIAL", bg: "#121a1a", type: "social", images: ["/salon-1.jpg", "/salon-2.jpg", "/salon-3.jpg", "/salon-4.jpg", "/salon-5.jpg", "/salon-6.jpg", "/salon-7.jpg", "/salon-8.jpg", "/salon-9.jpg"] },
  { title: "Look Smart", tag: "Social Media", badge: "SOCIAL", bg: "#14181c", type: "social", images: ["/looksmart-1.jpg", "/looksmart-2.jpg", "/looksmart-3.jpg", "/looksmart-4.jpg", "/looksmart-5.jpg", "/looksmart-6.jpg"] },
];

/* ── 6th logo removed (was showing a broken image) ── */
const imageTrailItems = [
  "/triton-arabia-logo.jpg",
  "/nex-vision-arabia-logo.jpg",
  "/kaka-grill-logo.jpg",
  "/spice-mantra-logo.jpg",
  "/zelebrate-moments-logo.jpg",
];

interface UpcomingProject {
  title: string;
  tag: string;
  image: string;
}

const upcomingProjectsData: UpcomingProject[] = [
  { title: "Orion Real Estate", tag: "Launching Soon", image: "/orion-real-estate.jpg" },
  { title: "Vetra Fitness Club", tag: "In Development", image: "/vetra-fitness-club.jpg" },
  { title: "Lumora Skincare", tag: "Launching Soon", image: "/lumora-skincare.jpg" },
  { title: "Nimbus Logistics", tag: "In Development", image: "/nimbus-logistics.jpg" },
  { title: "Aurelia Boutique", tag: "Launching Soon", image: "/aurelia-boutique.jpg" },
  { title: "Drift Coffee Co.", tag: "In Development", image: "/drift-coffee.jpg" },
];

/* ═══════════════════════════ NEW: Company Brochure data ═══════════════════════════
   Drop your 4 PDF files into the `public/brochures/` folder of your project using
   these exact filenames (or edit the `file` paths below to match your own files).
   Clicking a card opens that PDF in a new browser tab. */
const brochuresData: BrochureItem[] = [
  { title: "Triton Arabia Materia", file: "/brochures/triton-arabia-materia.pdf" },
  { title: "Triton Arabia Stationery", file: "/brochures/triton-arabia-stationery.pdf" },
  { title: "Nexvision", file: "/brochures/nexvision.pdf" },
  { title: "Marafi", file: "/brochures/marafi.pdf" },
];

// Small hook: tells us whether we're on a touch / narrow-screen device.
// Used to swap the cursor-driven ImageTrail for a tap-friendly static grid on mobile.
function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

export default function ZexoAgency(): ReactNode {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeProject, setActiveProject] = useState<number | null>(null); // tracks which website-project card is expanded to show the full image
  const isMobile = useIsMobile(768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* ───── Navbar ───── */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav-logo">
          <img src="/logo.png" alt="Zexo Logo" style={{ width: '28px', height: '28px', marginRight: '10px', objectFit: 'contain' }} />
          <span className="nav-logo-static">Zexo&nbsp;</span>
          <span style={{ color: '#0c8665' }}>
            <RotatingText texts={["Agency", "Agency"]} />
          </span>
        </a>
        <div className="nav-actions">
          <a href="tel:+966598369616" className="btn-call" aria-label="Call Zexo Agency">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="btn-call-text">Call</span>
          </a>
          <button className="btn-primary" onClick={() => window.open("https://www.zexoagency.com", "_blank")}>Website</button>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Turning <span className="highlight">Ideas</span> Into<br />Digital Reality</h1>
          <p className="hero-subtitle">We craft bold, meaningful digital experiences that help brands grow.</p>
          <div className="hero-buttons">
            <a
              href="https://wa.me/966598369616?text=Hi%2C%20I%20came%20across%20Zexo%20Agency%20and%20I%E2%80%99m%20interested%20in%20learning%20more%20about%20your%20services.%20We%E2%80%99re%20looking%20for%20a%20reliable%20team%20to%20help%20bring%20our%20project%20to%20life.%20Could%20you%20share%20more%20details%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
            <a href="mailto:info@zexoagency.com" className="btn-mail">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              Mail Us
            </a>
          </div>
        </div>
        {!isMobile && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#0c8665"
              raysSpeed={1.2}
              lightSpread={0.7}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.12}
              noiseAmount={0.08}
              distortion={0.04}
              saturation={1}
              fadeDistance={1.1}
              className="hero-light-rays"
            />
          </div>
        )}
      </section>

      {/* ───── Website Projects ───── */}
      <section className="portfolio">
        <h2 className="portfolio-title">Our Website Projects</h2>
        <div className="portfolio-grid">
          {projectsData.map((project, index) => {
            const isActive = activeProject === index;
            return (
              <div
                className={`project-card${isActive ? " active" : ""}`}
                key={`web-${index}`}
                style={{ background: project.bg }}
                onClick={() => setActiveProject(isActive ? null : index)}
              >
                {isActive && (
                  <button
                    className="project-card-close"
                    aria-label="Close full image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveProject(null);
                    }}
                  >
                    ✕
                  </button>
                )}
                <img src={project.image} alt={project.title} className="project-card-img" loading="lazy" />
                <div className="project-card-info">
                  <div className="project-card-title">{project.title}</div>
                  <div className="project-card-tag">{project.tag}</div>
                </div>
                <div className="project-card-badge">{project.badge}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───── Social Media Projects ───── */}
      <section className="portfolio">
        <div className="section-header">
          <div className="section-title-row">
            <h2 className="portfolio-title" style={{ marginBottom: 0 }}>Social Media Projects</h2>
            <div className="dot-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div className="dot" key={i} />
              ))}
            </div>
          </div>
        </div>
        <div className="portfolio-grid">
          {socialMediaData.map((project, index) => (
            <div className="social-card" key={`social-${index}`} style={{ background: project.bg }}>
              <div className="social-card-thumb" style={{ background: project.bg }}>
                <div className="social-card-stack-wrap">
                  <Stack
                    cards={project.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${project.title}-${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ))}
                  />
                </div>
              </div>
              <div className="social-card-body">
                <div className="social-card-title">{project.title}</div>
                <div className="social-card-desc">Social Media Projects</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Logo Designs ───── */}
      <section className="image-trail-section">
        <div className="section-header">
          <div className="section-title-row">
            <h2 className="portfolio-title" style={{ marginBottom: 0 }}>Logo Designs</h2>
            <div className="dot-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div className="dot" key={i} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          {isMobile ? (
            /* Touch-friendly static grid — cursor-trail effects don't work on touch screens,
               so mobile users get a clean, always-visible grid of every logo instead. */
            <div className="logo-grid-wrapper">
              <div className="logo-grid">
                {imageTrailItems.map((src, i) => (
                  <div className="logo-grid-item" key={i}>
                    <img src={src} alt={`Logo design ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="image-trail-wrapper">
              <ImageTrail
                items={imageTrailItems}
                variant={2}
              />
            </div>
          )}

          {/* ───── Falling Text Integrated Here ───── */}
          <div style={{ width: '100%', height: isMobile ? '200px' : '300px', marginTop: '20px' }}>
            <FallingText
              text="Zexo Agency Your Digital Growth Partner"
              highlightWords={["Zexo", "Growth", "Partner"]}
              highlightClass="falling-highlight"
              trigger="scroll"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.56}
              fontSize="clamp(1.3rem, 5.5vw, 2.5rem)"
              mouseConstraintStiffness={0.9}
            />
          </div>

          {!isMobile && (
            <div className="image-trail-hint">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
              </svg>
              Move your cursor to explore
            </div>
          )}
        </div>
      </section>

      {/* ───── Upcoming Projects ───── */}
      <section className="upcoming-projects">
        <div className="section-header">
          <div className="section-title-row">
            <h2 className="portfolio-title" style={{ marginBottom: 0 }}>Upcoming Projects</h2>
            <div className="dot-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div className="dot" key={i} />
              ))}
            </div>
          </div>
        </div>
        <p className="upcoming-subtitle">A look at what we&rsquo;re building next.</p>
        <div className="upcoming-grid">
          {upcomingProjectsData.map((project, index) => (
            <div className="upcoming-card" key={`upcoming-${index}`}>
              <img src={project.image} alt={project.title} />
              <div className="upcoming-card-badge">{project.tag}</div>
              <div className="upcoming-card-overlay">
                <div className="upcoming-card-tag">{project.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Company Brochure (NEW — placed right after Upcoming Projects) ───── */}
      <section className="brochure-section">
        <div className="section-header">
          <div className="section-title-row">
            <h2 className="portfolio-title" style={{ marginBottom: 0 }}>Company Brochure</h2>
            <div className="dot-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div className="dot" key={i} />
              ))}
            </div>
          </div>
        </div>
        <p className="brochure-subtitle">Tap a file to open the PDF in a new tab.</p>
        <div className="brochure-grid">
          {brochuresData.map((item, index) => (
            <div className="brochure-card-wrap" key={`brochure-${index}`}>
              <a
                className="brochure-card"
                href={item.file}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.title} PDF`}
              >
                <div className="brochure-folder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="brochure-pdf-tag">PDF</span>
                </div>
              </a>
              <div className="brochure-caption">
                <div className="brochure-caption-title">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <img src="/logo.png" alt="Zexo Logo" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
              Zexo&nbsp;<span>Agency</span>
            </div>
            <p className="footer-tagline">Turning ideas into digital reality.</p>
          </div>

          <div className="footer-social">
            <a
              href="https://www.instagram.com/zexoagency?igsh=bm4yb2ZjYmNrenB6"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-instagram"
              aria-label="Zexo Agency on Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Zexo Agency. All rights reserved.
        </div>
      </footer>
    </>
  );
}