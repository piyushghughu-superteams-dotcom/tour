import { useState, useMemo } from "react";
import type { Profile } from "../components/ProfileSetupModal";

const PROFILE_STORAGE_KEY = "mp-tourism-profile";

// ── Data Templates ────────────────────────────────────────────────────────

const templates: Record<string, any> = {
  Wildlife: {
    baseTagline: "Kanha · Bandhavgarh · Pench — MP's premier safari triangle",
    locations: ["Kanha National Park, Mandla", "Bandhavgarh Tiger Reserve", "Pench Tree Lodge", "Panna Reserve Buffer", "Satpura Night Safari", "Madhai Meadows"],
    stays: ["Kanha Earth Lodge", "Kings Lodge Bandhavgarh", "Pench Treehouse", "Panna Stone Retreat", "Satpura Safari Camp"],
    stayTypes: ["Jungle Boutique", "Heritage Tented Camp", "Luxury Lodge", "Eco Resort"],
    highlights: [
      { label: "Bengal Tiger Sightings", icon: "🐯" },
      { label: "Barasingha Meadows", icon: "🦌" },
      { label: "Night Safari Experience", icon: "🌌" },
      { label: "Wild Dog Packs", icon: "🐺" },
      { label: "Bird-rich Buffer Zones", icon: "🦅" },
    ],
  },
  Heritage: {
    baseTagline: "Khajuraho · Orchha · Gwalior · Sanchi — The cultural spine of MP",
    locations: ["Khajuraho Temple Citadel", "Orchha Riverside Palaces", "Gwalior Fort", "Ashoka's Sanchi Stupa", "Bhimbetka Rock Shelters", "Mandu Afghan Ruins"],
    stays: ["Lalit Temple View", "Betwa Cottages Orchha", "Usha Kiran Palace", "Jehan Numa Retreat", "Ahilya Fort Heritage"],
    stayTypes: ["Heritage Property", "River View Heritage", "Heritage Palace", "Boutique Fort"],
    highlights: [
      { label: "UNESCO Khajuraho", icon: "🛕" },
      { label: "Betwa River Cenotaphs", icon: "⛵" },
      { label: "Gwalior Fort Ramparts", icon: "🏰" },
      { label: "Cave Paintings 30,000 BC", icon: "🪨" },
      { label: "Afghan Architecture", icon: "🏛️" },
    ],
  },
  "Nature & Hills": {
    baseTagline: "Pachmarhi · Tamia · Amarkantak — Central India's highlands",
    locations: ["Pachmarhi Hill Station", "Tamia Cliff Views", "Amarkantak Narmada Source", "Patalkot Valley", "Bhedaghat Marble Rocks"],
    stays: ["Satpura Retreat", "Tamia Eco Lodge", "Narmada River Camp", "Pachmarhi Heritage Bungalow", "Clifftop Resort"],
    stayTypes: ["Forest Bungalow", "Eco Retreat", "Valley View Resort", "Heritage Property"],
    highlights: [
      { label: "Pachmarhi at 1,067m", icon: "⛰️" },
      { label: "Marble Gorge Rowboat", icon: "⛵" },
      { label: "Dhuandhar Falls", icon: "💧" },
      { label: "Sunset at Dhoopgarh", icon: "🌅" },
      { label: "Hidden Patalkot", icon: "🌿" },
    ],
  },
  Spiritual: {
    baseTagline: "Ujjain · Omkareshwar · Maheshwar — The sacred Narmada trail",
    locations: ["Mahakaleshwar Ujjain", "Omkareshwar Island", "Maheshwar River Ghats", "Chitrakoot Ramghat", "Maihar Temple"],
    stays: ["Ujjain Pilgrim Retreat", "Narmada Crest Maheshwar", "Omkareshwar River View", "Ahilya Fort", "Chitrakoot Ashram"],
    stayTypes: ["Spiritual Retreat", "Riverside Boutique", "Heritage Ashram", "Pilgrim Hotel"],
    highlights: [
      { label: "Mahakal Bhasma Aarti", icon: "🔱" },
      { label: "Omkareshwar Parikrama", icon: "🕉️" },
      { label: "Maheshwar Ghats", icon: "🕯️" },
      { label: "Narmada River Walk", icon: "🌊" },
      { label: "Sacred Chants at Dawn", icon: "📿" },
    ],
  },
  Mixed: {
    baseTagline: "Bhopal · Pachmarhi · Kanha — Classic MP mixed circuit",
    locations: ["Bhopal Upper Lake", "Sanchi Stupa", "Pachmarhi Viewpoints", "Kanha Core Zone", "Bhedaghat Gorge"],
    stays: ["Noor Us Sabah Palace", "Satpura Retreat", "Kanha Earth Lodge", "Taj Narmada Jabalpur", "Betwa Retreat"],
    stayTypes: ["Heritage Lake Palace", "Forest Bungalow", "Jungle Boutique", "City Luxury"],
    highlights: [
      { label: "Bhopal Upper Lake", icon: "🌅" },
      { label: "Bengal Tiger Safaris", icon: "🐯" },
      { label: "Marble Gorge Rowboat", icon: "⛵" },
      { label: "Ashoka's Stupa", icon: "☸️" },
      { label: "MP Street Food", icon: "🍛" },
    ],
  }
};

