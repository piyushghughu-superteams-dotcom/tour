import { useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const DIRECTION_DATA = [
  {
    name: "North",
    range: [315, 45], // degrees
    destinations: ["Gwalior Fort", "Orchha", "Khajuraho"],
    theme: "Heritage & Architecture",
    desc: "Pointing North takes you through the royal corridors of Madhya Pradesh. You'll find imposing fortresses like Gwalior, the riverside cenotaphs of Orchha, and the legendary carved temples of Khajuraho.",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    bgAccent: "bg-amber-500"
  },
  {
    name: "East",
    range: [45, 135],
    destinations: ["Bandhavgarh", "Kanha National Park", "Bhedaghat"],
    theme: "Wildlife & Wilderness",
    desc: "To the East lies the wild heart of India. Dense sal forests host the highest density of Bengal tigers, while the Narmada river carves through stunning marble gorges at Bhedaghat.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    bgAccent: "bg-emerald-500"
  },
  {
    name: "South",
    range: [135, 225],
    destinations: ["Pachmarhi", "Pench National Park"],
    theme: "Highlands & Jungles",
    desc: "Looking South reveals the elevated beauty of the Satpura ranges. Explore the serene 'Queen of Satpura' hill station at Pachmarhi and the thick jungles of Pench, the inspiration for the Jungle Book.",
    color: "text-sky-600 bg-sky-50 border-sky-200",
    bgAccent: "bg-sky-500"
  },
  {
    name: "West",
    range: [225, 315],
    destinations: ["Ujjain", "Mandu", "Omkareshwar", "Indore"],
    theme: "Spirituality & Culture",
    desc: "The West is steeped in intense spirituality and romance. From the sacred Jyotirlingas of Ujjain and Omkareshwar to the poetic, monsoon-washed ruins of Mandu.",
    color: "text-purple-600 bg-purple-50 border-purple-200",
    bgAccent: "bg-purple-500"
  }
];

function getDirectionData(angle: number) {
  const normalized = (angle % 360 + 360) % 360;
  if (normalized >= 315 || normalized < 45) return DIRECTION_DATA[0]; // North
  if (normalized >= 45 && normalized < 135) return DIRECTION_DATA[1]; // East
  if (normalized >= 135 && normalized < 225) return DIRECTION_DATA[2]; // South
  return DIRECTION_DATA[3]; // West
}

export default function SmartCompass() {
  const navigate = useNavigate();
  const compassRef = useRef<HTMLDivElement>(null);
  
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const currentDirection = getDirectionData(rotation);

  const calculateAngle = (clientX: number, clientY: number) => {
    if (!compassRef.current) return 0;
    const rect = compassRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle in radians
    const rad = Math.atan2(clientY - centerY, clientX - centerX);
    
    // Convert to degrees and shift so 0 degrees is North (top)
    let deg = (rad * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    
    return deg;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const newAngle = calculateAngle(e.clientX, e.clientY);
    setRotation(newAngle);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newAngle = calculateAngle(e.clientX, e.clientY);
    setRotation(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-9rem)] space-y-6 select-none">
      <section className="flex-1 flex flex-col rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl relative overflow-y-auto">
        
        {/* Background ambient gradient tied to direction */}
        <div className={`absolute inset-0 transition-colors duration-1000 opacity-10 pointer-events-none ${currentDirection.bgAccent}`} />

        <div className="relative z-10 flex flex-col h-full">
          <div className="text-center max-w-2xl mx-auto mb-10 shrink-0">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Geographic AI Explorer</p>
            <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">Smart Compass</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Drag the compass needle to explore the geography of Madhya Pradesh. The AI will instantly reveal the historical and cultural significance lying in that true direction.
            </p>
          </div>

          <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Compass Side */}
            <div className="flex flex-col items-center justify-center relative py-4">
              
              <div 
                ref={compassRef}
                className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center shrink-0 cursor-pointer touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-[12px] border-slate-50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] shadow-lg" />
                
                {/* Tick Marks (Subtle) */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-3 bg-slate-200 rounded-full" 
                    style={{ transform: `rotate(${i * 30}deg) translateY(-140px)` }} 
                  />
                ))}

                {/* Cardinal Points */}
                <div className={`absolute -top-8 font-bold tracking-widest transition-colors ${rotation >= 315 || rotation < 45 ? 'text-rose-500 text-lg' : 'text-slate-300'}`}>N</div>
                <div className={`absolute -bottom-8 font-bold tracking-widest transition-colors ${rotation >= 135 && rotation < 225 ? 'text-slate-800 text-lg' : 'text-slate-300'}`}>S</div>
                <div className={`absolute -right-8 font-bold tracking-widest transition-colors ${rotation >= 45 && rotation < 135 ? 'text-emerald-500 text-lg' : 'text-slate-300'}`}>E</div>
                <div className={`absolute -left-8 font-bold tracking-widest transition-colors ${rotation >= 225 && rotation < 315 ? 'text-purple-500 text-lg' : 'text-slate-300'}`}>W</div>

                {/* Active Angle Display */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 z-40 pointer-events-none">
                  {Math.round(rotation)}°
                </div>

                {/* Spinning Needle Mechanism */}
                <div 
                  className={`absolute w-full h-full rounded-full flex items-center justify-center shadow-2xl bg-white/20 border border-slate-100/50 backdrop-blur-[2px] ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className="absolute inset-8 rounded-full border-2 border-slate-300/30 border-dashed" />
                  
                  {/* The actual Needle */}
                  <div className="relative w-4 h-48 md:h-60 flex flex-col items-center z-20">
                    {/* North Point (Red) */}
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[100px] md:border-b-[120px] border-b-rose-500 drop-shadow-md" />
                    {/* Center Pin */}
                    <div className="w-5 h-5 rounded-full bg-slate-800 shadow-xl z-30 absolute top-1/2 -mt-2.5 border-2 border-white" />
                    {/* South Point (Slate) */}
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[100px] md:border-t-[120px] border-t-slate-300 drop-shadow-md" />
                  </div>
                </div>

              </div>

              <div className="mt-14 text-center">
                <p className="text-slate-400 text-sm font-medium">Click and drag the compass needle</p>
              </div>
            </div>

            {/* Results Side */}
            <div className="flex flex-col justify-center min-h-[300px]">
              <div 
                key={currentDirection.name} // Force re-render animation on direction change
                className="animate-in fade-in slide-in-from-right-8 duration-500 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] relative overflow-hidden"
              >
                
                {/* Result Accent Background */}
                <div className={`absolute -top-10 -right-10 w-48 h-48 blur-3xl opacity-10 rounded-full ${currentDirection.bgAccent}`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">True {currentDirection.name}</p>
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${currentDirection.color}`}>
                      {currentDirection.theme}
                    </span>
                  </div>
                  
                  <h2 className="font-display text-4xl text-slate-900 mb-6 tracking-tight">
                    Exploring the {currentDirection.name}
                  </h2>
                  
                  <p className="text-slate-600 leading-relaxed mb-8 text-base">
                    {currentDirection.desc}
                  </p>

                  <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Geographic Anchors</p>
                    <div className="flex flex-wrap gap-2">
                      {currentDirection.destinations.map(dest => (
                        <span key={dest} className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                          {dest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => navigate('/dashboard/map')}
                      className="py-3.5 px-4 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                    >
                      Open in Atlas
                    </button>
                    <button 
                      onClick={() => navigate('/dashboard/planner')}
                      className="py-3.5 px-4 bg-white text-slate-700 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
                    >
                      AI Trip Planner
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
