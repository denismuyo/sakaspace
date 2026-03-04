'use client';

import SearchBar from './SearchBar';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-4" style={{ background: 'linear-gradient(145deg, #1A4D8F 0%, #0d3a7a 55%, #08265c 100%)' }}>
      {/* Background orbs */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-[0.07]" style={{ backgroundColor: '#0FAF7F' }} />
      <div className="absolute -bottom-24 -left-20 w-[360px] h-[360px] rounded-full opacity-[0.04] bg-white" />
      
      <div className="relative max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-7" style={{ backgroundColor: 'rgba(15,175,127,0.15)', borderColor: 'rgba(15,175,127,0.35)' }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0FAF7F' }} />
          <span className="text-xs font-semibold" style={{ color: '#0FAF7F' }}>Kenya's #1 Verified Property Platform</span>
        </div>
        
        <h1 className="text-white font-black leading-[1.08] mb-5 tracking-tight" style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', letterSpacing: '-1.5px' }}>
          Find Verified Property<br />
          <span style={{ color: '#0FAF7F' }}>Opportunities</span> Across Kenya
        </h1>
        <p className="text-blue-200 mb-12 max-w-xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}>
          Discover trusted listings with real-time verification scores. No scams — just verified spaces.
        </p>

        <SearchBar />

        {/* Stats */}
        <div className="mt-10 flex justify-center flex-wrap gap-10">
          {[['12,400+', 'Active Listings'], ['98%', 'Verified Properties'], ['40+ Counties', 'Kenya Coverage']].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-black text-xl" style={{ color: '#0FAF7F' }}>{n}</div>
              <div className="text-blue-300 text-xs mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}