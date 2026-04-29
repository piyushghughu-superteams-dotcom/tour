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
  const [interest, setInterest] = useState(savedProfile?.interests?.[0]?.includes("Wildlife") ? "Wildlife" : savedProfile?.interests?.[0]?.includes("Heritage") ? "Heritage" : "default");
  const initialBudgetMap: Record<string, number> = { "Budget": 8000, "Mid Range": 15000, "Premium": 35000, "Luxury": 60000 };
  const [budgetPerPerson, setBudgetPerPerson] = useState(initialBudgetMap[savedProfile?.budget || "Mid Range"] || 15000);
  const [group, setGroup] = useState(savedProfile?.groupSize || "2 People");
  const [mode, setMode] = useState<PlannerMode>("idle");
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "tips">("itinerary");

  const plan = useMemo(() => {
    const numDays = parseInt(days) || 4;
    const tpl = templates[interest] || templates.Mixed;
    
    let budgetClass = "Mid Range";
    if (budgetPerPerson <= 10000) budgetClass = "Budget";
    else if (budgetPerPerson >= 40000) budgetClass = "Luxury";
    else if (budgetPerPerson >= 25000) budgetClass = "Premium";
    
    const groupCount = group === "Solo" ? 1 : group === "2 People" ? 2 : group === "3 to 5" ? 4 : group === "6 to 10" ? 8 : 12;

    const groupText = group === "Solo" ? "solo traveler" : group === "2 People" ? "couple" : `${group} group`;
    const budgetText = budgetClass.toLowerCase();
    
    const dynamicTagline = `A ${budgetText} ${interest.toLowerCase()} experience crafted for your ${groupText}. ${tpl.baseTagline}`;

    // Procedurally generate the requested number of days
    const generatedDays = [];
    for (let i = 0; i < numDays; i++) {
      const locIdx = (i + (interest.length % 3)) % tpl.locations.length;
      const stayIdx = (i + (group.length % 2)) % tpl.stays.length;
      
      // Add pseudo-randomness based on selections to make each combo unique
      const salt = i + numDays + group.length + budgetClass.length;
      const mIdx = salt % morningActivities.length;
      const aIdx = (salt + 1) % afternoonActivities.length;
      const eIdx = (salt + 2) % eveningActivities.length;

      generatedDays.push({
        day: i + 1,
        title: `${tpl.locations[locIdx]} Exploration`,
        location: tpl.locations[locIdx],
        morning: morningActivities[mIdx],
        afternoon: afternoonActivities[aIdx],
        evening: eveningActivities[eIdx],
        stay: tpl.stays[stayIdx],
        stayType: tpl.stayTypes[stayIdx % tpl.stayTypes.length],
        meals: budgetClass === "Luxury" ? "All meals & premium drinks" : budgetClass === "Premium" ? "All meals included" : "Breakfast & Dinner",
      });
    }

    // Dynamic budget calculation based on selected per-person budget
    const targetTotalBudget = budgetPerPerson * groupCount;
    const allocations = [
      { category: "Accommodation", icon: "🏨", pct: 0.4 },
      { category: "Transport & Fuel", icon: "🚙", pct: 0.25 },
      { category: "Activities & Permits", icon: "🎫", pct: 0.15 },
      { category: "Food & Dining", icon: "🍛", pct: 0.2 },
    ];
    
    const calculatedBudget = allocations.map(c => {
      const exact = targetTotalBudget * c.pct;
      const low = Math.round((exact * 0.85) / 100) * 100;
      const high = Math.round((exact * 1.15) / 100) * 100;
      return { category: c.category, low, high, icon: c.icon };
    });

    // Dynamic AI Tips
    const tips = [
      { 
        title: `Optimized for ${group}`, 
        body: group === "Solo" 
          ? "We've focused your route around safe, well-connected areas with reliable transit options and friendly stays." 
          : group === "10+" 
          ? "For a group of 10+, we strongly recommend booking safari zones, large transport, and hotel blocks at least 3 months in advance." 
          : "Your group size is ideal for splitting private vehicle hires, which often provides more comfort at a lower per-head cost." 
      },
      { 
        title: `${budgetClass} Approach`, 
        body: budgetClass === "Budget" 
          ? "Opt for state transport or shared jeeps where possible to easily stick to this budget constraint without missing out." 
          : budgetClass === "Luxury" 
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
      budget: calculatedBudget,
      highlights: tpl.highlights.slice(0, 5),
      tips: tips
    };
  }, [days, interest, budgetPerPerson, group]);

  const totalLow = plan.budget.reduce((s, b) => s + b.low, 0);
  const totalHigh = plan.budget.reduce((s, b) => s + b.high, 0);

  function generate() {
    setMode("generating");
    setActiveDay(0);
    setActiveTab("itinerary");
    setTimeout(() => setMode("done"), 2800);
  }

  const interestOptions = ["Wildlife", "Heritage", "Nature & Hills", "Spiritual", "Mixed"];
  const groupOptions = ["Solo", "2 People", "3 to 5", "6 to 10", "10+"];

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-9rem)] min-h-[600px] overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-xl">
      
      {/* Left Sidebar: Controls */}
      <div className="w-full xl:w-[400px] flex-shrink-0 border-b xl:border-b-0 xl:border-r border-slate-200 bg-white/80 flex flex-col h-full overflow-y-auto">
        <div className="p-7 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Trip Configuration</p>
            <h2 className="mt-2 font-display text-3xl text-slate-900">AI Trip Planner</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">Adjust the parameters below to generate a tailored Madhya Pradesh itinerary.</p>
          </div>

          <div className="space-y-6">
            {/* Days */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Days</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setDays(d => String(Math.max(1, parseInt(d) - 1)))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-600 transition hover:bg-slate-50"
                >-</button>
                <span className="font-display text-3xl w-12 text-center text-slate-900">{days}</span>
                <button 
                  onClick={() => setDays(d => String(parseInt(d) + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-medium text-slate-600 transition hover:bg-slate-50"
                >+</button>
              </div>
            </div>

            {/* Primary Interest */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Primary Interest</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setInterest(opt)}
                    className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
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

            {/* Budget (Per Person) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Per Person Budget</label>
                <span className="font-semibold text-slate-900">₹{budgetPerPerson.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="2000" 
                max="100000" 
                step="1000" 
                value={budgetPerPerson}
                onChange={(e) => setBudgetPerPerson(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>₹2,000</span>
                <span>₹100,000</span>
              </div>
            </div>

            {/* Group Size */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Group Size</label>
              <div className="flex flex-wrap gap-2">
                {groupOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setGroup(opt)}
                    className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all ${
                      group === opt 
                        ? "bg-slate-900 text-white shadow-md" 
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {opt}
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
            className="w-full rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-400 flex justify-center items-center gap-3 shadow-md"
          >
            {mode === 'generating' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Plan...
              </>
            ) : (
              "Generate Itinerary"
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
             <p className="text-slate-500 text-sm leading-7">Select your preferences on the left and our AI will generate a personalized Madhya Pradesh itinerary tailored to your interests and budget.</p>
          </div>
        ) : mode === 'generating' ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
             <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
               <div className="absolute inset-4 rounded-full border-2 border-slate-300/30 border-b-slate-800 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
               <div className="absolute inset-8 flex items-center justify-center text-3xl">✨</div>
             </div>
             <h3 className="font-display text-3xl text-slate-900 mb-3">Curating your experience...</h3>
             <p className="text-slate-500 text-sm leading-7 animate-pulse">Analyzing {interest.toLowerCase()} destinations and optimizing routes for {days} days in Madhya Pradesh.</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto pb-10">
             <div className="mb-10">
               <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 mb-4">
                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 Generated Itinerary
               </div>
               <h1 className="font-display text-4xl xl:text-5xl text-slate-900 mb-6 leading-tight">{plan.tagline}</h1>
               <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <span className="rounded-full bg-white border border-slate-200 px-4 py-2">{days} Days</span>
                  <span className="rounded-full bg-white border border-slate-200 px-4 py-2">{group}</span>
                  <span className="rounded-full bg-white border border-slate-200 px-4 py-2">Est. ₹{totalLow.toLocaleString()} - ₹{totalHigh.toLocaleString()}</span>
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
                 { id: 'budget', label: 'Budget Breakdown' },
                 { id: 'tips', label: 'Pro Tips' }
               ] as const).map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`pb-4 px-4 text-sm font-semibold uppercase tracking-[0.1em] transition-all border-b-2 ${
                     activeTab === tab.id 
                       ? 'border-emerald-500 text-emerald-600' 
                       : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
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
                 <div className="lg:w-56 flex-shrink-0 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-3">
                   {plan.days.map((day, idx) => (
                     <button
                       key={idx}
                       onClick={() => setActiveDay(idx)}
                       className={`flex items-start text-left p-4 rounded-2xl transition-all whitespace-nowrap lg:whitespace-normal border ${
                         activeDay === idx 
                           ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-[0_8px_20px_rgba(16,185,129,0.12)]' 
                           : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                       }`}
                     >
                       <span className={`font-display text-xl mr-4 ${activeDay === idx ? 'text-emerald-600' : 'text-slate-400'}`}>
                         D{day.day}
                       </span>
                       <span className="font-semibold text-sm leading-relaxed mt-0.5">{day.location}</span>
                     </button>
                   ))}
                 </div>
                 
                 {/* Day Details */}
                 <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.12)] p-7 xl:p-10">
                   <div className="flex items-center gap-4 mb-8">
                     <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-display text-2xl">
                       {plan.days[activeDay].day}
                     </span>
                     <h2 className="font-display text-3xl text-slate-900">{plan.days[activeDay].title}</h2>
                   </div>
                   
                   <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
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

                   <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-4 rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                         </div>
                         <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Stay</div>
                            <div className="font-semibold text-slate-900 mt-1">{plan.days[activeDay].stay}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{plan.days[activeDay].stayType}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
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
               <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.12)] p-7 xl:p-10 max-w-3xl mx-auto">
                 <h2 className="font-display text-3xl text-slate-900 mb-8">Estimated Costs</h2>
                 <div className="space-y-4">
                   {plan.budget.map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                       <div className="flex items-center gap-4">
                         <div className="text-3xl bg-slate-50 h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm">{item.icon}</div>
                         <div className="font-semibold text-slate-800">{item.category}</div>
                       </div>
                       <div className="text-right">
                         <div className="font-bold text-slate-900 text-lg">₹{item.low.toLocaleString()} - ₹{item.high.toLocaleString()}</div>
                       </div>
                     </div>
                   ))}
                   <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-950 text-white mt-8 shadow-xl">
                     <div className="font-display text-2xl">Total Estimated Cost</div>
                     <div className="font-display text-2xl text-emerald-400">₹{totalLow.toLocaleString()} - ₹{totalHigh.toLocaleString()}</div>
                   </div>
                   <p className="text-sm text-slate-500 text-center mt-6">Costs are approximate and for {group}. Flight/train tickets to MP are not included.</p>
                 </div>
               </div>
             )}

             {activeTab === 'tips' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {plan.tips.map((tip, idx) => (
                   <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_16px_40px_rgba(148,163,184,0.08)] p-7 flex flex-col hover:border-slate-300 transition-colors">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-display text-xl">
                         {idx + 1}
                       </div>
                       <h3 className="font-bold text-slate-900 text-lg">{tip.title}</h3>
                     </div>
                     <p className="text-slate-600 text-sm leading-7 flex-1">{tip.body}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}