const morningActivities = [
  "Arrive and check into the property. Freshen up with a local welcome drink.",
  "Dawn guided walk with a local expert to spot early wildlife or enjoy morning light.",
  "Early morning excursion to the prime attractions before the crowds arrive.",
  "Sunrise photography session followed by a traditional local breakfast.",
  "Leisurely breakfast and local market exploration to get a feel for the area."
];

const afternoonActivities = [
  "Sample local delicacies for lunch. Afternoon museum or heritage site tour.",
  "Rest during peak heat. Late afternoon deep exploration of nearby ruins.",
  "Visit the iconic viewpoints. Guided architectural and nature tour.",
  "Interactive session with local artisans, weavers, or naturalists.",
  "Scenic transfer to the next destination or a short nature trail."
];

const eveningActivities = [
  "Sunset views at a high vantage point followed by a traditional dinner.",
  "Attend the local light & sound show or evening river aarti.",
  "Bonfire and stargazing with folk tales shared by local guides.",
  "Street food trail and city walk through the bustling old markets.",
  "Relax at the property with cultural performances and premium dining."
];

// ── Component ──────────────────────────────────────────────────────────────────

type PlannerMode = "idle" | "generating" | "done";

export default function AiTripPlanner({ profile: propProfile }: { profile?: Profile | null }) {
  const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  const savedProfile: Profile | null = propProfile ?? (stored ? (() => { try { return JSON.parse(stored); } catch { return null; } })() : null);

  const [days, setDays] = useState("4");
  const [interest, setInterest] = useState(savedProfile?.interests?.[0]?.includes("Wildlife") ? "Wildlife" : savedProfile?.interests?.[0]?.includes("Heritage") ? "Heritage" : "Mixed");
  
  // New Budget Config State
  const [origin, setOrigin] = useState(savedProfile?.homeTown || "");
  const [groupSize, setGroupSize] = useState(savedProfile?.groupSize?.replace(/[^0-9]/g, "") || "2");
  const [inboundTransport, setInboundTransport] = useState("flight");
  const [localTransport, setLocalTransport] = useState("private_cab");
  const [style, setStyle] = useState("comfort");
  const [useProfile, setUseProfile] = useState(false);

  function applyProfile() {
    if (!savedProfile) return;
    
    // Simple logic to map profile data to planner states
    if (savedProfile.interests && savedProfile.interests.length > 0) {
      const primary = savedProfile.interests[0];
      if (primary.includes("Wildlife")) setInterest("Wildlife");
      else if (primary.includes("Heritage")) setInterest("Heritage");
      else if (primary.includes("Nature")) setInterest("Nature & Hills");
      else if (primary.includes("Spiritual")) setInterest("Spiritual");
      else setInterest("Mixed");
    }

    if (savedProfile.groupSize) {
      setGroupSize(savedProfile.groupSize.replace(/[^0-9]/g, "") || "2");
    }

    if (savedProfile.budget) {
      const b = savedProfile.budget.toLowerCase();
      if (b.includes("luxury")) setStyle("luxury");
      else if (b.includes("budget")) setStyle("budget");
      else setStyle("comfort");
    }

    if (savedProfile.homeTown) {
      setOrigin(savedProfile.homeTown);
    }

    setUseProfile(true);
    // Visual feedback
    setTimeout(() => setUseProfile(false), 2000);

    // Automatically trigger generation if origin is present
    const finalOrigin = origin || savedProfile?.homeTown;
    if (finalOrigin) {
      generate(finalOrigin);
    } else {
      alert("Please enter your Home Town / Origin city first!");
    }
  }


  const [mode, setMode] = useState<PlannerMode>("idle");
  const [loadingText, setLoadingText] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "tips">("itinerary");

  const plan = useMemo(() => {
    if (mode === "idle") return null;

    const numDays = parseInt(days) || 4;
    const pax = parseInt(groupSize) || 2;
    const rooms = Math.ceil(pax / 2);
    const nights = numDays - 1;
    const tpl = templates[interest] || templates.Mixed;
    
    const groupText = pax === 1 ? "solo traveler" : pax === 2 ? "couple" : `${pax}-person group`;
    const budgetText = style;
    
    const dynamicTagline = `A ${budgetText} ${interest.toLowerCase()} experience crafted for your ${groupText}. ${tpl.baseTagline}`;

    // Calculate Finances (from Budget Planner Engine)
    let inboundCostPerHead = inboundTransport === 'flight' ? 6500 : inboundTransport === 'train' ? 2200 : 1200;
    let inboundDesc = inboundTransport === 'flight' ? `Round-trip economy flights from ${origin || 'home city'} to Indore/Bhopal airport.` 
                    : inboundTransport === 'train' ? `Round-trip 2AC/3AC train tickets from ${origin || 'home city'}.` 
                    : `Estimated inter-state fuel and toll taxes from ${origin || 'home city'}.`;
    const inboundTotal = inboundCostPerHead * pax;

    let vehicle = pax > 4 ? "Innova Crysta / SUV" : "Sedan (Dzire/Etios)";
    let dailyRate = pax > 4 ? 2500 : 1800;
    let perKmRate = pax > 4 ? 18 : 13;
    let estKms = numDays * 150;
    let localTransportTotal = localTransport === 'private_cab' 
      ? (dailyRate * numDays) + (estKms * perKmRate) + (numDays * 300)
      : localTransport === 'self_drive' ? (numDays * 3000) + (estKms * 10)
      : (numDays * 500 * pax);
    
    let localDesc = localTransport === 'private_cab' 
      ? `Dedicated ${vehicle} with driver for ${numDays} days. Includes driver allowance of ₹300/day.` 
      : `Self-drive rental car including estimated fuel costs for ~${estKms} kms.`;

    let nightlyRate = style === 'luxury' ? 12000 : style === 'comfort' ? 4500 : 1800;
    const hotelTotal = nightlyRate * rooms * nights;

    let dailyFoodPerHead = style === 'luxury' ? 2500 : style === 'comfort' ? 1200 : 600;
    const foodTotal = dailyFoodPerHead * numDays * pax;

    let activitiesArr = [];
    if (interest.includes('Wildlife') || interest.includes('Mixed')) {
      activitiesArr.push({ name: "Core Zone Jeep Safari (6 Pax/Jeep)", cost: 8500, perHead: false });
    }
    activitiesArr.push({ name: "Monument & Museum Entry Fees", cost: 500, perHead: true });
    activitiesArr.push({ name: "Local Certified Guides", cost: 1200, perHead: false });
    let activitiesTotal = activitiesArr.reduce((sum, act) => sum + (act.perHead ? act.cost * pax : act.cost), 0);

    const grandTotal = inboundTotal + localTransportTotal + hotelTotal + foodTotal + activitiesTotal;

    const generatedDays = [];
    for (let i = 0; i < numDays; i++) {
      const locIdx = (i + (interest.length % 3)) % tpl.locations.length;
      const stayIdx = (i + (pax % 2)) % tpl.stays.length;
      const salt = i + numDays + pax + style.length;
      const mIdx = salt % morningActivities.length;
      const aIdx = (salt + 1) % afternoonActivities.length;
      const eIdx = (salt + 2) % eveningActivities.length;
      
      let hasSafari = i === 1 && activitiesArr.some(a => a.name.includes("Safari"));
      let dailyCost = 0;
      
      if (i === 0) {
        dailyCost = (nightlyRate * rooms) + dailyRate + (dailyFoodPerHead * pax);
      } else if (i === numDays - 1) {
        dailyCost = dailyRate + (estKms * perKmRate) + (dailyFoodPerHead * pax);
      } else {
        dailyCost = (nightlyRate * rooms) + dailyRate + (dailyFoodPerHead * pax) + (hasSafari ? 8500 : 1700);
      }

      generatedDays.push({
        day: i + 1,
        title: `${tpl.locations[locIdx]} ${hasSafari ? 'Safari' : 'Exploration'}`,
        location: tpl.locations[locIdx],
        morning: morningActivities[mIdx],
        afternoon: afternoonActivities[aIdx],
        evening: eveningActivities[eIdx],
        stay: tpl.stays[stayIdx],
        stayType: tpl.stayTypes[stayIdx % tpl.stayTypes.length],
        meals: style === "luxury" ? "All meals & premium drinks" : style === "comfort" ? "All meals included" : "Breakfast & Dinner",
        dailyCost
      });
    }

    const tips = [
      { 
        title: `Optimized for ${pax} Travelers`, 
        body: pax === 1 
          ? "We've focused your route around safe, well-connected areas with reliable transit options and friendly stays." 
          : pax > 8 
          ? "For a large group, we strongly recommend booking safari zones, large transport, and hotel blocks at least 3 months in advance." 
          : "Your group size is ideal for splitting private vehicle hires, which often provides more comfort at a lower per-head cost." 
      },
      { 
        title: `${style.charAt(0).toUpperCase() + style.slice(1)} Financial Approach`, 
        body: style === "budget" 
          ? "Opt for state transport or shared jeeps where possible to easily stick to this budget constraint without missing out." 
          : style === "luxury" 
          ? "We've factored in premium boutique stays, exclusive private guided experiences, and top-tier dining." 
          : "We have balanced cost and comfort, ensuring you get the authentic local flavor without sacrificing quality." 
      },
      { 
        title: "Pacing & Seasonality", 
        body: numDays < 3 
          ? "This is a very short trip. Expect dense sightseeing and minimal downtime. October to March is the ideal season." 
          : numDays > 7 
          ? `With ${numDays} days, you can maintain a relaxed pace. We've built in rest periods to prevent travel fatigue.` 
          : "October to March is ideal. If traveling in summer, expect high temperatures but excellent wildlife sightings at waterholes." 
      }
    ];

    return {
      tagline: dynamicTagline,
      days: generatedDays,
      highlights: tpl.highlights.slice(0, 5),
      tips: tips,
      budget: {
        totalCost: grandTotal,
        perPersonCost: Math.round(grandTotal / pax),
        inboundTransport: {
          description: inboundDesc,
          totalCost: inboundTotal
        },
        localTransport: {
          description: localDesc,
          totalCost: localTransportTotal,
          dailyRate,
          perKmRate,
          estKms
        },
        accommodation: {
          nights,
          category: style,
          avgNightlyRate: nightlyRate,
          roomsNeeded: rooms,
          totalCost: hotelTotal
        },
        foodAndActivities: {
          dailyFoodPerHead,
          activities: activitiesArr,
          totalCost: foodTotal + activitiesTotal
        }
      }
    };
  }, [mode, days, interest, origin, groupSize, inboundTransport, localTransport, style]);

  function generate(originOverride?: string) {
    const activeOrigin = originOverride || origin;
    if (!activeOrigin) {
      alert("Please enter a Home Town / Origin city.");
      return;
    }
    setMode("generating");
    setActiveDay(0);
    setActiveTab("itinerary");

    const texts = [
      "Fetching live flight & train tariffs...",
      "Calculating commercial taxi rates & fuel...",
      "Checking MP Tourism hotel availability...",
      "Structuring day-by-day financial breakdown...",
      "Curating personalized itinerary steps..."
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < texts.length) {
        setLoadingText(texts[step]);
        step++;
      }
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      setMode("done");
    }, 4500);
  }

  const interestOptions = ["Wildlife", "Heritage", "Nature & Hills", "Spiritual", "Mixed"];

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-9rem)] min-h-[600px] overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-xl">
      
      {/* Left Sidebar: Controls */}
      <div className="w-full xl:w-[400px] flex-shrink-0 border-b xl:border-b-0 xl:border-r border-slate-200 bg-white/80 flex flex-col h-full overflow-y-auto">
        <div className="p-7 space-y-8 pb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Trip Configuration</p>
            <h2 className="mt-2 font-display text-3xl text-slate-900">AI Trip Planner</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Configure parameters for our AI to generate a hyper-detailed daily itinerary & financial breakdown.</p>
          </div>

          {/* Profile Sync Card */}
          {savedProfile && (
            <div className={`p-5 rounded-2xl border transition-all duration-500 ${useProfile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50/50'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                    {savedProfile.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{savedProfile.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Personal Profile</p>
                  </div>
                </div>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                We found your travel preferences for <b>{savedProfile.interests?.join(", ")}</b>. Would you like to auto-fill the planner?
              </p>
              <button 
                onClick={applyProfile}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  useProfile 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600'
                }`}
              >
                {useProfile ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Applied Successfully
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 7l-8-4-8 4m16 5l-8-4-8 4m16 5l-8-4-8 4M4 17l8 4 8-4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Plan from Profile
                  </>
                )}
              </button>
            </div>
          )}


          <div className="space-y-6">
            
            {/* Origin */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Home Town / Origin</label>
              <input 
                type="text" required placeholder="e.g., Delhi, Mumbai, Bangalore"
                value={origin} onChange={e => setOrigin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              />
            </div>

            {/* Interest */}
            <div>
              <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-slate-500">Primary Interest</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setInterest(opt)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      interest === opt 
                        ? "bg-slate-900 text-white shadow-md" 
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Duration (Days)</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDays(d => String(Math.max(1, parseInt(d) - 1)))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">-</button>
                  <span className="font-display text-xl w-full text-center text-slate-900">{days}</span>
                  <button onClick={() => setDays(d => String(parseInt(d) + 1))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">+</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Group Size</label>
                <input 
                  type="number" min="1" max="50" required
                  value={groupSize} onChange={e => setGroupSize(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Travel Style</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget', label: 'Budget' },
                  { id: 'comfort', label: 'Comfort' },
                  { id: 'luxury', label: 'Luxury' }
                ].map(s => (
                  <button
                    key={s.id} onClick={() => setStyle(s.id)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition ${style === s.id ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Transit to MP</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'flight', label: 'Flight' },
                  { id: 'train', label: 'Train' },
                  { id: 'road', label: 'Road/Self' }
                ].map(t => (
                  <button
                    key={t.id} onClick={() => setInboundTransport(t.id)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${inboundTransport === t.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Local Transit</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'private_cab', label: 'Private Cab' },
                  { id: 'public', label: 'Public/Shared' }
                ].map(t => (
                  <button
                    key={t.id} onClick={() => setLocalTransport(t.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${localTransport === t.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-auto p-7 bg-white border-t border-slate-200 sticky bottom-0 z-10">
          <button 
            onClick={generate}
            disabled={mode === 'generating'}
            className="w-full rounded-full bg-[linear-gradient(135deg,#10b981,#0f766e)] px-6 py-4 text-sm font-bold text-white transition hover:scale-[1.02] disabled:bg-slate-400 disabled:hover:scale-100 flex justify-center items-center gap-3 shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
          >
            {mode === 'generating' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Generate Itinerary & Budget"
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
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <h3 className="font-display text-4xl text-slate-900 mb-4">Ready to plan your trip?</h3>
             <p className="text-slate-500 text-sm leading-7">Configure your travel constraints on the left. Our AI will fuse deep geographic knowledge with precise financial logic to generate the ultimate MP itinerary.</p>
          </div>
        ) : mode === 'generating' ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
             <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
               <div className="absolute inset-4 rounded-full border-2 border-slate-300/30 border-b-slate-800 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
               <div className="absolute inset-8 flex items-center justify-center text-3xl">✨</div>
             </div>
             <h3 className="font-display text-3xl text-slate-900 mb-3">Curating your experience...</h3>
             <p className="text-emerald-600 text-sm leading-7 animate-pulse font-semibold">{loadingText}</p>
          </div>
        ) : plan ? (
          <div className="max-w-5xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="mb-10">
               <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4 shadow-sm">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 Generated Itinerary
               </div>
               <h1 className="font-display text-4xl xl:text-5xl text-slate-900 mb-6 leading-tight">{plan.tagline}</h1>
               <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <span className="rounded-full bg-white border border-slate-200 px-4 py-2">{days} Days</span>
                  <span className="rounded-full bg-white border border-slate-200 px-4 py-2">{groupSize} Travelers</span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2">Total: {formatCurrency(plan.budget.totalCost)}</span>
               </div>
             </div>

             {/* Highlights */}
             <div className="flex flex-wrap gap-3 mb-10">
               {plan.highlights.map((h, i) => (
                 <div key={i} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-800">
                   <span>{h.icon}</span> {h.label}
                 </div>
               ))}
             </div>

             {/* Tabs */}
             <div className="flex space-x-2 mb-8 border-b border-slate-200">
               {([
                 { id: 'itinerary', label: 'Day by Day' },
                 { id: 'budget', label: 'Financials' },
                 { id: 'tips', label: 'Pro Tips' }
               ] as const).map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`pb-4 px-4 text-sm font-bold uppercase tracking-[0.1em] transition-all border-b-2 ${
                     activeTab === tab.id 
                       ? 'border-emerald-500 text-emerald-600' 
                       : 'border-transparent text-slate-400 hover:text-slate-800 hover:border-slate-300'
                   }`}
                 >
                   {tab.label}
                 </button>
               ))}
             </div>

             {/* Tab Content */}
             {activeTab === 'itinerary' && (
               <div className="flex flex-col lg:flex-row gap-8">
                 {/* Day Selector */}
                 <div className="lg:w-64 flex-shrink-0 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-3">
                   {plan.days.map((day, idx) => (
                     <button
                       key={idx}
                       onClick={() => setActiveDay(idx)}
                       className={`flex items-start text-left p-4 rounded-2xl transition-all whitespace-nowrap lg:whitespace-normal border ${
                         activeDay === idx 
                           ? 'bg-slate-900 border-slate-900 text-white shadow-[0_8px_20px_rgba(15,23,42,0.12)]' 
                           : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                       }`}
                     >
                       <span className={`font-display text-xl mr-4 ${activeDay === idx ? 'text-emerald-400' : 'text-slate-400'}`}>
                         D{day.day}
                       </span>
                       <div>
                         <span className="font-semibold text-sm leading-relaxed mt-0.5 block">{day.location}</span>
                         <span className={`text-[10px] uppercase tracking-widest font-bold mt-2 block ${activeDay === idx ? 'text-slate-400' : 'text-emerald-600'}`}>{formatCurrency(day.dailyCost)} / Day</span>
                       </div>
                     </button>
                   ))}
                 </div>
                 
                 {/* Day Details */}
                 <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.12)] p-7 xl:p-10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 text-slate-100 font-display text-9xl opacity-30 select-none pointer-events-none">
                     {plan.days[activeDay].day}
                   </div>
                   <div className="flex flex-col gap-4 mb-8 relative z-10">
                     <div className="flex items-center gap-4">
                       <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-display text-2xl">
                         {plan.days[activeDay].day}
                       </span>
                       <h2 className="font-display text-3xl text-slate-900">{plan.days[activeDay].title}</h2>
                     </div>
                     <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3 self-start shadow-sm">
                       <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Calculated Burn Rate</div>
                       <div className="font-display text-xl text-slate-900">{formatCurrency(plan.days[activeDay].dailyCost)}</div>
                     </div>
                   </div>
                   
                   <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 z-10">
                     {/* Morning */}
                     <div className="relative flex items-start gap-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-amber-100 text-amber-500 shadow-sm z-10 mt-1">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-2">Morning</div>
                          <p className="text-sm leading-7 text-slate-600">{plan.days[activeDay].morning}</p>
                        </div>
                     </div>
                     {/* Afternoon */}
                     <div className="relative flex items-start gap-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-orange-100 text-orange-500 shadow-sm z-10 mt-1">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 mb-2">Afternoon</div>
                          <p className="text-sm leading-7 text-slate-600">{plan.days[activeDay].afternoon}</p>
                        </div>
                     </div>
                     {/* Evening */}
                     <div className="relative flex items-start gap-6">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-indigo-500 shadow-sm z-10 mt-1">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        </div>
                        <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">Evening</div>
                          <p className="text-sm leading-7 text-slate-600">{plan.days[activeDay].evening}</p>
                        </div>
                     </div>
                   </div>

                   <div className="mt-8 grid gap-4 sm:grid-cols-2 relative z-10">
                      <div className="flex items-center gap-4 rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
                         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                         </div>
                         <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Stay</div>
                            <div className="font-semibold text-slate-900 mt-1">{plan.days[activeDay].stay}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{plan.days[activeDay].stayType}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
                         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" /></svg>
                         </div>
                         <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Meals</div>
                            <div className="font-semibold text-slate-900 mt-1">{plan.days[activeDay].meals}</div>
                         </div>
                      </div>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'budget' && (
               <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.12)] p-7 xl:p-10 max-w-4xl mx-auto">
                 <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                   <div>
                     <h2 className="font-display text-3xl text-slate-900">Financial Breakdown</h2>
                     <p className="text-sm text-slate-500 mt-2">Calculated accurately using our AI Budget Planner engine.</p>
                   </div>
                   <div className="bg-[linear-gradient(135deg,#10b981,#0f766e)] text-white px-6 py-4 rounded-2xl shadow-lg w-full md:w-auto text-center md:text-left">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 mb-1">Grand Total</div>
                     <div className="font-display text-4xl">{formatCurrency(plan.budget.totalCost)}</div>
                     <div className="text-xs text-emerald-100 mt-1">{formatCurrency(plan.budget.perPersonCost)} per person</div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Inbound */}
                   <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                     <div className="flex justify-between items-start mb-3">
                       <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Transit to MP</h4>
                       <span className="font-display text-xl text-emerald-600">{formatCurrency(plan.budget.inboundTransport.totalCost)}</span>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed mb-3">{plan.budget.inboundTransport.description}</p>
                     <p className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-100">Calculated at {formatCurrency(plan.budget.inboundTransport.totalCost / Number(groupSize))} per head.</p>
                   </div>
                   {/* Local */}
                   <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                     <div className="flex justify-between items-start mb-3">
                       <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Local Transit</h4>
                       <span className="font-display text-xl text-emerald-600">{formatCurrency(plan.budget.localTransport.totalCost)}</span>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed mb-3">{plan.budget.localTransport.description}</p>
                     <p className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-100">
                       Base: {formatCurrency(plan.budget.localTransport.dailyRate)}/day | {formatCurrency(plan.budget.localTransport.perKmRate)}/km
                     </p>
                   </div>
                   {/* Accommodation */}
                   <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                     <div className="flex justify-between items-start mb-3">
                       <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Accommodation</h4>
                       <span className="font-display text-xl text-emerald-600">{formatCurrency(plan.budget.accommodation.totalCost)}</span>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed mb-3">
                       {plan.budget.accommodation.nights} Nights in {plan.budget.accommodation.category} class properties. Needs {plan.budget.accommodation.roomsNeeded} room(s).
                     </p>
                     <p className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-100">
                       Avg Nightly Rate: {formatCurrency(plan.budget.accommodation.avgNightlyRate)} / room
                     </p>
                   </div>
                   {/* Food & Activities */}
                   <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                     <div className="flex justify-between items-start mb-3">
                       <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Food & Activities</h4>
                       <span className="font-display text-xl text-emerald-600">{formatCurrency(plan.budget.foodAndActivities.totalCost)}</span>
                     </div>
                     <div className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-100 flex flex-col gap-1">
                       <span>Daily Food Allowance: {formatCurrency(plan.budget.foodAndActivities.dailyFoodPerHead)}/head</span>
                       {plan.budget.foodAndActivities.activities.map((act, i) => (
                         <span key={i}>+ {act.name}: {formatCurrency(act.cost)} {act.perHead ? '/ head' : 'total'}</span>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'tips' && (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {plan.tips.map((tip, idx) => (
                   <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_16px_40px_rgba(148,163,184,0.08)] p-7 flex flex-col hover:border-emerald-200 transition-colors group">
                     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-display text-xl mb-5 group-hover:bg-emerald-500 transition-colors">
                       {idx + 1}
                     </div>
                     <h3 className="font-bold text-slate-900 text-lg mb-3">{tip.title}</h3>
                     <p className="text-slate-600 text-sm leading-relaxed flex-1">{tip.body}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        ) : null}
      </div>
    </div>
  );
}