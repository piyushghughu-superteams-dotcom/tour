import { useEffect, useRef, useState } from "react";

const cardStyle = {
  background: "linear-gradient(145deg, #faf9f7 0%, #f5f3ef 100%)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 2px 16px rgba(15,23,42,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
};

// ── Card 1: AI Chat — full real chat UI ───────────────────────────────────
const conversation = [
  { role: "user", text: "Plan me 5 days in MP — wildlife + heritage" },
  { role: "ai",   text: "Sure! Here's your 5-day MP itinerary:" },
  { role: "ai",   text: "🐯 Day 1–2: Kanha tiger reserve — dawn & dusk safaris" },
  { role: "ai",   text: "🏰 Day 3: Orchha — cenotaphs, fort, and river ghats" },
  { role: "ai",   text: "🛕 Day 4–5: Khajuraho temples at sunrise + local markets" },
  { role: "user", text: "Can you add a budget stay at each stop?" },
  { role: "ai",   text: "Adding stays now — Kanha: ₹3,800 · Orchha: ₹2,400 · Khajuraho: ₹2,900 ✓" },
];

function ChatCard() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typedLast, setTypedLast] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount >= conversation.length) {
      // restart after pause
      const t = setTimeout(() => { setVisibleCount(0); setTypedLast(""); }, 2500);
      return () => clearTimeout(t);
    }

    const next = conversation[visibleCount];
    if (next.role === "user") {
      const t = setTimeout(() => {
        setVisibleCount(p => p + 1);
        setTypedLast("");
      }, 900);
      return () => clearTimeout(t);
    }

    // AI message — typewriter
    setIsTyping(true);
    setTypedLast("");
    let i = 0;
    const speed = 18;
    const interval = setInterval(() => {
      i++;
      setTypedLast(next.text.slice(0, i));
      if (i >= next.text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => setVisibleCount(p => p + 1), 500);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [visibleCount]);

  useEffect(() => {
    const el = bottomRef.current;
    if (el) el.parentElement?.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  }, [visibleCount, typedLast]);

  const displayed = conversation.slice(0, visibleCount);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg h-full" style={cardStyle}>
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: "linear-gradient(90deg,#059669,#10b981)", borderRadius: "1rem 1rem 0 0" }}>
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" fillOpacity=".3"/>
            <path d="M7 9a1 1 0 100 2h6a1 1 0 100-2H7z" fill="white"/>
          </svg>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-emerald-600 bg-emerald-300 animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-bold text-white leading-none">MP AI Planner</p>
          <p className="text-[9px] text-emerald-100 mt-0.5">Online · Replies instantly</p>
        </div>
        <div className="ml-auto flex gap-1">
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: "none", maxHeight: 160 }}>
        {displayed.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-1.5`}>
            {msg.role === "ai" && (
              <div className="h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold text-white mb-0.5"
                style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>AI</div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[10px] leading-[1.55]`}
              style={msg.role === "user"
                ? { background: "#1e293b", color: "white", borderRadius: "1rem 1rem 0.2rem 1rem" }
                : { background: "white", color: "#1e293b", border: "1px solid rgba(15,23,42,0.08)", borderRadius: "1rem 1rem 1rem 0.2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }
              }>
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="h-5 w-5 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600 mb-0.5">U</div>
            )}
          </div>
        ))}

        {/* Current AI typing */}
        {visibleCount < conversation.length && conversation[visibleCount].role === "ai" && typedLast && (
          <div className="flex justify-start items-end gap-1.5">
            <div className="h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold text-white mb-0.5"
              style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>AI</div>
            <div className="max-w-[80%] rounded-2xl px-3 py-2 text-[10px] leading-[1.55]"
              style={{ background: "white", color: "#1e293b", border: "1px solid rgba(15,23,42,0.08)", borderRadius: "1rem 1rem 1rem 0.2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {typedLast}
              {isTyping && <span className="inline-block w-[1.5px] h-[9px] bg-emerald-500 ml-0.5 align-middle animate-pulse" />}
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {visibleCount < conversation.length && conversation[visibleCount].role === "ai" && !typedLast && (
          <div className="flex justify-start items-end gap-1.5">
            <div className="h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold text-white mb-0.5"
              style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>AI</div>
            <div className="flex items-center gap-1 rounded-2xl px-3 py-2.5"
              style={{ background: "white", border: "1px solid rgba(15,23,42,0.08)", borderRadius: "1rem 1rem 1rem 0.2rem" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-3 pb-3 shrink-0">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "white", border: "1px solid rgba(15,23,42,0.1)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <span className="flex-1 text-[10px] text-slate-300 italic">Ask about your trip…</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}>
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
              <path d="M2 10h16M12 4l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card 2: Map ────────────────────────────────────────────────────────────
function MapCard() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT(p => (p + 1) % 320), 18);
    return () => clearInterval(id);
  }, []);

  const pathLen = 220;
  const dash = (t / 320) * pathLen;

  return (
    <div className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:shadow-lg h-full" style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z" stroke="#7c3aed" strokeWidth="1.6"/>
              <circle cx="10" cy="7" r="1.8" fill="#7c3aed"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-none">Interactive Map</p>
            <p className="text-[9px] text-slate-400 mt-0.5 leading-none">Route drawn between all stops</p>
          </div>
        </div>
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full text-violet-700"
          style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.18)" }}>3 stops</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "#ede9f8", border: "1px solid rgba(139,92,246,0.12)" }}>
        <svg viewBox="0 0 220 130" className="w-full" fill="none">
          {[26,52,78,104].map(y => <line key={y} x1="0" y1={y} x2="220" y2={y} stroke="rgba(139,92,246,0.07)" strokeWidth="1"/>)}
          {[55,110,165].map(x => <line key={x} x1={x} y1="0" x2={x} y2="130" stroke="rgba(139,92,246,0.07)" strokeWidth="1"/>)}
          <path d="M22 100 Q70 32 118 68 Q158 95 196 28" stroke="rgba(139,92,246,0.18)" strokeWidth="7" strokeLinecap="round"/>
          <path d="M22 100 Q70 32 118 68 Q158 95 196 28" stroke="rgba(139,92,246,0.22)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3"/>
          <path d="M22 100 Q70 32 118 68 Q158 95 196 28"
            stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={`${pathLen} ${pathLen}`}
            strokeDashoffset={pathLen - dash}/>
          <circle cx="22" cy="100" r="6" fill="#10b981"/>
          <circle cx="22" cy="100" r="11" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.3"/>
          <circle cx="118" cy="68" r="6" fill="#f59e0b"/>
          <circle cx="118" cy="68" r="11" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.3"/>
          <circle cx="196" cy="28" r="6" fill="#ef4444"/>
          <circle cx="196" cy="28" r="11" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.3"/>
          <circle r="4" fill="#7c3aed">
            <animateMotion dur="4s" repeatCount="indefinite" path="M22 100 Q70 32 118 68 Q158 95 196 28"/>
          </circle>
          <text x="30" y="118" fontSize="8" fill="#6d28d9" fontFamily="sans-serif" fontWeight="700">Kanha</text>
          <text x="100" y="86" fontSize="8" fill="#6d28d9" fontFamily="sans-serif" fontWeight="700">Orchha</text>
          <text x="172" y="22" fontSize="8" fill="#6d28d9" fontFamily="sans-serif" fontWeight="700">Khajuraho</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between px-1">
        {[{ c: "#10b981", l: "Kanha" }, { c: "#f59e0b", l: "Orchha" }, { c: "#ef4444", l: "Khajuraho" }].map(s => (
          <div key={s.l} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: s.c }} />
            <span className="text-[9px] font-medium text-slate-500">{s.l}</span>
          </div>
        ))}
        <span className="text-[9px] text-violet-600 font-semibold">737 km total</span>
      </div>
    </div>
  );
}

