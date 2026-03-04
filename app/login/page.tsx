"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import Navbar from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  title: string;
  description: string;
  price: string;
  property_type: string;
  size: string;
  size_unit: string;
  county: string;
  town: string;
  beds: string;
  baths: string;
}

const INITIAL_FORM: FormData = {
  title: "",
  description: "",
  price: "",
  property_type: "",
  size: "",
  size_unit: "sqft",
  county: "",
  town: "",
  beds: "",
  baths: "",
};

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Studio",
  "Townhouse",
  "Mansion",
  "Bedsitter",
  "Commercial",
  "Land",
];

const SIZE_UNITS = ["sqft", "sqm", "acres"];

const KENYA_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
  "Samburu","Siaya","Taita Taveta","Tana River","Tharaka Nithi","Trans Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormSection({
  title,
  subtitle,
  children,
  step,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  step: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-black text-sm"
          style={{ backgroundColor: "#1A4D8F" }}
        >
          {step}
        </div>
        <div>
          <h2 className="font-black text-slate-900 text-base leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-300 bg-slate-50";

const inputStyle = {
  borderColor: "#e2e8f0",
};

function useInputFocus() {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.target.style.borderColor = "#1A4D8F"),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.target.style.borderColor = "#e2e8f0"),
  };
}

// ─── Image Uploader ───────────────────────────────────────────────────────────

interface ImageFile {
  file: File;
  preview: string;
  uploading: boolean;
  error?: string;
}

