"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";

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
  status: string;
  image_url?: string;
  created_at: string;
}

export default function ListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("status", "verified");

        if (error) throw error;
        setProperties(data ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load properties.");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      <Navbar />

      {/* Page header */}
      <div style={{ backgroundColor: "#1A4D8F" }} className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#0FAF7F" }}
          >
            Browse
          </p>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Explore Properties
          </h1>
          <p className="text-blue-200 mt-2 text-base">
            {loading
              ? "Loading verified listings…"
              : `${properties.length} verified propert${properties.length === 1 ? "y" : "ies"} across Kenya`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="flex gap-4 pt-3 border-t border-slate-100">
                    <div className="h-4 bg-slate-100 rounded w-12" />
                    <div className="h-4 bg-slate-100 rounded w-12" />
                    <div className="h-4 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
            >
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Something went wrong
            </h3>
            <p className="text-slate-500 text-sm max-w-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && properties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
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
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">
              No properties available yet.
            </h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Verified listings will appear here once they've been reviewed and approved.
            </p>
          </div>
        )}

        {/* Property grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                price={`KES ${Number(property.price).toLocaleString()}`}
                location={
                  [property.town, property.county]
                    .filter(Boolean)
                    .join(", ") || property.location
                }
                type={property.type}
                trust={property.trust_score ?? 90}
                beds={property.beds}
                baths={property.baths}
                sqft={property.size ?? "—"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
