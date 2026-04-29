import { useState } from 'react';

type OptimizerMode = "idle" | "optimizing" | "done";

interface RouteStop {
  time: string;
  type: "start" | "food" | "sight" | "rest" | "end";
  title: string;
  desc: string;
  distanceFromLast?: string;
}

interface RouteResult {
  from: string;
  to: string;
  totalDistance: string;
  totalTime: string;
  theme: string;
  stops: RouteStop[];
}

export default function AiRouteOptimizer() {
  const [startPoint, setStartPoint] = useState('Indore');
  const [endPoint, setEndPoint] = useState('Ujjain');
  const [pace, setPace] = useState('Food & Culture Focus');
  const [maxHours, setMaxHours] = useState(8);
  
  const [mode, setMode] = useState<OptimizerMode>("idle");
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<RouteResult | null>(null);

  const locations = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Pachmarhi', 'Kanha', 'Khajuraho', 'Ujjain', 'Mandu', 'Orchha'];
  const paces = ['Direct & Fast', 'Scenic & Leisure', 'Food & Culture Focus'];

  function optimize() {
    setMode("optimizing");
    setResult(null);

    const texts = [
      "Analyzing road conditions...",
      "Identifying top-rated local eateries...",
      "Plotting heritage detours...",
      "Calculating optimal rest stops...",
      "Finalizing turn-by-turn itinerary..."
    ];
    let step = 0;
    const interval = setInterval(() => {
      if (step < texts.length) {
        setLoadingText(texts[step]);
        step++;
      }
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      
      let stops: RouteStop[] = [];
      
      if (pace === 'Food & Culture Focus') {
        stops = [
          { time: "07:00 AM", type: "start", title: `Depart from ${startPoint}`, desc: "Start early to beat city traffic and catch the morning breeze." },
          { time: "07:45 AM", type: "sight", title: "Morning Highway Temple", desc: "Quick 15-min stop at the local highway temple to seek blessings before the main journey.", distanceFromLast: "25 km" },
          { time: "08:30 AM", type: "food", title: "Tiffin Stop: Poha & Jalebi", desc: "Stop at 'Shree Dhaba' famous for freshly steamed Indori Poha and Kulhad Chai.", distanceFromLast: "45 km" },
          { time: "10:00 AM", type: "sight", title: "Village Weaver's Market", desc: "Detour into a small roadside village known for traditional Chanderi weaving.", distanceFromLast: "60 km" },
          { time: "11:30 AM", type: "sight", title: "Ancient Stepwell Ruins", desc: "Explore a hidden 11th-century Baori (stepwell) located just 2km off the main highway.", distanceFromLast: "50 km" },
          { time: "01:00 PM", type: "food", title: "Authentic Dal Bafla Lunch", desc: "Pre-vetted heritage highway restaurant offering a massive traditional MP thali.", distanceFromLast: "65 km" },
          { time: "02:30 PM", type: "rest", title: "Local Highway Market", desc: "Stretch your legs and buy fresh guavas and highway snacks from local farmers.", distanceFromLast: "40 km" },
          { time: "04:00 PM", type: "food", title: "Evening Chai & Samosa", desc: "Stop at a roadside tapri for sunset tea and spicy garadu (fried yam).", distanceFromLast: "55 km" },
          { time: "05:15 PM", type: "sight", title: "Sunset Viewpoint", desc: "Park by the highway lake bridge to catch the golden hour reflection.", distanceFromLast: "45 km" },
          { time: "06:30 PM", type: "end", title: `Arrive at ${endPoint}`, desc: "Check-in to your hotel, freshen up, and prepare for the evening.", distanceFromLast: "40 km" }
        ];
      } else if (pace === 'Scenic & Leisure') {
        stops = [
          { time: "08:00 AM", type: "start", title: `Depart from ${startPoint}`, desc: "Leisurely start after a heavy hotel breakfast." },
          { time: "09:30 AM", type: "sight", title: "Narmada River Ghat", desc: "Park by the river for a morning walk and photography.", distanceFromLast: "75 km" },
          { time: "11:00 AM", type: "rest", title: "Forest Buffer Zone Stretch", desc: "Safe parking spot surrounded by dense teak trees.", distanceFromLast: "60 km" },
          { time: "12:30 PM", type: "food", title: "Riverside Resort Lunch", desc: "Relaxed 1.5-hour lunch stop at a premium highway resort.", distanceFromLast: "50 km" },
          { time: "02:30 PM", type: "sight", title: "Waterfall Detour", desc: "A short 15-minute hike from the highway to a hidden monsoon waterfall.", distanceFromLast: "40 km" },
          { time: "04:00 PM", type: "rest", title: "Coffee at Valley Overlook", desc: "Grab espresso while looking over the Satpura mountain ranges.", distanceFromLast: "45 km" },
          { time: "05:30 PM", type: "end", title: `Arrive at ${endPoint}`, desc: "Arrive just in time for high tea.", distanceFromLast: "60 km" }
        ];
      } else {
        // Direct & Fast
        stops = [
          { time: "06:00 AM", type: "start", title: `Depart from ${startPoint}`, desc: "Hit the expressways before dawn to avoid all heavy truck traffic." },
          { time: "08:30 AM", type: "food", title: "Quick Drive-Thru Breakfast", desc: "Combined fuel stop, clean washrooms, and quick takeaway sandwiches.", distanceFromLast: "160 km" },
          { time: "11:00 AM", type: "rest", title: "Toll Plaza Stretch", desc: "Quick 10-minute leg stretch and driver switch if necessary.", distanceFromLast: "140 km" },
          { time: "12:30 PM", type: "end", title: `Arrive at ${endPoint}`, desc: "Direct and fast arrival.", distanceFromLast: "110 km" }
        ];
      }

      // Filter stops based on maxHours (very crude simulation of dropping stops if time is tight)
      if (maxHours < 6 && stops.length > 5) {
        stops = stops.filter((_, i) => i === 0 || i === stops.length - 1 || i === Math.floor(stops.length / 2));
        stops[1].time = "Mid-Trip";
        stops[2].time = "Arrival";
      }

      setResult({
        from: startPoint,
        to: endPoint,
        totalDistance: "~425 km",
        totalTime: pace === 'Direct & Fast' ? "6.5 Hours" : `${maxHours} Hours`,
        theme: pace,
        stops
      });
      
      setMode("done");
    }, 2800);
  }

  const stopColors = {
    start: "bg-slate-900 text-white border-slate-900",
    food: "bg-amber-50 text-amber-600 border-amber-200",
    sight: "bg-sky-50 text-sky-600 border-sky-200",
    rest: "bg-purple-50 text-purple-600 border-purple-200",
    end: "bg-emerald-500 text-white border-emerald-500"
  };

  const stopIcons = {
    start: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
    food: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    sight: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    rest: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    end: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-9rem)] min-h-[600px] overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-xl">
      
      {/* Left Panel: Configuration */}
      <div className="w-full xl:w-[420px] flex-shrink-0 border-b xl:border-b-0 xl:border-r border-slate-200 bg-white/80 flex flex-col h-full overflow-y-auto">
        <div className="p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-600 mb-2">Road Intelligence</p>
          <h1 className="font-display text-4xl text-slate-900 mb-4 tracking-tight">AI Route Optimizer</h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-10">
            Generate a step-by-step road trip plan. We map out precise lunch stops, scenic detours, and tiffin breaks so you never drive blind.
          </p>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Origin</label>
                <select 
                  value={startPoint} 
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
                >
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Destination</label>
                <select 
                  value={endPoint} 
                  onChange={(e) => setEndPoint(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
                >
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Max Travel Duration</label>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{maxHours} Hours</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="10" 
                value={maxHours} 
                onChange={(e) => setMaxHours(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-semibold">
                <span>4h (Fast)</span>
                <span>10h (Leisure)</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Travel Pace & Stops</label>
              <div className="flex flex-col gap-2">
                {paces.map(p => (
                  <button
                    key={p}
                    onClick={() => setPace(p)}
                    className={`text-left px-5 py-3.5 rounded-xl border transition-all ${
                      pace === p 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-semibold text-sm">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-8 bg-white border-t border-slate-200 sticky bottom-0 z-10">
          <button 
            onClick={optimize}
            disabled={mode === 'optimizing' || startPoint === endPoint}
            className="w-full rounded-full bg-[linear-gradient(135deg,#10b981,#0f766e)] px-6 py-4 text-sm font-bold text-white transition hover:scale-[1.02] disabled:bg-slate-400 disabled:hover:scale-100 flex justify-center items-center gap-3 shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
          >
            {mode === 'optimizing' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mapping Details...
              </>
            ) : startPoint === endPoint ? (
              "Origin & Destination Identical"
            ) : (
              "Generate Full Itinerary"
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Result */}
      <div className="flex-1 relative overflow-y-auto bg-slate-50/50 p-6 xl:p-12">
        {mode === 'idle' ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-[0_16px_32px_rgba(148,163,184,0.15)] text-emerald-500">
               <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
               </svg>
            </div>
            <h2 className="font-display text-4xl text-slate-900 mb-4">Awaiting Endpoints</h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-sm">
              Select your origin, destination, and exact time limit. We will generate an extremely detailed step-by-step route including specific temples, highway dhabas, and detours.
            </p>
          </div>
        ) : mode === 'optimizing' ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
             <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" style={{ animationDuration: '1s' }}></div>
               <div className="absolute inset-4 rounded-full border-2 border-slate-300 border-b-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
               <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <h3 className="font-display text-3xl text-slate-900 mb-3 tracking-wide">Plotting Waypoints...</h3>
             <p className="text-emerald-600 text-sm tracking-widest uppercase font-bold animate-pulse">{loadingText}</p>
          </div>
        ) : result ? (
          <div className="w-full max-w-5xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Header Map Visualization */}
            <div className="relative h-[220px] shrink-0 rounded-[2rem] overflow-hidden mb-10 bg-slate-900 shadow-[0_20px_60px_rgba(148,163,184,0.2)] flex items-center justify-between px-10 xl:px-20 border border-slate-800">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              
              {/* Route Line */}
              <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-700 -translate-y-1/2 overflow-hidden">
                <div className="h-full bg-emerald-500 w-full animate-[slideRight_2s_ease-out]"></div>
              </div>

              {/* Endpoints */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] mb-3"></div>
                <h3 className="text-2xl font-display text-white">{result.from}</h3>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Origin</p>
              </div>

              <div className="relative z-10 flex flex-col items-center bg-slate-900 px-6 py-2 rounded-full border border-slate-700">
                <p className="text-xs font-bold text-emerald-400">{result.totalDistance}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{result.totalTime}</p>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-[var(--color-gold)] shadow-[0_0_15px_rgba(250,204,21,0.4)] mb-3"></div>
                <h3 className="text-2xl font-display text-white">{result.to}</h3>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Destination</p>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.12)] p-8 xl:p-12">
              <div className="flex justify-between items-end mb-10 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-display text-slate-900">Step-by-Step Road Guide</h2>
                  <p className="text-sm text-slate-500 mt-2">Optimized for {result.theme} &middot; Max {maxHours} Hours</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-lg">
                  {result.stops.length} Stops Plotted
                </div>
              </div>

              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-16 top-4 bottom-4 w-px bg-slate-200"></div>

                <div className="space-y-10">
                  {result.stops.map((stop, idx) => (
                    <div key={idx} className="relative flex items-start gap-8 group">
                      
                      {/* Time */}
                      <div className="w-24 shrink-0 text-right pt-2">
                        <span className="text-sm font-bold text-slate-900">{stop.time}</span>
                      </div>

                      {/* Icon Node */}
                      <div className="relative z-10 shrink-0 mt-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white ${stopColors[stop.type].split(' ')[2]} ${stopColors[stop.type].split(' ')[1]} transition-transform group-hover:scale-110 shadow-sm`}>
                          {stopIcons[stop.type]}
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 rounded-[1.5rem] p-6 border transition-all hover:shadow-md ${
                        stop.type === 'start' || stop.type === 'end' 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-white border-slate-200 hover:border-emerald-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-slate-900">{stop.title}</h4>
                          {stop.distanceFromLast && (
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                              +{stop.distanceFromLast}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{stop.desc}</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
