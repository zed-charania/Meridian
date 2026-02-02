"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Reveal on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          element.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, []);

  const toggleFaq = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isActive = element.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    if (!isActive) {
      element.classList.add('active');
    }
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-primary: #FDFCFB;
          --bg-secondary: #F8F6F3;
          --bg-tertiary: #F3F0EB;
          --white: #FFFFFF;
          --dark: #1A1815;
          --dark-secondary: #2D2A26;
          --text-primary: #1A1815;
          --text-secondary: #5C5854;
          --text-tertiary: #8A857E;
          --border-light: rgba(26, 24, 21, 0.08);
          --border-medium: rgba(26, 24, 21, 0.12);
          --accent-gold: #B8965A;
          --accent-gold-light: #D4B87A;
          --success: #4A7C59;
          --error: #9B4B4B;
          --shadow-sm: 0 1px 2px rgba(26, 24, 21, 0.04);
          --shadow-md: 0 4px 12px rgba(26, 24, 21, 0.06);
          --shadow-lg: 0 12px 40px rgba(26, 24, 21, 0.08);
          --shadow-xl: 0 24px 64px rgba(26, 24, 21, 0.12);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        .lp-header {
          padding: 20px 48px;
          background: rgba(253, 252, 251, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        .lp-header.scrolled {
          padding: 16px 48px;
          box-shadow: var(--shadow-sm);
        }

        .lp-logo {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-gold);
          font-size: 14px;
        }

        .lp-nav {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .lp-nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
        }
        .lp-nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--text-primary);
          transition: width 0.3s ease;
        }
        .lp-nav-link:hover { color: var(--text-primary); }
        .lp-nav-link:hover::after { width: 100%; }

        .lp-header-cta {
          padding: 12px 28px;
          background: var(--dark);
          color: white;
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .lp-header-cta:hover {
          background: var(--dark-secondary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .lp-hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 140px 48px 100px;
          position: relative;
          overflow: hidden;
        }
        .lp-hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(184, 150, 90, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-hero::after {
          content: '';
          position: absolute;
          bottom: -20%;
          left: -10%;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, rgba(184, 150, 90, 0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .lp-hero-content {
          max-width: 900px;
          position: relative;
          z-index: 1;
        }

        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-tertiary);
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
        }
        .lp-hero-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          background: var(--accent-gold);
          border-radius: 50%;
        }

        .lp-hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(48px, 7vw, 80px);
          font-weight: 500;
          letter-spacing: -2px;
          line-height: 1.05;
          margin-bottom: 28px;
          font-feature-settings: "liga" 0;
          -webkit-font-feature-settings: "liga" 0;
        }
        .lp-hero h1 .highlight {
          color: var(--accent-gold);
          font-feature-settings: "liga" 0, "kern" 0;
          -webkit-font-feature-settings: "liga" 0, "kern" 0;
          letter-spacing: 0.05em;
        }

        .lp-hero-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 48px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .lp-cta-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .lp-cta-primary {
          padding: 18px 48px;
          background: var(--dark);
          color: white;
          border: none;
          border-radius: 100px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .lp-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(26, 24, 21, 0.2);
        }

        .lp-hero-note {
          font-size: 13px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lp-hero-note svg { width: 16px; height: 16px; color: var(--success); }

        .lp-hero-trust {
          margin-top: 80px;
          padding-top: 40px;
          border-top: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
        }
        .lp-trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-tertiary);
        }
        .lp-trust-item svg { width: 20px; height: 20px; color: var(--accent-gold); }

        .lp-stats {
          background: var(--dark);
          padding: 80px 48px;
          position: relative;
          overflow: hidden;
        }
        .lp-stats::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(184, 150, 90, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .lp-stats-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          position: relative;
          z-index: 1;
        }
        .lp-stat-item {
          text-align: center;
          padding: 32px;
          position: relative;
        }
        .lp-stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 60%;
          background: rgba(255, 255, 255, 0.1);
        }
        .lp-stat-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 56px;
          font-weight: 500;
          letter-spacing: -2px;
          margin-bottom: 8px;
          color: white;
          font-feature-settings: "liga" 0;
          -webkit-font-feature-settings: "liga" 0;
        }
        .lp-stat-number .accent { color: var(--accent-gold); }
        .lp-stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        .lp-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 140px 48px;
        }
        .lp-section-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .lp-section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-tertiary);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-tertiary);
          margin-bottom: 24px;
        }
        .lp-section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 500;
          letter-spacing: -1px;
          margin-bottom: 16px;
          font-feature-settings: "liga" 0;
          -webkit-font-feature-settings: "liga" 0;
        }
        .lp-section-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          font-weight: 400;
          max-width: 500px;
          margin: 0 auto;
        }

        .lp-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .lp-step {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lp-step:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: transparent;
        }
        .lp-step-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          position: relative;
        }
        .lp-step-icon svg { width: 32px; height: 32px; color: var(--dark); }
        .lp-step-number {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 28px;
          height: 28px;
          background: var(--dark);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }
        .lp-step-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .lp-step-description {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .lp-comparison {
          background: var(--bg-secondary);
          padding: 140px 48px;
        }
        .lp-comparison-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .lp-comparison-table {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 24px;
          overflow: visible;
          box-shadow: var(--shadow-lg);
          margin-top: 80px;
        }
        .lp-comparison-table .lp-comparison-header {
          border-radius: 24px 24px 0 0;
          overflow: visible;
        }
        .lp-comparison-table .lp-comparison-row:last-child {
          border-radius: 0 0 24px 24px;
          overflow: hidden;
        }
        .lp-comparison-header {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          border-bottom: 1px solid var(--border-light);
        }
        .lp-comparison-header-cell {
          padding: 28px 24px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: var(--text-secondary);
          border-right: 1px solid var(--border-light);
        }
        .lp-comparison-header-cell:last-child { border-right: none; }
        .lp-comparison-header-cell.highlight {
          background: var(--dark);
          color: white;
          position: relative;
        }
        .lp-comparison-header-cell.highlight::before {
          content: 'Recommended';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--accent-gold);
          color: var(--dark);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 5px 14px;
          border-radius: 100px;
          white-space: nowrap;
          z-index: 10;
        }
        .lp-comparison-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1fr;
          border-bottom: 1px solid var(--border-light);
        }
        .lp-comparison-row:last-child { border-bottom: none; }
        .lp-comparison-cell {
          padding: 24px;
          text-align: center;
          font-size: 14px;
          border-right: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .lp-comparison-cell:first-child {
          justify-content: flex-start;
          font-weight: 500;
          color: var(--text-primary);
        }
        .lp-comparison-cell:last-child { border-right: none; }
        .lp-comparison-cell.highlight {
          background: var(--bg-primary);
          font-weight: 600;
          color: var(--text-primary);
        }
        .lp-check {
          width: 24px;
          height: 24px;
          background: rgba(74, 124, 89, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--success);
        }
        .lp-cross {
          width: 24px;
          height: 24px;
          background: rgba(155, 75, 75, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--error);
        }

        .lp-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 64px;
        }
        .lp-testimonial {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 20px;
          padding: 40px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .lp-testimonial:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: transparent;
        }
        .lp-testimonial-quote {
          position: absolute;
          top: 32px;
          right: 40px;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 72px;
          color: var(--bg-tertiary);
          line-height: 1;
        }
        .lp-testimonial-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
        }
        .lp-testimonial-stars svg {
          width: 18px;
          height: 18px;
          color: var(--accent-gold);
          fill: var(--accent-gold);
        }
        .lp-testimonial-text {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        .lp-testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .lp-testimonial-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          color: var(--text-secondary);
        }
        .lp-testimonial-name {
          font-weight: 600;
          font-size: 15px;
          margin-bottom: 2px;
        }
        .lp-testimonial-role {
          font-size: 13px;
          color: var(--text-tertiary);
        }

        .lp-faq {
          background: var(--bg-secondary);
          padding: 140px 48px;
        }
        .lp-faq-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .lp-faq-grid { margin-top: 64px; }
        .faq-item {
          background: var(--white);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-item:hover { border-color: var(--border-medium); }
        .faq-item.active {
          border-color: var(--dark);
          box-shadow: var(--shadow-md);
        }
        .lp-faq-question {
          padding: 24px 28px;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lp-faq-icon {
          width: 32px;
          height: 32px;
          background: var(--bg-tertiary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .faq-item.active .lp-faq-icon {
          background: var(--dark);
          color: white;
          transform: rotate(45deg);
        }
        .lp-faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faq-item.active .lp-faq-answer { max-height: 300px; }
        .lp-faq-answer-content {
          padding: 0 28px 28px;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.8;
        }

        .lp-final-cta {
          padding: 160px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .lp-final-cta::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(184, 150, 90, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-final-cta-content {
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .lp-final-cta h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 5vw, 52px);
          font-weight: 500;
          letter-spacing: -1px;
          margin-bottom: 20px;
          font-feature-settings: "liga" 0;
          -webkit-font-feature-settings: "liga" 0;
        }
        .lp-final-cta p {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 40px;
          line-height: 1.7;
        }

        .lp-footer {
          background: var(--dark);
          padding: 80px 48px 48px;
          color: white;
        }
        .lp-footer-content { max-width: 1200px; margin: 0 auto; }
        .lp-footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 48px;
        }
        .lp-footer-brand { max-width: 300px; }
        .lp-footer-logo {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lp-footer-logo-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-gold);
          font-size: 14px;
        }
        .lp-footer-tagline {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.7;
        }
        .lp-footer-links {
          display: flex;
          gap: 80px;
        }
        .lp-footer-column h4 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 20px;
          font-weight: 600;
        }
        .lp-footer-column a {
          display: block;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 12px;
          transition: color 0.2s ease;
        }
        .lp-footer-column a:hover { color: white; }
        .lp-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lp-footer-copyright {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
        }
        .lp-footer-legal {
          display: flex;
          gap: 24px;
        }
        .lp-footer-legal a {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .lp-footer-legal a:hover { color: rgba(255, 255, 255, 0.8); }

        @media (max-width: 1024px) {
          .lp-header { padding: 16px 24px; }
          .lp-nav { display: none; }
          .lp-hero { padding: 120px 24px 80px; }
          .lp-stats-grid, .lp-steps, .lp-testimonials-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .lp-stat-item:not(:last-child)::after { display: none; }
          .lp-comparison-header, .lp-comparison-row { grid-template-columns: 1fr; }
          .lp-comparison-header-cell, .lp-comparison-cell {
            border-right: none;
            border-bottom: 1px solid var(--border-light);
          }
          .lp-comparison-header-cell:first-child, .lp-comparison-cell:first-child { display: none; }
          .lp-hero-trust { flex-direction: column; gap: 24px; }
          .lp-footer-top { flex-direction: column; gap: 48px; }
          .lp-footer-links { flex-direction: column; gap: 40px; }
          .lp-footer-bottom { flex-direction: column; gap: 24px; text-align: center; }
        }

        @media (max-width: 640px) {
          .lp-hero h1 { font-size: 36px; letter-spacing: -1px; }
          .lp-hero-subtitle { font-size: 16px; }
          .lp-cta-primary {
            padding: 16px 32px;
            font-size: 15px;
            width: 100%;
            justify-content: center;
          }
          .lp-section-title { font-size: 32px; }
          .lp-step, .lp-testimonial, .faq-item { padding: 32px 24px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className={`lp-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="lp-logo">
          <div className="lp-logo-icon">◆</div>
          Meridian
        </div>
        <nav className="lp-nav">
          <a href="#how-it-works" className="lp-nav-link">How It Works</a>
          <a href="#pricing" className="lp-nav-link">Pricing</a>
          <a href="#testimonials" className="lp-nav-link">Testimonials</a>
          <a href="#faq" className="lp-nav-link">FAQ</a>
        </nav>
        <Link href="/form" className="lp-header-cta">
          Return to my application
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-hero-badge reveal">N-400 Citizenship Application</div>
          <h1 className="reveal reveal-delay-1">Your path to citizenship,<br/><span className="highlight">simplified.</span></h1>
          <p className="lp-hero-subtitle reveal reveal-delay-2">
            Complete your N-400 application in 45 minutes with our guided assistant.
            No legal jargon. No confusion. Just a perfectly completed form.
          </p>
          <div className="lp-cta-group reveal reveal-delay-3">
            <Link href="/form" className="lp-cta-primary">
              Return to my application
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <p className="lp-hero-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              One-time fee · No hidden costs · Instant download
            </p>
          </div>
          <div className="lp-hero-trust reveal reveal-delay-4">
            <div className="lp-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Bank-level encryption
            </div>
            <div className="lp-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              USCIS compliant
            </div>
            <div className="lp-trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Money-back guarantee
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="lp-stats" id="pricing">
        <div className="lp-stats-grid">
          <div className="lp-stat-item reveal">
            <div className="lp-stat-number">45<span className="accent">min</span></div>
            <div className="lp-stat-label">Average completion time</div>
          </div>
          <div className="lp-stat-item reveal reveal-delay-1">
            <div className="lp-stat-number"><span className="accent">$</span>249</div>
            <div className="lp-stat-label">vs $2,500+ for lawyers</div>
          </div>
          <div className="lp-stat-item reveal reveal-delay-2">
            <div className="lp-stat-number">750<span className="accent">K</span></div>
            <div className="lp-stat-label">Applications filed yearly</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="lp-section" id="how-it-works">
        <div className="lp-section-header">
          <div className="lp-section-badge reveal">How It Works</div>
          <h2 className="lp-section-title reveal reveal-delay-1">Three simple steps to citizenship.</h2>
          <p className="lp-section-subtitle reveal reveal-delay-2">We guide you through the entire N-400 application process</p>
        </div>

        <div className="lp-steps">
          <div className="lp-step reveal">
            <div className="lp-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <div className="lp-step-number">1</div>
            </div>
            <div className="lp-step-title">Answer questions</div>
            <div className="lp-step-description">
              We translate confusing legal language into plain English. Just answer simple questions about your background.
            </div>
          </div>
          <div className="lp-step reveal reveal-delay-1">
            <div className="lp-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <div className="lp-step-number">2</div>
            </div>
            <div className="lp-step-title">We generate your form</div>
            <div className="lp-step-description">
              Your answers automatically fill out the official N-400 form. No manual PDF filling. No mistakes.
            </div>
          </div>
          <div className="lp-step reveal reveal-delay-2">
            <div className="lp-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <div className="lp-step-number">3</div>
            </div>
            <div className="lp-step-title">File with USCIS</div>
            <div className="lp-step-description">
              Download your completed form with instructions on how to submit it to USCIS. You&apos;re ready to become a citizen.
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="lp-comparison">
        <div className="lp-comparison-container">
          <div className="lp-section-header">
            <div className="lp-section-badge reveal">Comparison</div>
            <h2 className="lp-section-title reveal reveal-delay-1">Why choose Meridian?</h2>
            <p className="lp-section-subtitle reveal reveal-delay-2">See how we compare to other options</p>
          </div>

          <div className="lp-comparison-table reveal reveal-delay-3">
            <div className="lp-comparison-header">
              <div className="lp-comparison-header-cell"></div>
              <div className="lp-comparison-header-cell">DIY (Free)</div>
              <div className="lp-comparison-header-cell highlight">Meridian</div>
              <div className="lp-comparison-header-cell">Immigration Lawyer</div>
            </div>
            <div className="lp-comparison-row">
              <div className="lp-comparison-cell">Time to complete</div>
              <div className="lp-comparison-cell">8-10 hours</div>
              <div className="lp-comparison-cell highlight"><strong>45 minutes</strong></div>
              <div className="lp-comparison-cell">2-3 hours</div>
            </div>
            <div className="lp-comparison-row">
              <div className="lp-comparison-cell">Cost</div>
              <div className="lp-comparison-cell">$0</div>
              <div className="lp-comparison-cell highlight"><strong>$249</strong></div>
              <div className="lp-comparison-cell">$2,500+</div>
            </div>
            <div className="lp-comparison-row">
              <div className="lp-comparison-cell">Plain English guidance</div>
              <div className="lp-comparison-cell"><span className="lp-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></span></div>
              <div className="lp-comparison-cell highlight"><span className="lp-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span></div>
              <div className="lp-comparison-cell"><span className="lp-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span></div>
            </div>
            <div className="lp-comparison-row">
              <div className="lp-comparison-cell">Error checking</div>
              <div className="lp-comparison-cell"><span className="lp-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></span></div>
              <div className="lp-comparison-cell highlight"><span className="lp-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span></div>
              <div className="lp-comparison-cell"><span className="lp-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span></div>
            </div>
            <div className="lp-comparison-row">
              <div className="lp-comparison-cell">Instant delivery</div>
              <div className="lp-comparison-cell"><span className="lp-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></span></div>
              <div className="lp-comparison-cell highlight"><span className="lp-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></span></div>
              <div className="lp-comparison-cell"><span className="lp-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="lp-section" id="testimonials">
        <div className="lp-section-header">
          <div className="lp-section-badge reveal">Testimonials</div>
          <h2 className="lp-section-title reveal reveal-delay-1">Trusted by hundreds of applicants.</h2>
          <p className="lp-section-subtitle reveal reveal-delay-2">See what our customers have to say</p>
        </div>

        <div className="lp-testimonials-grid">
          {[
            { initials: "MR", name: "Maria Rodriguez", role: "Became citizen in 2025", text: "I was dreading filling out the N-400 for months. Meridian made it so simple. Answered questions in my lunch break and had my completed form the same day." },
            { initials: "JP", name: "James Park", role: "Became citizen in 2025", text: "Saved me $2,000 on lawyer fees. The questions were clear, the process was fast, and I had confidence my form was filled out correctly." },
            { initials: "AL", name: "Ana Lopez", role: "Became citizen in 2026", text: "As someone who's not great with paperwork, this was a lifesaver. No confusing government language, just straightforward questions." },
            { initials: "DT", name: "David Tran", role: "Became citizen in 2026", text: "The peace of mind knowing my N-400 was filled out correctly was worth every penny. Highly recommend for anyone pursuing citizenship." },
          ].map((testimonial, i) => (
            <div key={i} className={`lp-testimonial reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}>
              <div className="lp-testimonial-quote">&ldquo;</div>
              <div className="lp-testimonial-stars">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p className="lp-testimonial-text">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar">{testimonial.initials}</div>
                <div>
                  <div className="lp-testimonial-name">{testimonial.name}</div>
                  <div className="lp-testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-faq" id="faq">
        <div className="lp-faq-container">
          <div className="lp-section-header">
            <div className="lp-section-badge reveal">FAQ</div>
            <h2 className="lp-section-title reveal reveal-delay-1">Common questions.</h2>
            <p className="lp-section-subtitle reveal reveal-delay-2">Everything you need to know</p>
          </div>

          <div className="lp-faq-grid">
            {[
              { q: "Do I need a lawyer to file my N-400?", a: "No. Most people can successfully file their N-400 without a lawyer. Meridian helps you complete the form correctly so you can file it yourself and save thousands in legal fees." },
              { q: "Is Meridian affiliated with USCIS?", a: "No. Meridian is an independent service that helps you complete your N-400 application. We are not affiliated with or endorsed by USCIS." },
              { q: "How long does it take to complete?", a: "Most people complete their N-400 in 45 minutes or less. You can save your progress and return anytime." },
              { q: "What if I make a mistake?", a: "Our system checks for common errors and inconsistencies before generating your form. If you discover an error after download, you can return and generate a corrected version." },
              { q: "Is my information secure?", a: "Yes. All information is encrypted and stored securely with bank-level security. We never share your data with third parties." },
            ].map((faq, i) => (
              <div key={i} className={`faq-item reveal ${i > 0 ? `reveal-delay-${i}` : ''}`} onClick={toggleFaq}>
                <div className="lp-faq-question">
                  {faq.q}
                  <span className="lp-faq-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </span>
                </div>
                <div className="lp-faq-answer">
                  <div className="lp-faq-answer-content">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-final-cta">
        <div className="lp-final-cta-content">
          <h2 className="reveal">Start your citizenship journey today.</h2>
          <p className="reveal reveal-delay-1">Join hundreds of applicants who&apos;ve successfully obtained citizenship using Meridian.</p>
          <div className="lp-cta-group reveal reveal-delay-2">
            <Link href="/form" className="lp-cta-primary">
              Return to my application
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <p className="lp-hero-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-content">
          <div className="lp-footer-top">
            <div className="lp-footer-brand">
              <div className="lp-footer-logo">
                <div className="lp-footer-logo-icon">◆</div>
                Meridian
              </div>
              <p className="lp-footer-tagline">
                Simplifying the path to U.S. citizenship with technology and clear guidance.
              </p>
            </div>
            <div className="lp-footer-links">
              <div className="lp-footer-column">
                <h4>Product</h4>
                <a href="#how-it-works">How It Works</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="lp-footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Contact</a>
                <a href="#">Support</a>
              </div>
              <div className="lp-footer-column">
                <h4>Legal</h4>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p className="lp-footer-copyright">© 2026 Meridian. Not affiliated with USCIS.</p>
            <div className="lp-footer-legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
    </div>
      </footer>
    </>
  );
}
