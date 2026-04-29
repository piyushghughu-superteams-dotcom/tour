import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Hotel {
  id: string;
  name: string;
  stars: 1 | 2 | 3 | 4 | 5;
  pricePerNight: number;
  hasBar: boolean;
  isFamilyFriendly: boolean;
  hasFood: boolean;
  location: string;
  image: string;
  description: string;
  matchReason: string;
  tags: string[];
}

const hotelsData: Hotel[] = [
  // 5 Stars
  {
    id: "h1",
    name: "The Grand Regency",
    stars: 5,
    pricePerNight: 12500,
    hasBar: true,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Indore",
    image: "/images/hotel/hotel-5-star-4.jpg",
    tags: ["Luxury", "Spa", "Pool"],
    description: "A premier luxury stay with world-class dining and an exclusive lounge bar.",
    matchReason: "Perfectly matches your luxury budget and desire for high-end dining and bar facilities."
  },
  {
    id: "h4",
    name: "Palace View Suites",
    stars: 5,
    pricePerNight: 15000,
    hasBar: true,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Gwalior",
    image: "/images/hotel/hotel-5 star-2.jpg",
    tags: ["Royal", "UNESCO View", "Fine Dining"],
    description: "Experience royal hospitality with panoramic views of the Gwalior Fort.",
    matchReason: "The absolute gold standard for your criteria, offering unmatched views and services."
  },
  {
    id: "h9",
    name: "Maharaja's Retreat",
    stars: 5,
    pricePerNight: 22000,
    hasBar: true,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Khajuraho",
    image: "/images/hotel/hotel-5strat3.jpg",
    tags: ["Heritage", "Luxury", "Cultural"],
    description: "A majestic palace stay offering royal suites and traditional Bundelkhandi hospitality.",
    matchReason: "Top-tier heritage experience that meets all your high-end requirements."
  },

  // 4 Stars
  {
    id: "h3",
    name: "Safari Heights Lodge",
    stars: 4,
    pricePerNight: 7500,
    hasBar: true,
    isFamilyFriendly: false,
    hasFood: true,
    location: "Kanha",
    image: "/images/hotel/hotel-4-star-1.jpg",
    tags: ["Wildlife", "Bar", "Adventure"],
    description: "An adventurous stay with a vibrant bar scene, perfect for solo travelers or groups.",
    matchReason: "Excellent value for money with a focus on adult amenities and wildlife access."
  },
  {
    id: "h6",
    name: "Cloud 9 Resort",
    stars: 4,
    pricePerNight: 8200,
    hasBar: true,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Pachmarhi",
    image: "/images/hotel/hotel-5strat3.jpg",
    tags: ["Hilltop", "Pool", "Buffet"],
    description: "Perched on a cliff with stunning sunset views and a large outdoor swimming pool.",
    matchReason: "Top choice for mountain lovers with premium amenities for families and groups."
  },
  {
    id: "h8",
    name: "The Boutique Hideaway",
    stars: 4,
    pricePerNight: 6500,
    hasBar: false,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Orchha",
    image: "/images/hotel/hotel3.jpeg",
    tags: ["Boutique", "Quiet", "Gardens"],
    description: "A peaceful retreat surrounded by lush gardens and historical ruins.",
    matchReason: "Matches your preference for a high-star rating without the bustle of a bar."
  },

  // 3 Stars
  {
    id: "h2",
    name: "Narmada Riverside Inn",
    stars: 3,
    pricePerNight: 3500,
    hasBar: false,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Maheshwar",
    image: "/images/hotel/hotel-3-star-1.jpg",
    tags: ["Riverside", "Family", "Eco"],
    description: "Comfortable riverside stay perfect for families looking for peace and authentic food.",
    matchReason: "Fits your budget range while offering the best family environment in the region."
  },
  {
    id: "h5",
    name: "The Heritage Loft",
    stars: 3,
    pricePerNight: 4200,
    hasBar: true,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Bhopal",
    image: "/images/hotel/hotel-5-star-5.webp",
    tags: ["Artisan", "City Center", "Value"],
    description: "A beautifully restored heritage property in the heart of Bhopal.",
    matchReason: "Great mid-budget option with a unique aesthetic and full bar/food access."
  },
  {
    id: "h10",
    name: "City Central Inn",
    stars: 3,
    pricePerNight: 2800,
    hasBar: false,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Indore",
    image: "/images/hotel/hotel1.jpg",
    tags: ["Business", "Central", "Clean"],
    description: "Perfectly located for city explorers with easy access to markets and street food.",
    matchReason: "Optimal 3-star match for your price point and location requirement."
  },

  // 2 Stars & 1 Star
  {
    id: "h7",
    name: "Transit Hub Hotel",
    stars: 2,
    pricePerNight: 1800,
    hasBar: false,
    isFamilyFriendly: true,
    hasFood: true,
    location: "Indore",
    image: "/images/hotel/hotel1.jpg",
    tags: ["Budget", "Near Station", "Clean"],
    description: "Basic yet clean and efficient stay for travelers on the move.",
    matchReason: "Unbeatable price for a clean stay with essential food facilities."
  },
  {
    id: "h11",
    name: "Backpackers Base",
    stars: 1,
    pricePerNight: 950,
    hasBar: false,
    isFamilyFriendly: true,
    hasFood: false,
    location: "Ujjain",
    image: "/images/hotel/hotel.jpeg",
    tags: ["Hostel", "Shared", "Basic"],
    description: "A minimalist base for spiritual seekers and budget-conscious backpackers.",
    matchReason: "The most affordable option that matches your minimalist requirements."
  }
];