// ── Card 3: Hotels ─────────────────────────────────────────────────────────
const hotels = [
  { name: "Kanha Jungle Lodge", type: "Wildlife", price: "₹4,200", rating: "4.8", dot: "#10b981", tag: "Forest View" },
  { name: "Raj Mahal Palace", type: "Heritage", price: "₹6,800", rating: "4.9", dot: "#8b5cf6", tag: "Heritage Stay" },
  { name: "Pachmarhi Retreat", type: "Hills", price: "₹3,100", rating: "4.7", dot: "#3b82f6", tag: "Hill View" },
  { name: "Bhedaghat River Inn", type: "Water", price: "₹2,800", rating: "4.6", dot: "#f59e0b", tag: "Riverfront" },
];

function HotelsCard() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(p => (p + 1) % hotels.length); setVisible(true); }, 300);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const h = hotels[idx];

  return (
    <div className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:shadow-lg h-full" style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="8" width="16" height="10" rx="1.5" stroke="#d97706" strokeWidth="1.6"/>
              <path d="M5 8V6a5 5 0 0110 0v2" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-none">Hotels & Stays</p>
            <p className="text-[9px] text-slate-400 mt-0.5 leading-none">Matched to your route & budget</p>
          </div>
        </div>
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full text-amber-700"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.18)" }}>AI Curated</span>
      </div>

      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}>
        {/* Hotel card */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(15,23,42,0.08)", background: "white" }}>
          {/* Color band */}
          <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${h.dot}, ${h.dot}88)` }} />
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold text-slate-800 leading-snug">{h.name}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: h.dot }} />
                  <span className="text-[9px] text-slate-500 font-medium">{h.type}</span>
                  <span className="text-[9px] text-slate-300">·</span>
                  <span className="text-[9px]" style={{ color: h.dot }}>{h.tag}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-bold text-slate-900 leading-none">{h.price}</p>
                <p className="text-[8px] text-slate-400 mt-0.5">/night</p>
              </div>
            </div>
            {/* Rating bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="9" height="9" viewBox="0 0 10 10" fill={parseFloat(h.rating) >= s ? "#f59e0b" : "#e2e8f0"}>
                    <path d="M5 1l1.12 2.26L9 3.64l-2 1.95.47 2.75L5 7.07 2.53 8.34 3 5.59 1 3.64l2.88-.38L5 1z"/>
                  </svg>
                ))}
              </div>
              <span className="text-[9px] font-bold text-slate-700">{h.rating}</span>
              <span className="text-[9px] text-slate-400">/ 5.0</span>
            </div>
            {/* Amenities */}
            <div className="mt-2.5 flex gap-1.5">
              {["WiFi", "Breakfast", "AC"].map(a => (
                <span key={a} className="rounded-full px-2 py-0.5 text-[8px] font-medium text-slate-500"
                  style={{ background: "rgba(15,23,42,0.05)", border: "1px solid rgba(15,23,42,0.07)" }}>{a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* All hotels mini-list */}
        <div className="mt-3 space-y-1.5">
          {hotels.map((hotel, i) => (
            <div key={hotel.name} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all duration-200"
              style={{ background: i === idx ? "rgba(15,23,42,0.05)" : "transparent", border: i === idx ? "1px solid rgba(15,23,42,0.07)" : "1px solid transparent" }}>
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: hotel.dot }} />
              <p className="text-[9px] font-medium text-slate-600 flex-1">{hotel.name}</p>
              <p className="text-[9px] font-bold text-slate-800">{hotel.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Card 4: Road Guide — highway visual ────────────────────────────────────
const stops = ["Bhopal", "Kanha", "Orchha", "Khajuraho"];
const distances = ["265 km", "320 km", "152 km"];

function RoadCard() {
  const [carPos, setCarPos] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCarPos(p => (p >= 100 ? 0 : p + 0.35)), 20);
    return () => clearInterval(id);
  }, []);

  const activeSegment = Math.min(Math.floor((carPos / 100) * 3), 2);
  const segFill = ((carPos / 100) * 3 - activeSegment) * 100;

  return (
    <div className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:shadow-lg h-full" style={cardStyle}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="17" r="3" stroke="#dc2626" strokeWidth="1.8"/>
              <circle cx="7" cy="17" r="3" stroke="#dc2626" strokeWidth="1.8"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-none">Road Guide</p>
            <p className="text-[9px] text-slate-400 mt-0.5 leading-none">Live route · fuel stops · detours</p>
          </div>
        </div>
        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full text-rose-700"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.18)" }}>En Route</span>
      </div>

      {/* Highway scene */}
      <div className="rounded-xl overflow-hidden mb-4" style={{ background: "#0f172a", border: "1px solid rgba(15,23,42,0.15)" }}>
        <svg viewBox="0 0 240 100" className="w-full" fill="none">
          {/* Sky gradient */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a"/>
              <stop offset="100%" stopColor="#1e3a5f"/>
            </linearGradient>
            <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#374151"/>
              <stop offset="100%" stopColor="#1f2937"/>
            </linearGradient>
          </defs>
          <rect width="240" height="100" fill="url(#sky)"/>
          {/* Moon */}
          <circle cx="200" cy="18" r="8" fill="#fef9c3" opacity="0.9"/>
          <circle cx="204" cy="15" r="6" fill="#1e3a5f"/>
          {/* Stars */}
          {[[30,10],[60,18],[100,8],[140,20],[20,25],[170,12],[210,30]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="0.9" fill="white" opacity={0.4 + (i%3)*0.2}/>
          ))}
          {/* Distant mountains */}
          <path d="M0 58 L30 40 L55 55 L80 35 L110 52 L135 38 L165 55 L190 42 L220 56 L240 44 L240 60 L0 60Z" fill="#1e3a5f" opacity="0.8"/>
          {/* Road surface */}
          <rect x="0" y="60" width="240" height="40" fill="url(#road)"/>
          {/* Road edge lines */}
          <line x1="0" y1="62" x2="240" y2="62" stroke="#4b5563" strokeWidth="1.5"/>
          <line x1="0" y1="98" x2="240" y2="98" stroke="#374151" strokeWidth="1"/>
          {/* Center dashes */}
          {[0,1,2,3,4,5,6,7,8].map(i => {
            const x = (i * 32 - (carPos * 0.9 % 32));
            return <rect key={i} x={x} y="79" width="20" height="2.5" rx="1.2" fill="#fbbf24" opacity="0.55"/>;
          })}
          {/* Side lines */}
          <line x1="0" y1="68" x2="240" y2="68" stroke="#374151" strokeWidth="0.8" strokeDasharray="8 4"/>
          <line x1="0" y1="90" x2="240" y2="90" stroke="#374151" strokeWidth="0.8" strokeDasharray="8 4"/>
          {/* Trees left */}
          {[0,50,100,160,210].map((x,i) => (
            <g key={i} transform={`translate(${x + (i%2)*6}, 38)`}>
              <rect x="-2" y="12" width="4" height="12" fill="#92400e"/>
              <ellipse cx="0" cy="9" rx="9" ry="13" fill="#14532d"/>
              <ellipse cx="0" cy="4" rx="6" ry="8" fill="#166534"/>
            </g>
          ))}
          {/* Trees right */}
          {[25,75,130,180,230].map((x,i) => (
            <g key={i} transform={`translate(${x}, 40)`}>
              <rect x="-1.5" y="10" width="3" height="10" fill="#92400e"/>
              <ellipse cx="0" cy="7" rx="7" ry="11" fill="#14532d"/>
              <ellipse cx="0" cy="3" rx="5" ry="7" fill="#166534"/>
            </g>
          ))}
          {/* Car */}
          <g transform={`translate(${22 + carPos * 1.96}, 58)`}>
            {/* Car shadow */}
            <ellipse cx="0" cy="18" rx="16" ry="3" fill="black" opacity="0.3"/>
            {/* Body */}
            <rect x="-15" y="2" width="30" height="13" rx="3" fill="#dc2626"/>
            {/* Roof */}
            <path d="M-10 2 L-8 -7 L8 -7 L10 2 Z" fill="#b91c1c"/>
            {/* Windows */}
            <rect x="-8" y="-6" width="7" height="7" rx="1.5" fill="#93c5fd" opacity="0.85"/>
            <rect x="1" y="-6" width="7" height="7" rx="1.5" fill="#93c5fd" opacity="0.85"/>
            {/* Wheels */}
            <circle cx="-9" cy="15" r="4" fill="#111827"/>
            <circle cx="-9" cy="15" r="2" fill="#374151"/>
            <circle cx="9" cy="15" r="4" fill="#111827"/>
            <circle cx="9" cy="15" r="2" fill="#374151"/>
            {/* Headlights */}
            <rect x="13" y="3" width="3" height="5" rx="1" fill="#fef08a"/>
            <rect x="13" y="8" width="3" height="4" rx="1" fill="#fca5a5" opacity="0.7"/>
            {/* Headlight beam */}
            <path d="M16 5.5 L38 2 L38 10 L16 8Z" fill="rgba(254,240,138,0.1)"/>
          </g>
        </svg>
      </div>

      {/* Stop-by-stop progress */}
      <div className="flex items-start gap-0">
        {stops.map((stop, i) => {
          const isDone = i < activeSegment;
          const isActive = i === activeSegment;
          return (
            <div key={stop} className="flex items-center flex-1">
              <div className="flex flex-col items-center shrink-0">
                <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                  style={{
                    borderColor: isDone ? "#10b981" : isActive ? "#ef4444" : "rgba(15,23,42,0.15)",
                    background: isDone ? "#10b981" : isActive ? "#fef2f2" : "white",
                  }}>
                  {isDone && <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />}
                </div>
                <p className="text-[8px] font-semibold mt-1 text-center"
                  style={{ color: isDone ? "#059669" : isActive ? "#dc2626" : "#94a3b8" }}>{stop}</p>
              </div>
              {i < stops.length - 1 && (
                <div className="flex-1 flex flex-col items-center gap-0.5 pb-4 mx-1">
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(15,23,42,0.08)" }}>
                    <div className="h-full rounded-full transition-none"
                      style={{
                        width: isDone ? "100%" : isActive ? `${segFill}%` : "0%",
                        background: isDone ? "#10b981" : "linear-gradient(90deg,#ef4444,#f87171)",
                      }} />
                  </div>
                  <p className="text-[7px] text-slate-400 font-medium">{distances[i]}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AIFeatureCards() {
  return (
    <div className="mt-7 grid grid-cols-2 gap-3" style={{ gridAutoRows: "320px" }}>
      <div className="overflow-hidden" style={{ height: 320 }}><ChatCard /></div>
      <div className="overflow-hidden" style={{ height: 320 }}><MapCard /></div>
      <div className="overflow-hidden" style={{ height: 320 }}><HotelsCard /></div>
      <div className="overflow-hidden" style={{ height: 320 }}><RoadCard /></div>
    </div>
  );
}