function ImageUploader({
  images,
  onChange,
}: {
  images: ImageFile[];
  onChange: (imgs: ImageFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      const newImgs = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
      }));
      onChange([...images, ...newImgs]);
    },
    [images, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }));
    onChange([...images, ...newImgs]);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[idx].preview);
    updated.splice(idx, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
        style={{ borderColor: "#cbd5e1", backgroundColor: "#f8fafc" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#1A4D8F";
          (e.currentTarget as HTMLDivElement).style.backgroundColor =
            "rgba(26,77,143,0.03)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#cbd5e1";
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f8fafc";
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(26,77,143,0.08)" }}
        >
          <svg
            className="w-6 h-6"
            style={{ color: "#1A4D8F" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-700">
            Drop images here, or{" "}
            <span style={{ color: "#1A4D8F" }}>browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            PNG, JPG, WEBP up to 10 MB each — first image becomes the cover
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden aspect-square"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <div
                  className="absolute top-1.5 left-1.5 text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: "#0FAF7F" }}
                >
                  Cover
                </div>
              )}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </div>
              )}
              {!img.uploading && (
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubmitPropertyPage() {
  const router = useRouter();
  const focusProps = useInputFocus();

  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      } else {
        setUserId(session.user.id);
        setAuthLoading(false);
      }
    });
  }, [router]);

  // ── Field change ───────────────────────────────────────────────────────────
  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Upload images to Supabase Storage
      const uploadedUrls: string[] = [];

      const updatedImages = images.map((img) => ({ ...img, uploading: true }));
      setImages(updatedImages);

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const ext = img.file.name.split(".").pop();
        const path = `${userId}/${Date.now()}-${i}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("property-images")
          .upload(path, img.file, { cacheControl: "3600", upsert: false });

        if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);

        uploadedUrls.push(urlData.publicUrl);

        setImages((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, uploading: false } : item
          )
        );
      }

      // 2. Insert property record
      const { data: property, error: propertyErr } = await supabase
        .from("properties")
        .insert({
          user_id: userId,
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          type: form.property_type,
          size: form.size ? `${form.size} ${form.size_unit}` : null,
          county: form.county,
          town: form.town,
          location: `${form.town}, ${form.county}`,
          beds: form.beds ? parseInt(form.beds) : null,
          baths: form.baths ? parseInt(form.baths) : null,
          status: "pending",
          trust_score: 0,
          image_url: uploadedUrls[0] ?? null,
        })
        .select()
        .single();

      if (propertyErr) throw new Error(propertyErr.message);

      // 3. Insert image records
      if (uploadedUrls.length > 0 && property) {
        const imageRecords = uploadedUrls.map((url, idx) => ({
          property_id: property.id,
          url,
          is_cover: idx === 0,
          sort_order: idx,
        }));

        const { error: imgErr } = await supabase
          .from("property_images")
          .insert(imageRecords);

        if (imgErr) throw new Error(imgErr.message);
      }

      setSubmitSuccess(true);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Auth loading ───────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="flex items-center gap-3 text-slate-500">
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm font-medium">Checking authentication…</span>
        </div>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center max-w-md">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #0FAF7F, #059669)",
              }}
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
              Listing submitted!
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Your property has been submitted for review. Our team will verify
              it within <strong className="text-slate-700">24–48 hours</strong>.
              You'll get an email once it's live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#1A4D8F" }}
              >
                View My Dashboard
              </Link>
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setForm(INITIAL_FORM);
                  setImages([]);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border-2 transition-colors hover:bg-slate-50"
                style={{ color: "#1A4D8F", borderColor: "#1A4D8F" }}
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>
      <Navbar />

      {/* Page header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A4D8F 0%, #0d3a7a 100%)",
        }}
        className="py-12 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#0FAF7F" }}
          >
            Sell or Rent
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Submit a Property
          </h1>
          <p className="text-blue-200 mt-2 text-sm">
            Fill in the details below. Our team reviews every listing within 24–48 hours.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Section 1: Basic info ── */}
          <FormSection
            step={1}
            title="Basic Information"
            subtitle="The headline details buyers see first"
          >
            <div className="space-y-5">
              <Field label="Property Title" required>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={set("title")}
                  placeholder="e.g. Spacious 3BR Apartment in Westlands"
                  className={inputClass}
                  style={inputStyle}
                  {...focusProps}
                />
              </Field>

              <Field
                label="Description"
                hint="Describe the property, surroundings, and any special features"
              >
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Tell potential buyers about this property…"
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                  {...focusProps}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Price (KES)" required>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={set("price")}
                    placeholder="e.g. 4500000"
                    className={inputClass}
                    style={inputStyle}
                    {...focusProps}
                  />
                </Field>

                <Field label="Property Type" required>
                  <select
                    required
                    value={form.property_type}
                    onChange={set("property_type")}
                    className={inputClass}
                    style={inputStyle}
                    {...focusProps}
                  >
                    <option value="">Select type…</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </FormSection>

          {/* ── Section 2: Location ── */}
          <FormSection
            step={2}
            title="Location"
            subtitle="Where is the property located?"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="County" required>
                <select
                  required
                  value={form.county}
                  onChange={set("county")}
                  className={inputClass}
                  style={inputStyle}
                  {...focusProps}
                >
                  <option value="">Select county…</option>
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Town / Area" required>
                <input
                  type="text"
                  required
                  value={form.town}
                  onChange={set("town")}
                  placeholder="e.g. Westlands"
                  className={inputClass}
                  style={inputStyle}
                  {...focusProps}
                />
              </Field>
            </div>
          </FormSection>

          {/* ── Section 3: Property details ── */}
          <FormSection
            step={3}
            title="Property Details"
            subtitle="Specs help buyers filter and find your listing"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field label="Bedrooms">
                <input
                  type="number"
                  min={0}
                  value={form.beds}
                  onChange={set("beds")}
                  placeholder="e.g. 3"
                  className={inputClass}
                  style={inputStyle}
                  {...focusProps}
                />
              </Field>

              <Field label="Bathrooms">
                <input
                  type="number"
                  min={0}
                  value={form.baths}
                  onChange={set("baths")}
                  placeholder="e.g. 2"
                  className={inputClass}
                  style={inputStyle}
                  {...focusProps}
                />
              </Field>

              <Field label="Property Size">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={form.size}
                    onChange={set("size")}
                    placeholder="e.g. 1200"
                    className={`${inputClass} flex-1`}
                    style={inputStyle}
                    {...focusProps}
                  />
                  <select
                    value={form.size_unit}
                    onChange={set("size_unit")}
                    className="px-3 py-3 rounded-xl border text-sm font-medium text-slate-900 outline-none bg-slate-50"
                    style={inputStyle}
                    {...focusProps}
                  >
                    {SIZE_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
            </div>
          </FormSection>

          {/* ── Section 4: Images ── */}
          <FormSection
            step={4}
            title="Property Images"
            subtitle="Upload at least 1 image — more photos get more inquiries"
          >
            <ImageUploader images={images} onChange={setImages} />
          </FormSection>

          {/* ── Error ── */}
          {submitError && (
            <div
              className="flex items-start gap-3 p-4 rounded-2xl text-sm"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                color: "#dc2626",
              }}
            >
              <svg
                className="w-5 h-5 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          {/* ── Submit bar ── */}
          <div
            className="flex items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex-wrap"
          >
            <div>
              <p className="text-sm font-bold text-slate-800">
                Ready to submit?
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Your listing will show as{" "}
                <span
                  className="font-semibold"
                  style={{ color: "#f59e0b" }}
                >
                  Pending
                </span>{" "}
                until verified by our team.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-black text-sm transition-all shrink-0"
              style={{
                backgroundColor: submitting ? "#94a3b8" : "#1A4D8F",
                boxShadow: submitting
                  ? "none"
                  : "0 4px 16px rgba(26,77,143,0.35)",
              }}
            >
              {submitting ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  Submit Listing →
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
