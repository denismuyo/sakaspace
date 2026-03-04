'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (propertyType) params.set('type', propertyType);
    if (priceRange) params.set('price', priceRange);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl p-5 max-w-[880px] mx-auto flex items-center gap-0 flex-wrap shadow-2xl" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.28)' }}>
      {/* Location */}
      <div className="flex-1 min-w-[130px] pr-4">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.8px] mb-1.5">Location</label>
        <input type="text" placeholder="Nairobi, Mombasa..." value={location} onChange={e => setLocation(e.target.value)}
          className="w-full border-none outline-none text-sm font-semibold text-slate-900 bg-transparent placeholder:text-slate-300" />
      </div>
      <div className="w-px h-11 bg-slate-200 shrink-0" />
      {/* Type */}
      <div className="flex-1 min-w-[120px] px-4">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.8px] mb-1.5">Property Type</label>
        <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
          className="w-full border-none outline-none text-sm font-semibold bg-transparent cursor-pointer" style={{ color: propertyType ? '#1e293b' : '#94a3b8' }}>
          <option value="">Any type</option>
          <option>Apartment</option><option>Villa</option><option>Studio</option><option>Townhouse</option><option>Commercial</option>
        </select>
      </div>
      <div className="w-px h-11 bg-slate-200 shrink-0" />
      {/* Price */}
      <div className="flex-1 min-w-[120px] px-4">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.8px] mb-1.5">Price Range</label>
        <select value={priceRange} onChange={e => setPriceRange(e.target.value)}
          className="w-full border-none outline-none text-sm font-semibold bg-transparent cursor-pointer" style={{ color: priceRange ? '#1e293b' : '#94a3b8' }}>
          <option value="">Any price</option>
          <option>Under KES 1M</option><option>KES 1M – 5M</option><option>KES 5M – 15M</option><option>Above KES 15M</option>
        </select>
      </div>
      {/* Button */}
      <button onClick={handleSearch} className="ml-2 flex items-center gap-2 text-white font-black text-sm px-7 py-[15px] rounded-xl shrink-0 transition-opacity hover:opacity-90" style={{ backgroundColor: '#1A4D8F', boxShadow: '0 4px 16px rgba(26,77,143,0.4)' }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
        Search
      </button>
    </div>
  );
}