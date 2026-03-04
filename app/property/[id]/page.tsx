"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  county?: string;
  town?: string;
  trust_score: number;
  type: string;
  beds: number;
  baths: number;
  size?: string;
  description?: string;
  status: string;
  image_url?: string;
  images?: string[];
  created_at: string;
}

function TrustBadge({ score }: { score: number }) {
  const color =
    score >= 95 ? "#0FAF7F" : score >= 88 ? "#3b82f6" : "#f59e0b";
  const label =
    score >= 95 ? "Highly Trusted" : score >= 88 ? "Verified" : "Moderate";
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />
      {score}% Trust Score — {label}
    </div>
  );
}

function ImageGallery({ title }: { title: string }) {
  const gradients = [
    "linear-gradient(135deg, #1A4D8F 0%, #0d3a7a 100%)",
    "linear-gradient(135deg, #0FAF7F 0%, #059669 100%)",
    "linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)",
    "linear-gradient(135deg, #164e63 0%, #0e7490 100%)",
  ];

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
      {/* Main large image */}
      <div
        className="col-span-2 row-span-2 flex items-center justify-center relative"
        style={{ background: gradients[0] }}
      >
        <svg
          className="w-20 h-20 opacity-15"
          fill="none"
          stroke="white"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-medium">
          Main Photo
        </div>
      </div>
      {/* 4 smaller images */}
      {gradients.slice(1).concat([gradients[0]]).map((g, i) => (
        <div
          key={i}
          className="flex items-center justify-center relative"
          style={{ background: g, opacity: 0.8 }}
        >
          <svg
            className="w-8 h-8 opacity-20"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          {i === 3 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-bold">+ More Photos</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProperty() {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Property not found."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  // ── LOADING ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-[420px] bg-slate-200 rounded-2xl" />
            <div className="h-8 bg-slate-200 rounded w-2/3" />
            <div className="h-5 bg-slate-100 rounded w-1/3" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl" />
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR / NOT FOUND ────────────────────────────────────
  if (error || !property) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: "rgba(26,77,143,0.08)" }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: "#1A4D8F" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            Property not found
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            {error ?? "This listing may have been removed or does not exist."}
          </p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1A4D8F" }}
          >
            ← Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  // ── PROPERTY DETAIL ──────────────────────────────────────
  const displayLocation =
    [property.town, property.county].filter(Boolean).join(", ") ||
    property.location;

  const specs = [
    {
      label: "Property Type",
      value: property.type,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
        />
      ),
    },
    {
      label: "Property Size",
      value: property.size ?? "Not specified",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
        />
      ),
    },
    {
      label: "Bedrooms",
      value: `${property.beds} bed${property.beds !== 1 ? "s" : ""}`,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      ),
    },
    {
      label: "Bathrooms",
      value: `${property.baths} bath${property.baths !== 1 ? "s" : ""}`,
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/listings"
            className="hover:text-slate-800 transition-colors"
          >
            Listings
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-[200px]">
            {property.title}
          </span>
        </nav>

        {/* Image gallery */}
        <ImageGallery title={property.title} />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left — main info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title + trust */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {property.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-3 text-slate-500">
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span className="text-sm font-medium">{displayLocation}</span>
              </div>
              <div className="mt-4">
                <TrustBadge score={property.trust_score ?? 90} />
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Specs grid */}
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(26,77,143,0.08)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#1A4D8F" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {spec.icon}
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                        {spec.label}
                      </p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <>
                <hr className="border-slate-200" />
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-3">
                    About this property
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </>
            )}

            {/* Location section */}
            <hr className="border-slate-200" />
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-3">
                Location
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(15,175,127,0.1)" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#0FAF7F" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div>
                  {property.town && (
                    <p className="text-sm font-bold text-slate-800">
                      {property.town}
                    </p>
                  )}
                  {property.county && (
                    <p className="text-xs text-slate-500">{property.county} County, Kenya</p>
                  )}
                  {!property.town && !property.county && (
                    <p className="text-sm font-bold text-slate-800">
                      {property.location}
                    </p>
                  )}
                </div>
              </div>
              {/* Map placeholder */}
              <div
                className="h-48 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(26,77,143,0.06) 0%, rgba(15,175,127,0.06) 100%)",
                  border: "1px dashed rgba(26,77,143,0.2)",
                }}
              >
                <div className="text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 opacity-30"
                    style={{ color: "#1A4D8F" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    />
                  </svg>
                  <p className="text-xs text-slate-400 font-medium">
                    Map view coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — price card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                {/* Price header */}
                <div
                  className="px-6 py-5"
                  style={{
                    background:
                      "linear-gradient(135deg, #1A4D8F 0%, #0d3a7a 100%)",
                  }}
                >
                  <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">
                    Asking Price
                  </p>
                  <p className="text-white text-2xl font-black tracking-tight">
                    KES {Number(property.price).toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-xs mt-1">{property.type}</p>
                </div>

                {/* Quick facts */}
                <div className="px-6 py-5 space-y-3 border-b border-slate-100">
                  {[
                    ["Location", displayLocation],
                    ["County", property.county ?? "—"],
                    ["Bedrooms", `${property.beds}`],
                    ["Bathrooms", `${property.baths}`],
                    ["Size", property.size ?? "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xs text-slate-400 font-semibold">
                        {label}
                      </span>
                      <span className="text-xs font-bold text-slate-700 text-right max-w-[140px] truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-6 py-5 space-y-3">
                  <button
                    className="w-full py-3 rounded-xl text-white text-sm font-black transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#0FAF7F" }}
                  >
                    Request a Viewing
                  </button>
                  <button
                    className="w-full py-3 rounded-xl text-sm font-black border-2 transition-colors hover:bg-blue-50"
                    style={{
                      color: "#1A4D8F",
                      borderColor: "#1A4D8F",
                    }}
                  >
                    Contact Agent
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-2">
                    🔒 Your information is secure and confidential
                  </p>
                </div>
              </div>

              {/* Back link */}
              <div className="mt-4 text-center">
                <Link
                  href="/listings"
                  className="text-sm text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
                >
                  ← Back to all listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