export default function HotelsAndStays() {
  const [mode, setMode] = useState<"idle" | "generating" | "done">("idle");
  const [loadingText, setLoadingText] = useState("");

  // Form State
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("1000");
  const [maxPrice, setMaxPrice] = useState("5000");
  const [stars, setStars] = useState<number>(3);
  const [isFamily, setIsFamily] = useState(true);
  const [needsBar, setNeedsBar] = useState(false);
  const [needsFood, setNeedsFood] = useState(true);

  const [results, setResults] = useState<Hotel[]>([]);

  const handleGenerate = () => {
    setMode("generating");

    const steps = [
      "Analyzing location data...",
      "Matching price parameters...",
      "Verifying star ratings...",
      "Checking bar & food availability...",
      "Finalizing AI stay ranking..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadingText(steps[i]);
        i++;
      }
    }, 700);

    setTimeout(() => {
      clearInterval(interval);

      const filtered = hotelsData.filter(h => {
        const matchesPrice = h.pricePerNight >= parseInt(minPrice) && h.pricePerNight <= parseInt(maxPrice);
        const matchesStars = h.stars === stars;
        const matchesFamily = !isFamily || h.isFamilyFriendly;
        const matchesBar = !needsBar || h.hasBar;
        const matchesFood = !needsFood || h.hasFood;
        const matchesLoc = !location || h.location.toLowerCase().includes(location.toLowerCase()) ||
          location.toLowerCase().includes(h.location.toLowerCase());
        return matchesPrice && matchesStars && matchesFamily && matchesBar && matchesFood && matchesLoc;
      });

      // If too few results, widen the search or pick the closest ones
      let finalResults = filtered.slice(0, 3);
      if (finalResults.length === 0) {
        finalResults = hotelsData.slice(0, 3);
      }

      setResults(finalResults);
      setMode("done");
    }, 4000);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-9rem)] min-h-[600px] overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-xl">

      {/* Left Sidebar: Controls */}
      <div className="w-full xl:w-[400px] flex-shrink-0 border-b xl:border-b-0 xl:border-r border-slate-200 bg-white/80 flex flex-col h-full overflow-y-auto">
        <div className="p-7 space-y-8 pb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Stay Configuration</p>
            <h2 className="mt-2 font-display text-3xl text-slate-900">AI Stay Planner</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Specify your budget and terms to let our AI find the best 2-3 hotel matches for you.</p>
          </div>

          <div className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Target Location</label>
              <input
                type="text" placeholder="e.g., Indore, Kanha, Bhopal"
                value={location} onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Price Range (per night)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number" placeholder="Min"
                  value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-slate-300">—</span>
                <input
                  type="number" placeholder="Max"
                  value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-900">Minimum Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setStars(s)}
                    className={`flex-1 h-12 flex items-center justify-center rounded-xl transition-all border ${stars === s ? "bg-white border-slate-900 shadow-sm" : "bg-white border-slate-100 text-slate-300 hover:border-slate-200"
                      }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={stars >= s ? "#f59e0b" : "currentColor"}>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Switches */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Terms & Conditions</label>

              <button
                onClick={() => setIsFamily(!isFamily)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${isFamily ? 'bg-emerald-50 border-emerald-500/30' : 'bg-slate-50 border-slate-200 opacity-60'}`}
              >
                <span className="text-sm font-semibold text-slate-700">Family Friendly</span>
                <div className={`h-5 w-10 rounded-full transition-all relative ${isFamily ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${isFamily ? 'right-1' : 'left-1'}`} />
                </div>
              </button>

              <button
                onClick={() => setNeedsBar(!needsBar)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${needsBar ? 'bg-purple-50 border-purple-500/30' : 'bg-slate-50 border-slate-200 opacity-60'}`}
              >
                <span className="text-sm font-semibold text-slate-700">Bar / Lounge</span>
                <div className={`h-5 w-10 rounded-full transition-all relative ${needsBar ? 'bg-purple-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${needsBar ? 'right-1' : 'left-1'}`} />
                </div>
              </button>

              <button
                onClick={() => setNeedsFood(!needsFood)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${needsFood ? 'bg-amber-50 border-amber-500/30' : 'bg-slate-50 border-slate-200 opacity-60'}`}
              >
                <span className="text-sm font-semibold text-slate-700">In-house Dining</span>
                <div className={`h-5 w-10 rounded-full transition-all relative ${needsFood ? 'bg-amber-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${needsFood ? 'right-1' : 'left-1'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto p-7 bg-white border-t border-slate-200 sticky bottom-0 z-10">
          <button
            onClick={handleGenerate}
            disabled={mode === 'generating'}
            className="w-full rounded-full bg-[linear-gradient(135deg,#10b981,#0f766e)] px-6 py-4 text-sm font-bold text-white transition hover:scale-[1.02] disabled:bg-slate-400 disabled:hover:scale-100 flex justify-center items-center gap-3 shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
          >
            {mode === 'generating' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              "Find Best Matches"
            )}
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 h-full overflow-y-auto bg-slate-50/50 p-6 xl:p-12 relative">
        {mode === 'idle' ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-[0_16px_32px_rgba(148,163,184,0.15)] text-emerald-500">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-display text-4xl text-slate-900 mb-4">Find your ideal stay</h3>
            <p className="text-slate-500 text-sm leading-7">Configure your budget range and amenities on the left. Our AI will analyze proximity and user ratings to suggest the top 2-3 properties for you.</p>
          </div>
        ) : mode === 'generating' ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
            <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <div className="absolute inset-4 rounded-full border-2 border-slate-300/30 border-b-slate-800 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <div className="absolute inset-8 flex items-center justify-center text-3xl">🏨</div>
            </div>
            <h3 className="font-display text-3xl text-slate-900 mb-3">Ranking Best Options...</h3>
            <p className="text-emerald-600 text-sm leading-7 animate-pulse font-semibold">{loadingText}</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                AI Stay Analysis
              </div>
              <h1 className="font-display text-4xl xl:text-5xl text-slate-900 mb-6 leading-tight">Top {results.length} Matches Found</h1>
              <p className="text-slate-500 max-w-2xl leading-relaxed">Based on your {formatCurrency(parseInt(minPrice))}-{formatCurrency(parseInt(maxPrice))} budget and {stars}+ star preference, here are the most optimized stays.</p>
            </div>

            <div className="grid gap-8">
              {results.map((hotel, idx) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-xl transition-all hover:shadow-2xl flex flex-col lg:flex-row"
                >
                  <div className="lg:w-2/5 relative overflow-hidden aspect-video lg:aspect-auto">
                    <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-6 left-6 flex gap-2">
                      <div className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-slate-900 uppercase tracking-widest border border-white/20">
                        #{idx + 1} Match
                      </div>
                      <div className="rounded-full bg-slate-900/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                        {hotel.stars} Stars
                      </div>
                    </div>
                  </div>

                  <div className="p-8 lg:p-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-1">{hotel.location}</p>
                        <h3 className="font-display text-3xl text-slate-900">{hotel.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Per Night</p>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(hotel.pricePerNight)}</p>
                      </div>
                    </div>

                    <p className="text-slate-500 leading-relaxed mb-6 line-clamp-2">{hotel.description}</p>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">AI Recommendation Logic</span>
                      </div>
                      <p className="text-sm text-emerald-900 italic leading-relaxed">"{hotel.matchReason}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {hotel.tags.map(tag => (
                        <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>

                    <div className="mt-auto flex gap-4">
                      <button className="flex-1 rounded-2xl bg-slate-950 py-4 text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-lg shadow-slate-200 uppercase tracking-widest">
                        View details
                      </button>
                      <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
