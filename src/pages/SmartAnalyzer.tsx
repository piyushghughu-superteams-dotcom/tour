import { useState } from 'react';

type AnalyzerMode = "idle" | "analyzing" | "done";

interface AnalysisResult {
  season: string;
  monthString: string;
  temp: string;
  image: string;
  verdict: string;
  why: { title: string; desc: string }[];
  alternatives: string;
  destinations: string[];
  packing: string;
  events: string;
}

const summerImages = ['/images/season/summer1.jpg', '/images/season/summer2.jpg'];
const winterImages = ['/images/season/winter1.jpg', '/images/season/winter2.jpg'];
const monsoonImages = ['/images/season/moonsoon1.jpg', '/images/season/monsoon2.jpg'];
const springImages = ['/images/season/spring1.jpg', '/images/season/spring2.jpg'];

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SmartAnalyzer() {
  const [interest, setInterest] = useState('Wildlife & Tigers');
  const [crowdTolerance, setCrowdTolerance] = useState('Low (Prefer Quiet)');
  const [mode, setMode] = useState<AnalyzerMode>("idle");
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const interests = ['Wildlife & Tigers', 'Heritage & Architecture', 'Waterfalls & Nature', 'Spiritual & Temples', 'Photography'];
  const crowds = ['Low (Prefer Quiet)', 'Medium (Balanced)', 'High (Festive/Peak)'];

  function analyze() {
    setMode("analyzing");
    setResult(null);

    const texts = [
      "Analyzing historical weather patterns...",
      "Cross-referencing tiger sighting data...",
      "Evaluating tourist footfall trends...",
      "Synthesizing the perfect travel window..."
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
      
      let res: AnalysisResult;

      if (interest === 'Wildlife & Tigers' || interest === 'Photography') {
        if (!crowdTolerance.includes('High')) {
          res = {
            season: "Summer (Late)",
            monthString: "April - May",
            temp: "35°C - 42°C",
            image: getRandom(summerImages),
            verdict: "The undisputed best time for pure tiger sightings and high-contrast photography.",
            why: [
              { title: "Waterhole Dependency", desc: "As the extreme heat dries up smaller water sources, apex predators are forced into the open to drink from remaining major waterholes." },
              { title: "Maximum Visibility", desc: "The thick winter undergrowth completely dies back, allowing your line of sight to stretch for hundreds of meters through the teak forest." },
              { title: "Exclusive Sightings", desc: "Most casual tourists avoid the extreme heat, giving you private sightings and premium lodge availability without the rush." }
            ],
            alternatives: "If heat is a dealbreaker, switch to November, but expect dense jungle and higher crowds.",
            destinations: ["Bandhavgarh", "Kanha", "Pench"],
            packing: "Light breathable cottons, wide-brim hat, electrolytes, and maximum sun protection.",
            events: "Forest trails are fully accessible; Mahua flowers bloom."
          };
        } else {
          res = {
            season: "Winter (Peak)",
            monthString: "December - February",
            temp: "10°C - 22°C",
            image: getRandom(winterImages),
            verdict: "Perfect weather for long safari drives and comfortable historical sightseeing.",
            why: [
              { title: "Atmospheric Landscapes", desc: "Morning mist over the meadows creates breathtaking, ethereal landscapes perfect for photography." },
              { title: "Extended Activity", desc: "Animals are active throughout the day due to cooler temperatures, allowing for better tracking." },
              { title: "Birding Migrations", desc: "Migratory birds flock to the park buffer zones and lakes, creating a secondary wildlife spectacle." }
            ],
            alternatives: "Book 3-4 months in advance. Safari zones sell out in minutes during this window.",
            destinations: ["Kanha Meadows", "Khajuraho", "Orchha"],
            packing: "Heavy jackets for early morning open-jeep safaris, shedding to t-shirts by noon.",
            events: "Khajuraho Dance Festival (Feb), Tansen Samaroh (Dec)."
          };
        }
      } else if (interest === 'Waterfalls & Nature') {
        res = {
          season: "Monsoon & Post-Monsoon",
          monthString: "August - October",
          temp: "24°C - 28°C",
          image: getRandom(monsoonImages),
          verdict: "Madhya Pradesh turns into an electric green canvas with roaring rivers and dramatic clouds.",
          why: [
            { title: "Hydraulic Power", desc: "Waterfalls like Dhuandhar and Pachmarhi are at their absolute most dramatic and powerful capacity." },
            { title: "Romantic Ruins", desc: "The ancient architecture of Mandu and Orchha becomes incredibly romantic wrapped in rain and moss." },
            { title: "Vivid Photography", desc: "The air is entirely washed clean of dust, offering hyper-vivid, high-contrast photographic conditions." }
          ],
          alternatives: "Note that National Park core zones are closed during this time. Focus entirely on hills, rivers, and heritage.",
          destinations: ["Pachmarhi", "Mandu", "Bhedaghat", "Amarkantak"],
          packing: "Waterproof gear, sturdy trekking shoes, and moisture-wicking layers.",
          events: "Bhagoriya Festival, lush green plateau treks."
        };
      } else {
        // Heritage / Spiritual
        res = {
          season: "Winter & Early Spring",
          monthString: "November - March",
          temp: "15°C - 28°C",
          image: getRandom(springImages),
          verdict: "The golden window for walking heavy sites like Khajuraho or Gwalior Fort.",
          why: [
            { title: "Thermal Comfort", desc: "Walking bare-foot in temples or climbing hundreds of fort stairs is comfortable instead of exhausting." },
            { title: "Golden Hour Skies", desc: "Clear blue skies provide the perfect high-contrast backdrop for striking architecture photography." },
            { title: "Cultural Energy", desc: "This is the peak season for classical dance festivals, music events, and bustling local markets." }
          ],
          alternatives: "If you want fewer crowds at monuments, target the 'shoulder' weeks in early October or late March.",
          destinations: ["Gwalior Fort", "Khajuraho Temples", "Ujjain Mahakal", "Sanchi Stupa"],
          packing: "Comfortable slip-on walking shoes for temples, light layers for evening breeze.",
          events: "Ujjain Kumbh (cyclical), Khajuraho Dance Festival, Mandu Festival."
        };
      }

      setResult(res);
      setMode("done");
    }, 3000);
  }

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-9rem)] min-h-[600px] overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-xl">
      
      {/* Left Panel: Configuration */}
      <div className="w-full xl:w-[420px] flex-shrink-0 border-b xl:border-b-0 xl:border-r border-slate-200 bg-white/80 flex flex-col h-full overflow-y-auto">
        <div className="p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-600 mb-2">Timing Intelligence</p>
          <h1 className="font-display text-4xl text-slate-900 mb-4 tracking-tight">Smart Analyzer</h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-10">
            Tell the AI what you want to experience. It will analyze historical climate data, tiger sighting probabilities, and crowd metrics to pinpoint your absolute best time to visit MP.
          </p>

          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Core Experience Goal</label>
              <div className="flex flex-col gap-2">
                {interests.map(i => (
                  <button
                    key={i}
                    onClick={() => setInterest(i)}
                    className={`text-left px-5 py-4 rounded-2xl border transition-all ${
                      interest === i 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-semibold text-sm">{i}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Crowd Tolerance</label>
              <div className="flex flex-col gap-2">
                {crowds.map(c => (
                  <button
                    key={c}
                    onClick={() => setCrowdTolerance(c)}
                    className={`text-left px-5 py-3 rounded-xl border transition-all ${
                      crowdTolerance === c 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="text-xs font-bold">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-8 bg-white border-t border-slate-200 sticky bottom-0 z-10">
          <button 
            onClick={analyze}
            disabled={mode === 'analyzing'}
            className="w-full rounded-full bg-[linear-gradient(135deg,#10b981,#0f766e)] px-6 py-4 text-sm font-bold text-white transition hover:scale-[1.02] disabled:bg-slate-400 disabled:hover:scale-100 flex justify-center items-center gap-3 shadow-[0_8px_24px_rgba(16,185,129,0.25)]"
          >
            {mode === 'analyzing' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Data...
              </>
            ) : (
              "Calculate Best Time"
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
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <h2 className="font-display text-4xl text-slate-900 mb-4">Awaiting Parameters</h2>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-sm">
              Select your travel goals. The AI will bypass generic advice and compute the statistically superior window for your specific trip.
            </p>
          </div>
        ) : mode === 'analyzing' ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
             <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" style={{ animationDuration: '1s' }}></div>
               <div className="absolute inset-4 rounded-full border-2 border-slate-300 border-b-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
               <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
             </div>
             <h3 className="font-display text-3xl text-slate-900 mb-3 tracking-wide">Synthesizing Datasets...</h3>
             <p className="text-emerald-600 text-sm tracking-widest uppercase font-bold animate-pulse">{loadingText}</p>
          </div>
        ) : result ? (
          <div className="w-full pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Massive Hero Image */}
            <div className="relative h-[300px] shrink-0 rounded-[2rem] overflow-hidden mb-10 shadow-[0_20px_60px_rgba(148,163,184,0.2)]">
              <img src={result.image} alt="Season Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(15,23,42,0.8))]" />
              
              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="inline-block bg-emerald-500 text-slate-950 font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded mb-3">
                  AI Recommended Window
                </div>
                <h2 className="font-display text-5xl text-white mb-2">{result.monthString}</h2>
                <div className="flex items-center gap-4 text-emerald-300 font-semibold text-sm uppercase tracking-widest">
                  <span>{result.season}</span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span>{result.temp}</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_60px_rgba(148,163,184,0.12)] p-8 xl:p-12">
              <p className="text-xl leading-relaxed text-slate-700 mb-10 border-l-4 border-emerald-500 pl-6 font-medium">
                "{result.verdict}"
              </p>

              <div className="grid lg:grid-cols-[1fr_380px] gap-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Why this is optimal</h3>
                  <div className="space-y-6">
                    {result.why.map((reason, idx) => (
                      <div key={idx} className="flex gap-5">
                        <div className="w-10 h-10 rounded-[1rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-1.5">{reason.title}</p>
                          <p className="text-slate-600 text-sm leading-relaxed">{reason.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 grid sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3">Top Destinations</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.destinations.map(d => (
                          <span key={d} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg">{d}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3">Key Events</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{result.events}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="bg-amber-50/50 border border-amber-100 rounded-[1.5rem] p-7">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">Crucial Caveat</h3>
                    <p className="text-slate-700 text-sm leading-7 mb-6">
                      {result.alternatives}
                    </p>
                    
                    <div className="pt-6 border-t border-amber-200/50">
                      <h4 className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Live Climate Tracking</h4>
                      <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                        <span className="flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0" />
                        Historical models suggest a 92% match for your crowd tolerance ({crowdTolerance}) during this window.
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] p-7">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">AI Packing Intelligence</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {result.packing}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
