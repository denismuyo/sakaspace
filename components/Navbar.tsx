"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Auth state ─────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push("/");
  }

  const navLinks = [
    { href: "/listings", label: "Explore Listings" },
    { href: "/submit", label: "Submit Property" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string)
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "#1A4D8F",
        boxShadow: "0 2px 20px rgba(26,77,143,0.35)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{
                backgroundColor: "#0FAF7F",
                boxShadow: "0 3px 10px rgba(15,175,127,0.45)",
              }}
            >
              <span className="text-white font-black text-base">S</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight hidden sm:block">
              SakaSpace
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold transition-colors"
                style={{
                  color: pathname === link.href ? "white" : "#bfdbfe",
                  borderBottom:
                    pathname === link.href
                      ? "2px solid #0FAF7F"
                      : "2px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth section */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
                    style={{ backgroundColor: "#0FAF7F" }}
                  >
                    {initials}
                  </div>
                  <svg
                    className="w-4 h-4 text-blue-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      transform: userMenuOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl border overflow-hidden"
                    style={{ backgroundColor: "white", borderColor: "#f1f5f9" }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: "#f1f5f9" }}>
                      <p className="text-xs font-black text-slate-900 truncate">
                        {user.user_metadata?.full_name ?? "My Account"}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-1.5">
                      {[
                        { href: "/dashboard", label: "Dashboard" },
                        { href: "/submit", label: "Submit Property" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-1"
                        style={{ color: "#ef4444" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor =
                            "rgba(239,68,68,0.08)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.backgroundColor =
                            "transparent")
                        }
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-blue-200 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-black transition-colors hover:bg-blue-50"
                  style={{
                    backgroundColor: "white",
                    color: "#1A4D8F",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden pb-4 border-t pt-3 space-y-1"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  color: pathname === link.href ? "white" : "#bfdbfe",
                  backgroundColor:
                    pathname === link.href
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div
                  className="px-3 py-2 text-xs text-blue-300 font-medium border-t mt-2 pt-3"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  {user.user_metadata?.full_name ?? user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div
                className="flex gap-2 pt-3 border-t"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-bold text-white border border-white/20"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-black"
                  style={{ backgroundColor: "#0FAF7F", color: "white" }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
