"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PropertyCardProps {
  id: string;
  price: string;
  location: string;
  type: string;
  trust: number;
  beds: number;
  baths: number;
  sqft: string;
  imageUrl?: string;
}

export default function PropertyCard({
  id,
  price,
  location,
  type,
  trust,
  beds,
  baths,
  sqft,
}: PropertyCardProps) {

  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);

  const trustColor =
    trust >= 95 ? "#0FAF7F" :
    trust >= 88 ? "#3b82f6" :
    "#f59e0b";

  const gradientMap: Record<string, string> = {
    apartment: "linear-gradient(135deg,#1A4D8F,#0d3a7a)",
    villa: "linear-gradient(135deg,#0FAF7F,#059669)",
    studio: "linear-gradient(135deg,#312e81,#4338ca)",
    townhouse: "linear-gradient(135deg,#164e63,#0e7490)",
    mansion: "linear-gradient(135deg,#1e3a8a,#1A4D8F)",
    bedsitter: "linear-gradient(135deg,#0a2d5e,#1A4D8F)",
    commercial: "linear-gradient(135deg,#1f2937,#374151)",
  };

  const gradient =
    gradientMap[type?.toLowerCase()] ??
    "linear-gradient(135deg,#1A4D8F,#0d3a7a)";

  function handleCardClick() {
    router.push(`/property/${id}`);
  }

  function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    setSaved((prev) => !prev);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View property: ${price} in ${location}`}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform .22s ease, box-shadow .22s ease",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 50px rgba(0,0,0,0.16)"
          : "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >

      {/* IMAGE AREA */}

      <div
        style={{
          height: 196,
          background: gradient,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        {/* placeholder icon */}

        <svg
          width="60"
          height="60"
          fill="none"
          viewBox="0 0 24 24"
          style={{ opacity: hovered ? 0.28 : 0.18 }}
        >
          <path
            d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            stroke="white"
            strokeWidth="1.5"
          />
          <polyline
            points="9 22 9 12 15 12 15 22"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>

        {/* property type */}

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.38)",
            backdropFilter: "blur(10px)",
            borderRadius: 8,
            padding: "5px 12px",
          }}
        >
          <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>
            {type?.toUpperCase()}
          </span>
        </div>

        {/* trust score */}

        <div
          style={{
            position: "absolute",
            top: 12,
            right: 48,
            background: "white",
            borderRadius: 8,
            padding: "4px 10px",
            display: "flex",
            gap: 5,
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: trustColor,
              boxShadow: `0 0 5px ${trustColor}`,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700 }}>
            {trust}% Trust
          </span>
        </div>

        {/* save button */}

        <button
          onClick={handleSave}
          aria-label="Save property"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "white",
            borderRadius: 8,
            border: "none",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg
            width="15"
            height="15"
            fill={saved ? "#ef4444" : "none"}
            stroke={saved ? "#ef4444" : "#475569"}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

      </div>

      {/* CARD BODY */}

      <div style={{ padding: "18px 20px" }}>

        <p
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#0f172a",
            margin: 0,
          }}
        >
          {price}
        </p>

        <div
          style={{
            display: "flex",
            gap: 5,
            marginTop: 6,
            marginBottom: 14,
            alignItems: "center",
          }}
        >
          <span style={{ color: "#64748b", fontSize: 13 }}>
            {location}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            paddingTop: 14,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <span style={{ fontSize: 13 }}>
            <strong>{beds}</strong> bd
          </span>

          <span style={{ fontSize: 13 }}>
            <strong>{baths}</strong> ba
          </span>

          <span style={{ fontSize: 13 }}>
            {sqft}
          </span>
        </div>

      </div>

    </div>
  );
}