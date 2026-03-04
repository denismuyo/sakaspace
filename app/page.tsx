import PropertyCard from "../components/PropertyCard";
import HeroSection from "../components/HeroSection";

const FEATURED_LISTINGS = [
  { id: 1, price: "KES 4,500,000", location: "Westlands, Nairobi", type: "Apartment", trust: 96, beds: 3, baths: 2, sqft: "1,200 sqft" },
  { id: 2, price: "KES 12,000,000", location: "Karen, Nairobi", type: "Villa", trust: 98, beds: 5, baths: 4, sqft: "3,800 sqft" },
  { id: 3, price: "KES 2,800,000", location: "Kilimani, Nairobi", type: "Studio", trust: 91, beds: 1, baths: 1, sqft: "650 sqft" },
  { id: 4, price: "KES 7,200,000", location: "Lavington, Nairobi", type: "Townhouse", trust: 94, beds: 4, baths: 3, sqft: "2,400 sqft" },
  { id: 5, price: "KES 1,900,000", location: "Thika Road, Nairobi", type: "Bedsitter", trust: 88, beds: 1, baths: 1, sqft: "400 sqft" },
  { id: 6, price: "KES 9,500,000", location: "Runda, Nairobi", type: "Mansion", trust: 99, beds: 6, baths: 5, sqft: "5,200 sqft" },
];

export default function HomePage() {
  return (
    <main>

      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="flex justify-between items-end mb-9 flex-wrap gap-4">

          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold mb-3"
              style={{
                backgroundColor: "rgba(15,175,127,0.1)",
                color: "#0FAF7F",
              }}
            >
              ✓ Hand-picked & verified
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Listings
            </h2>
          </div>

          <a
            href="/listings"
            className="text-sm font-bold border-2 px-5 py-2.5 rounded-xl transition-colors hover:bg-blue-50"
            style={{
              color: "#1A4D8F",
              borderColor: "#1A4D8F",
            }}
          >
            View all listings →
          </a>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_LISTINGS.map((listing) => (
            <PropertyCard key={listing.id} {...listing} />
          ))}
        </div>

      </section>

      {/* CTA Banner */}

      <section
        className="mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto mb-16 rounded-2xl p-12 flex items-center justify-between flex-wrap gap-6"
        style={{
          background: "linear-gradient(135deg, #0FAF7F, #059669)",
        }}
      >

        <div>
          <h3 className="text-2xl font-black text-white mb-2">
            Have a property to list?
          </h3>

          <p className="text-green-100">
            Join 3,000+ landlords and agents already on SakaSpace.
          </p>
        </div>

        <button
          className="bg-white font-black px-8 py-4 rounded-xl text-sm shadow-lg hover:shadow-xl transition-shadow"
          style={{ color: "#059669" }}
        >
          Submit Your Property →
        </button>

      </section>

    </main>
  );
}