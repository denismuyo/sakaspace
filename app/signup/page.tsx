"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import type { User } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Property {
  id: string;
  title: string;
  price: number;
  type: string;
  county?: string;
  town?: string;
  location: string;
  beds?: number;
  baths?: number;
  size?: string;
  status: "pending" | "verified" | "rejected";
  trust_score?: number;
  image_url?: string;
  created_at: string;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  verified: {
    label: "Verified",
    color: "#0FAF7F",
    bg: "rgba(15,175,127,0.1)",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  pending: {
    label: "Under Review",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
  },
  rejected: {
    label: "Rejected",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

// ─── Property Row Card ────────────────────────────────────────────────────────

function PropertyRow({ property }: { property: Property }) {
  const status = STATUS_CONFIG[property.status] ?? STATUS_CONFIG.pending;
  const location =
    [property.town, property.county].filter(Boolean).join(", ") ||
    property.location;

  const gradients: Record<string, string> = {
    apartment: "linear-gradient(135deg, #1A4D8F, #0d3a7a)",
    villa: "linear-gradient(135deg, #0FAF7F, #059669)",
    studio: "linear-gradient(135deg, #312e81, #4338ca)",
    townhouse: "linear-gradient(135deg, #164e63, #0e7490)",
    mansion: "linear-gradient(135deg, #1e3a8a, #1A4D8F)",
    bedsitter: "linear-gradient(135deg, #0a2d5e, #1A4D8F)",
    land: "linear-gradient(135deg, #713f12, #a16207)",
    commercial: "linear-gradient(135deg, #1f2937, #374151)",
  };
  const gradient =
    gradients[property.type?.toLowerCase()] ?? gradients.apartment;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-stretch">
        {/* Image thumbnail */}
        <div
          className="w-28 sm:w-36 shrink-0 flex items-center justify-center relative"
          style={
            property.image_url
              ? { backgroundImage: `url(${property.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: gradient }
          }
        >
          {!property.image_url && (
            <svg className="w-10 h-10 opacity-20" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="1.5" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-slate-900 text-base truncate">
                  {property.title}
                </h3>
                {/* Status badge */}
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0"
                  style={{ color: status.color, backgroundColor: status.bg }}
                >
                  {status.icon}
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-xs text-slate-500 font-medium">{location}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="font-black text-slate-900 text-lg leading-none">
                KES {Number(property.price).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">{property.type}</p>
            </div>
          </div>

          {/* Specs + actions row */}
          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <div className="flex gap-4">
              {property.beds != null && (
                <span className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">{property.beds}</span> bd
                </span>
              )}
              {property.baths != null && (
                <span className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">{property.baths}</span> ba
                </span>
              )}
              {property.size && (
                <span className="text-xs text-slate-500">{property.size}</span>
              )}
              <span className="text-xs text-slate-400">
                {new Date(property.created_at).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {property.status === "verified" && (
                <Link
                  href={`/property/${property.id}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: "#0FAF7F", backgroundColor: "rgba(15,175,127,0.1)" }}
                >
                  View Live →
                </Link>
              )}
              {property.status === "rejected" && (
                <span className="text-xs text-slate-400 italic">
                  Contact support for details
                </span>
              )}
              {property.status === "pending" && (
                <span className="text-xs text-slate-400">
                  Review in progress…
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}14` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");

  // ── Auth ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setUser(session.user);
        setAuthLoading(false);
      }
    });
  }, [router]);

  // ── Fetch properties ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    async function fetchProperties() {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      setProperties((data as Property[]) ?? []);
      setPropsLoading(false);
    }

    fetchProperties();
  }, [user]);

  // ── Sign out ───────────────────────────────────────────────────────────────
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = {
    total: properties.length,
    verified: properties.filter((p) => p.status === "verified").length,
    pending: properties.filter((p) => p.status === "pending").length,
    rejected: properties.filter((p) => p.status === "rejected").length,
  };

  const filtered =
    filter === "all" ? properties : properties.filter((p) => p.status === filter);

  // ── Auth loading ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      <Navbar />

      {/* Header */}
      <div
        className="py-10 px-4"
        style={{
          background: "linear-gradient(135deg, #1A4D8F 0%, #0d3a7a 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#0FAF7F" }}>
              My Account
            </p>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {user?.user_metadata?.full_name
                ? `Welcome back, ${user.user_metadata.full_name}`
                : user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#0FAF7F", boxShadow: "0 4px 16px rgba(15,175,127,0.4)" }}
            >
              + New Listing
            </Link>
            <button
              onClick={handleSignOut}
              className="px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-white/20 text-white/80 hover:bg-white/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Listings"
            value={stats.total}
            color="#1A4D8F"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <StatCard
            label="Verified"
            value={stats.verified}
            color="#0FAF7F"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Under Review"
            value={stats.pending}
            color="#f59e0b"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
            }
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            color="#ef4444"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Listings section */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {/* Tab filters */}
          <div className="flex items-center gap-1 p-4 border-b border-slate-100 overflow-x-auto">
            {(["all", "verified", "pending", "rejected"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                style={
                  filter === tab
                    ? { backgroundColor: "#1A4D8F", color: "white" }
                    : { color: "#64748b" }
                }
              >
                {tab === "all"
                  ? `All (${stats.total})`
                  : tab === "verified"
                  ? `Verified (${stats.verified})`
                  : tab === "pending"
                  ? `Under Review (${stats.pending})`
                  : `Rejected (${stats.rejected})`}
              </button>
            ))}
          </div>

          {/* Properties list */}
          <div className="p-4 space-y-3">
            {propsLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-slate-100 rounded-2xl animate-pulse"
                />
              ))}

            {!propsLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(26,77,143,0.08)" }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: "#1A4D8F" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                {filter === "all" ? (
                  <>
                    <h3 className="font-black text-slate-800 mb-2">
                      No listings yet
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-xs">
                      Submit your first property listing to get started on SakaSpace.
                    </p>
                    <Link
                      href="/submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
                      style={{ backgroundColor: "#1A4D8F" }}
                    >
                      + Submit a Property
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    No {filter} listings found.
                  </p>
                )}
              </div>
            )}

            {!propsLoading &&
              filtered.map((property) => (
                <PropertyRow key={property.id} property={property} />
              ))}
          </div>
        </div>

        {/* Help card */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(26,77,143,0.06), rgba(15,175,127,0.06))",
            border: "1px solid rgba(26,77,143,0.1)",
          }}
        >
          <div>
            <h3 className="font-black text-slate-800 mb-1">
              Need help with a listing?
            </h3>
            <p className="text-sm text-slate-500">
              Our team reviews every property within 24–48 hours.
            </p>
          </div>
          <a
            href="mailto:support@sakaspace.co.ke"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-colors hover:bg-white"
            style={{ color: "#1A4D8F", borderColor: "#1A4D8F" }}
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  );
}
