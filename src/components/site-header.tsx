"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./site-header.css";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  match: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: "⌂",
    match: (p) => p === "/",
  },
  {
    href: "/mental-wellbeing",
    label: "Wellbeing",
    icon: "◉",
    match: (p) => p.startsWith("/mental-wellbeing"),
  },
  {
    href: "/mental-wellbeing/screening",
    label: "Screening",
    icon: "◈",
    match: (p) => p.startsWith("/mental-wellbeing/screening"),
  },
  {
    href: "/account",
    label: "Account",
    icon: "○",
    match: (p) => p.startsWith("/account"),
  },
];

export default function SiteHeader({
  initialSignedIn = false,
}: {
  initialSignedIn?: boolean;
}) {
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(initialSignedIn);

  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // On mobile the "Account" tab becomes "Sign in" when logged out.
  const mobileItems = NAV_ITEMS.map((item) => {
    if (item.href === "/account" && !signedIn) {
      return {
        ...item,
        href: "/login",
        label: "Sign in",
        icon: "→",
        match: (p: string) => p === "/login" || p === "/register",
      };
    }
    return item;
  });

  return (
    <>
      <header className="pafupi-header">
        <div className="pafupi-header-inner">
          <Link href="/" className="pafupi-brand">
            <span className="pafupi-brand-symbol">p</span>
            <span className="pafupi-brand-name">
              pafupi<span>.</span>
            </span>
          </Link>

          <nav className="pafupi-navigation" aria-label="Main">
            <Link
              href="/"
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/mental-wellbeing"
              className={`nav-link ${
                pathname.startsWith("/mental-wellbeing") &&
                !pathname.startsWith("/mental-wellbeing/screening")
                  ? "active"
                  : ""
              }`}
            >
              Wellbeing
            </Link>
            <Link
              href="/mental-wellbeing/screening"
              className={`nav-link ${
                pathname.startsWith("/mental-wellbeing/screening")
                  ? "active"
                  : ""
              }`}
            >
              Screening
            </Link>
            <Link
              href="/privacy"
              className={`nav-link ${
                pathname.startsWith("/privacy") ? "active" : ""
              }`}
            >
              Privacy
            </Link>

            {signedIn ? (
              <Link href="/account" className="nav-cta">
                Your account
              </Link>
            ) : (
              <Link href="/login" className="nav-cta">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <nav className="pafupi-bottom-nav" aria-label="Main">
        {mobileItems.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pafupi-bottom-nav-item ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="pafupi-bottom-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}