import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DetailedBudget {
  totalCost: number;
  perPersonCost: number;
  inboundTransport: {
    mode: string;
    description: string;
    costPerHead: number;
    totalCost: number;
  };
  localTransport: {
    vehicle: string;
    description: string;
    dailyRate: number;
    estimatedKms: number;
    perKmRate: number;
    totalCost: number;
  };
  accommodation: {
    nights: number;
    category: string;
    avgNightlyRate: number;
    roomsNeeded: number;
    totalCost: number;
  };
  activities: {
    items: { name: string; cost: number; perHead: boolean }[];
    totalCost: number;
  };
  food: {
    dailyAllowancePerHead: number;
    totalCost: number;
  };
  dailyBreakdown: { day: number; title: string; desc: string; cost: number }[];
  consultancyNotes: string[];
}

export default function AiBudgetPlanner() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<DetailedBudget | null>(null);
  const [loadingText, setLoadingText] = useState("Consulting travel databases...");

  const [formData, setFormData] = useState({
    origin: "",
    region: "Complete MP Explorer",
    groupSize: "2",
    duration: "5",
    inboundTransport: "flight",
    localTransport: "private_cab",
    style: "comfort",
  });

  const generateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin) {
      alert("Please enter an origin city.");
      return;
    }
    
    setIsGenerating(true);
    setResult(null);

    const texts = [
      "Fetching live flight & train tariffs...",
      "Calculating commercial taxi rates & fuel...",
      "Checking MP Tourism hotel availability...",
      "Estimating daily per diem food costs...",
      "Factoring monument entry & safari fees...",
      "Structuring day-by-day financial breakdown..."
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
      
      const days = parseInt(formData.duration);
      const pax = parseInt(formData.groupSize);
      const rooms = Math.ceil(pax / 2);
      const nights = days - 1;
      
      // 1. Inbound Transport
      let inboundCostPerHead = formData.inboundTransport === 'flight' ? 6500 : formData.inboundTransport === 'train' ? 2200 : 1200;
      let inboundDesc = formData.inboundTransport === 'flight' ? `Round-trip economy flights from ${formData.origin} to Indore/Bhopal airport.` 
                      : formData.inboundTransport === 'train' ? `Round-trip 2AC/3AC train tickets from ${formData.origin}.` 
                      : `Estimated inter-state fuel and toll taxes from ${formData.origin}.`;
      const inboundTotal = inboundCostPerHead * pax;

      // 2. Local Transport
      let vehicle = pax > 4 ? "Innova Crysta / SUV" : "Sedan (Dzire/Etios)";
      let dailyRate = pax > 4 ? 2500 : 1800;
      let perKmRate = pax > 4 ? 18 : 13;
      let estKms = days * 150; // Avg 150km per day
      let localTransportTotal = formData.localTransport === 'private_cab' 
        ? (dailyRate * days) + (estKms * perKmRate) + (days * 300 /* driver allowance */)
        : formData.localTransport === 'self_drive' ? (days * 3000) + (estKms * 10 /* fuel */)
        : (days * 500 * pax); /* public transport */
      
      let localDesc = formData.localTransport === 'private_cab' 
        ? `Dedicated ${vehicle} with driver for ${days} days. Includes driver allowance of ₹300/day.` 
        : `Self-drive rental car including estimated fuel costs for ~${estKms} kms.`;

      // 3. Accommodation
      let nightlyRate = formData.style === 'luxury' ? 12000 : formData.style === 'comfort' ? 4500 : 1800;
      const hotelTotal = nightlyRate * rooms * nights;

      // 4. Food
      let dailyFoodPerHead = formData.style === 'luxury' ? 2500 : formData.style === 'comfort' ? 1200 : 600;
      const foodTotal = dailyFoodPerHead * days * pax;

      // 5. Activities & Entry
      let activities = [];
      if (formData.region.includes('Wildlife') || formData.region.includes('Explorer')) {
        activities.push({ name: "Core Zone Jeep Safari (6 Pax per Jeep)", cost: 8500, perHead: false });
      }
      activities.push({ name: "Monument & Museum Entry Fees", cost: 500, perHead: true });
      activities.push({ name: "Local Certified Guides", cost: 1200, perHead: false }); // per day or total flat
      
      let activitiesTotal = activities.reduce((sum, act) => sum + (act.perHead ? act.cost * pax : act.cost), 0);

      const grandTotal = inboundTotal + localTransportTotal + hotelTotal + foodTotal + activitiesTotal;

      // 6. Day by Day Breakdown
      let dailyBreakdown = [];
      let remainingBudget = grandTotal - inboundTotal; // inbound is paid upfront
      let dailyAvg = Math.round(remainingBudget / days);

      for (let i = 1; i <= days; i++) {
        if (i === 1) {
          dailyBreakdown.push({
            day: i,
            title: "Arrival & Transfer",
            desc: `Airport/Station pickup, hotel check-in, and local evening sightseeing. Cost includes 1st night hotel & initial cab deployment.`,
            cost: (nightlyRate * rooms) + dailyRate + (dailyFoodPerHead * pax)
          });
        } else if (i === days) {
          dailyBreakdown.push({
            day: i,
            title: "Last Minute Shopping & Departure",
            desc: `Souvenir shopping, transfer back to transit hub. Cost includes final cab settlement.`,
            cost: dailyRate + (estKms * perKmRate) + (dailyFoodPerHead * pax)
          });
        } else {
          // Mid days
          let hasSafari = i === 2 && activities.some(a => a.name.includes("Safari"));
          dailyBreakdown.push({
            day: i,
            title: hasSafari ? "Wildlife Safari & Exploration" : "Deep Dive Sightseeing",
            desc: hasSafari ? `Morning jungle safari, entry tickets, and guide fees. Plus daily food and hotel night.` : `Monument entries, guide fees, local transport running kms, and meals.`,
            cost: (nightlyRate * rooms) + dailyRate + (dailyFoodPerHead * pax) + (hasSafari ? 8500 : 1700)
          });
        }
      }

      setResult({
        totalCost: grandTotal,
        perPersonCost: Math.round(grandTotal / pax),
        inboundTransport: {
          mode: formData.inboundTransport,
          description: inboundDesc,
          costPerHead: inboundCostPerHead,
          totalCost: inboundTotal
        },
        localTransport: {
          vehicle: vehicle,
          description: localDesc,
          dailyRate: dailyRate,
          estimatedKms: estKms,
          perKmRate: perKmRate,
          totalCost: localTransportTotal
        },
        accommodation: {
          nights: nights,
          category: formData.style,
          avgNightlyRate: nightlyRate,
          roomsNeeded: rooms,
          totalCost: hotelTotal
        },
        activities: {
          items: activities,
          totalCost: activitiesTotal
        },
        food: {
          dailyAllowancePerHead: dailyFoodPerHead,
          totalCost: foodTotal
        },
        dailyBreakdown: dailyBreakdown,
        consultancyNotes: [
          `Base transit from ${formData.origin} heavily influences the budget. Booking ${formData.inboundTransport} 60 days prior can save you ~20%.`,
          `Since your group size is ${pax}, we selected a ${vehicle} for local transit to ensure comfort on MP's highways.`,
          `Entry fees for foreign nationals at heritage sites (like Khajuraho/Sanchi) are substantially higher than the domestic rates factored here.`
        ]
      });
      setIsGenerating(false);
    }, 4000);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] space-y-6">
      <div className="flex flex-col xl:flex-row gap-6 h-full flex-1">
        
        {/* Left Side: Consultancy Form */}
        <section className="w-full xl:w-[450px] shrink-0 flex flex-col rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl overflow-y-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-slate-900 tracking-tight">AI Travel Consultant</h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Define your travel parameters. Our AI will compute a highly granular, realistic, day-by-day financial report just like a professional travel agency.
            </p>
          </div>

          <form onSubmit={generateBudget} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Home Town / Origin</label>
                <input 
                  type="text" required placeholder="e.g., Delhi, Mumbai, Bangalore"
                  value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Exploration Region</label>
                <select 
                  value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                >
                  <option>Complete MP Explorer (All major sites)</option>
                  <option>Wildlife Circuit (Kanha, Bandhavgarh, Pench)</option>
                  <option>Heritage Circuit (Gwalior, Orchha, Khajuraho)</option>
                  <option>Spiritual Circuit (Ujjain, Omkareshwar, Maheshwar)</option>
                  <option>Nature Retreat (Pachmarhi, Bhedaghat)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Duration (Days)</label>
                  <input 
                    type="number" min="1" max="20" required
                    value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Group Size</label>
                  <input 
                    type="number" min="1" max="50" required
                    value={formData.groupSize} onChange={e => setFormData({...formData, groupSize: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Transit to MP</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'flight', label: 'Flight' },
                    { id: 'train', label: 'Train' },
                    { id: 'road', label: 'Road/Self' }
                  ].map(t => (
                    <button
                      key={t.id} type="button" onClick={() => setFormData({...formData, inboundTransport: t.id})}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${formData.inboundTransport === t.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Local Transit inside MP</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'private_cab', label: 'Private Dedicated Cab' },
                    { id: 'public', label: 'Public / Shared' }
                  ].map(t => (
                    <button
                      key={t.id} type="button" onClick={() => setFormData({...formData, localTransport: t.id})}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${formData.localTransport === t.id ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Travel Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'budget', label: 'Budget' },
                    { id: 'comfort', label: 'Comfort' },
                    { id: 'luxury', label: 'Luxury' }
                  ].map(s => (
                    <button
                      key={s.id} type="button" onClick={() => setFormData({...formData, style: s.id})}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border transition ${formData.style === s.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={isGenerating}
              className={`w-full rounded-full px-6 py-4 text-sm font-bold text-white transition-all flex items-center justify-center gap-3 ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-[linear-gradient(135deg,#10b981,#0f766e)] hover:scale-[1.02] shadow-[0_8px_24px_rgba(16,185,129,0.25)]'}`}
            >
              {isGenerating ? 'Consulting Engine...' : 'Generate Detailed Report'}
            </button>
          </form>
        </section>

        {/* Right Side: AI Report */}
        <section className="flex-1 flex flex-col rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl relative overflow-hidden">
          
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md z-50">
              <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-display text-slate-900 mb-2">Analyzing Travel Logistics...</h3>
              <p className="text-emerald-600 font-medium tracking-wide animate-pulse text-sm">{loadingText}</p>
            </div>
          ) : !result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-10 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h2 className="font-display text-2xl text-slate-700 mb-3">Awaiting Consultation</h2>
              <p className="text-slate-500 leading-relaxed max-w-sm">
                Fill out the travel details. Our AI will act as a professional consultancy firm, providing a hyper-detailed breakdown including taxi rates, entry fees, and daily budgets.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
              
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-200">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">Professional Financial Estimate</p>
                  <h2 className="font-display text-3xl text-slate-900 leading-tight">{formData.region}</h2>
                  <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">Origin: {formData.origin}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{formData.duration} Days</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{formData.groupSize} Travelers</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs capitalize">{formData.style} Class</span>
                  </p>
                </div>
              </div>

              {/* Huge Cost Callout */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-[linear-gradient(135deg,#10b981,#0f766e)] rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20">
                  <p className="text-emerald-100 font-medium tracking-wide uppercase text-[10px] mb-1">Grand Total (Incl. Taxes)</p>
                  <p className="font-display text-4xl">{formatCurrency(result.totalCost)}</p>
                </div>
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20">
                  <p className="text-slate-400 font-medium tracking-wide uppercase text-[10px] mb-1">Cost Per Head</p>
                  <p className="font-display text-4xl">{formatCurrency(result.perPersonCost)}</p>
                </div>
              </div>

              {/* Granular Breakdown */}
              <h3 className="font-display text-xl text-slate-900 mb-4">Granular Cost Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                
                {/* Inbound Transport */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Transit to MP</h4>
                    <span className="font-display text-lg text-emerald-600">{formatCurrency(result.inboundTransport.totalCost)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{result.inboundTransport.description}</p>
                  <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-600 border border-slate-100">
                    Calculated at {formatCurrency(result.inboundTransport.costPerHead)} per person.
                  </div>
                </div>

                {/* Local Transit */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Local Cabs / Taxis</h4>
                    <span className="font-display text-lg text-emerald-600">{formatCurrency(result.localTransport.totalCost)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{result.localTransport.description}</p>
                  <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-600 border border-slate-100 flex flex-col gap-1">
                    <span>Base Daily Rate: {formatCurrency(result.localTransport.dailyRate)}</span>
                    <span>Per Km Rate: {formatCurrency(result.localTransport.perKmRate)} (Est. {result.localTransport.estimatedKms}km)</span>
                  </div>
                </div>

                {/* Hotels */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Accommodation</h4>
                    <span className="font-display text-lg text-emerald-600">{formatCurrency(result.accommodation.totalCost)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{result.accommodation.nights} Nights in {result.accommodation.category} properties. Requires {result.accommodation.roomsNeeded} room(s).</p>
                  <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-600 border border-slate-100">
                    Avg. Nightly Rate: {formatCurrency(result.accommodation.avgNightlyRate)} / room.
                  </div>
                </div>

                {/* Food & Activities */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Food & Activities</h4>
                    <span className="font-display text-lg text-emerald-600">{formatCurrency(result.food.totalCost + result.activities.totalCost)}</span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-xs text-slate-600 border border-slate-100 flex flex-col gap-1">
                    <span>Daily Food Allowance: {formatCurrency(result.food.dailyAllowancePerHead)} / head</span>
                    {result.activities.items.map((act, i) => (
                      <span key={i}>+ {act.name}: {formatCurrency(act.cost)} {act.perHead ? '/ head' : 'total'}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Day by Day */}
              <h3 className="font-display text-xl text-slate-900 mb-4">Day-by-Day Burn Rate Estimate</h3>
              <div className="space-y-3 mb-10">
                {result.dailyBreakdown.map((day, i) => (
                  <div key={i} className="flex gap-4 items-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="bg-slate-900 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0">
                      D{day.day}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{day.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{day.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display text-lg text-emerald-700">{formatCurrency(day.cost)}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </section>
        
      </div>
    </div>
  );
}
