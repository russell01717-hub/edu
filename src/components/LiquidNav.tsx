"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface LiquidNavItem {
  href: string;
  label: string;
  icon: string;
}

export function LiquidNav({
  items = [],
  brand = "Akademiya",
  brandMark = "A",
  dark: controlledDark,
  onToggleDark,
  right,
}: {
  items?: LiquidNavItem[];
  brand?: string;
  brandMark?: string;
  dark?: boolean;
  onToggleDark?: () => void;
  right?: React.ReactNode;
}) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [mounted, setMounted] = useState(false);
  const [innerDark, setInnerDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInnerDark(document.documentElement.classList.contains("dark"));
  }, []);

  const isDark = controlledDark ?? innerDark;

  const updatePill = useCallback((smooth = true) => {
    if (!pillRef.current) return;
    const active = document.querySelector(".liquid-nav-btn.active") as HTMLElement | null;
    if (!active) { pillRef.current.style.width = "0px"; return; }
    pillRef.current.style.transition = smooth
      ? "transform .5s cubic-bezier(.34,1.2,.64,1), width .5s cubic-bezier(.34,1.2,.64,1)"
      : "none";
    pillRef.current.style.width = `${active.offsetWidth}px`;
    pillRef.current.style.transform = `translateX(${active.offsetLeft}px)`;
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => updatePill(false));
    const timer = setTimeout(() => updatePill(true), 100);
    return () => clearTimeout(timer);
  }, [pathname, updatePill, items]);

  useEffect(() => {
    const onResize = () => updatePill(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updatePill]);

  const handleNavHover = useCallback((e: React.MouseEvent) => {
    const rect = navRef.current?.getBoundingClientRect();
    if (!rect) return;
    const glare = navRef.current?.querySelector(".liquid-glare") as HTMLElement | null;
    if (!glare) return;
    glare.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    glare.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem("dark", next.toString());
    setInnerDark(next);
    if (onToggleDark) onToggleDark();
    requestAnimationFrame(() => updatePill());
  }, [onToggleDark, updatePill]);

  const setRef = useCallback((href: string, el: HTMLAnchorElement | null) => {
    if (el) itemsRef.current.set(href, el);
    else itemsRef.current.delete(href);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <div className="liquid-bg-mesh" aria-hidden="true">
        <div className="liquid-blob liquid-blob-1" />
        <div className="liquid-blob liquid-blob-2" />
        <div className="liquid-blob liquid-blob-3" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}>
            <span className="text-white font-bold text-sm">{brandMark}</span>
          </div>
          <span className="font-bold text-xl" style={{ background: "linear-gradient(135deg, #f97316, #ea580c, #fdba74)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {brand}
          </span>
        </Link>

        {items.length > 0 && (
          <nav
            ref={navRef}
            className="liquid-nav"
            onMouseMove={handleNavHover}
            onMouseLeave={() => { const g = navRef.current?.querySelector(".liquid-glare") as HTMLElement | null; if (g) g.style.opacity = "0"; }}
            onMouseEnter={() => { const g = navRef.current?.querySelector(".liquid-glare") as HTMLElement | null; if (g) g.style.opacity = "1"; }}
          >
            <div className="liquid-glare-container">
              <div className="liquid-glare" />
            </div>

            <div className="liquid-nav-items">
              <div ref={pillRef} className="liquid-active-pill" />
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => setRef(item.href, el)}
                  className={`liquid-nav-btn ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => requestAnimationFrame(() => updatePill())}
                >
                  <div className="liquid-btn-content">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="liquid-divider" />

            <button className="liquid-theme-btn" onClick={toggleTheme} aria-label="Dark mode">
              <div className="liquid-theme-icon-wrapper">
                <svg className="liquid-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <svg className="liquid-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
            </button>
          </nav>
        )}

        <div className="flex items-center gap-3 z-10">{right}</div>
      </div>
    </>
  );
}
