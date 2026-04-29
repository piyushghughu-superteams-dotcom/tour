import { useState, useEffect } from "react";

const steps = [
  {
    id: "name",
    question: "What should we call you?",
    sub: "We'll personalise your dashboard around you.",
    type: "text",
    placeholder: "Your name…",
    field: "name",
  },
  {
    id: "style",
    question: "What kind of traveler are you?",
    sub: "Pick the one that fits you best.",
    type: "choice",
    field: "style",
    options: [
      { label: "Adventure Seeker", icon: "🏕️", desc: "Safaris, treks, offbeat trails" },
      { label: "Culture Explorer", icon: "🏛️", desc: "Temples, forts, local history" },
      { label: "Nature Lover", icon: "🌿", desc: "Rivers, hills, quiet escapes" },
      { label: "Luxury Traveler", icon: "✨", desc: "Premium stays, curated routes" },
    ],
  },
  {
    id: "duration",
    question: "How long do you usually travel?",
    sub: "This helps AI build the right length itinerary.",
    type: "choice",
    field: "duration",
    options: [
      { label: "Weekend", icon: "⚡", desc: "2–3 days" },
      { label: "Short Trip", icon: "📅", desc: "4–6 days" },
      { label: "Week+", icon: "🗓️", desc: "7–10 days" },
      { label: "Long Journey", icon: "🌍", desc: "10+ days" },
    ],
  },
  {
    id: "budget",
    question: "What's your daily budget range?",
    sub: "AI will filter hotels and activities accordingly.",
    type: "choice",
    field: "budget",
    options: [
      { label: "Budget", icon: "💰", desc: "Under ₹2,000/day" },
      { label: "Mid Range", icon: "💳", desc: "₹2,000–₹5,000/day" },
      { label: "Premium", icon: "🏆", desc: "₹5,000–₹12,000/day" },
      { label: "Luxury", icon: "👑", desc: "₹12,000+/day" },
    ],
  },
  {
    id: "groupSize",
    question: "How many people are travelling?",
    sub: "This helps us suggest the right routes, stays, and trip pacing.",
    type: "choice",
    field: "groupSize",
    options: [
      { label: "Solo", icon: "🧍", desc: "Just me" },
      { label: "2 People", icon: "🧑‍🤝‍🧑", desc: "Couple or duo" },
      { label: "3 to 5", icon: "👨‍👩‍👧", desc: "Small group" },
      { label: "6 to 10", icon: "🚌", desc: "Family or group trip" },
      { label: "10+", icon: "🌍", desc: "Large group or event" },
    ],
  },
  {
    id: "interests",
    question: "What excites you most?",
    sub: "Pick as many as you like.",
    type: "multi",
    field: "interests",
    options: [
      { label: "Wildlife Safaris", icon: "🐯" },
      { label: "Heritage Temples", icon: "🛕" },
      { label: "River & Waterfalls", icon: "🌊" },
      { label: "Hill Stations", icon: "⛰️" },
      { label: "Local Cuisine", icon: "🍛" },
      { label: "Photography", icon: "📸" },
      { label: "Camping", icon: "🏕️" },
      { label: "Boat Rides", icon: "⛵" },
    ],
  },
];

interface Profile {
  name: string;
  style: string;
  duration: string;
  budget: string;
  groupSize: string;
  interests: string[];
}

interface Props {
  onComplete: (profile: Profile) => void;
  onSkip?: () => void;
}

export type { Profile };

export default function ProfileSetupModal({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: "", style: "", duration: "", budget: "", groupSize: "", interests: [],
  });
  const [textVal, setTextVal] = useState("");
  const [aiLine, setAiLine] = useState("");
  const [showDone, setShowDone] = useState(false);

  const aiLines: Record<string, string> = {
    name: `Great to meet you, ${profile.name || "friend"}! Let's build your travel profile.`,
    style: "Perfect. Your travel style will shape every recommendation.",
    duration: "Got it — we'll keep itineraries tight and well-paced.",
    budget: "Noted. AI will only surface stays and activities within your range.",
    groupSize: "Perfect. We'll adapt recommendations for your group size too.",
    interests: "Amazing choices. Your personalised dashboard is ready.",
  };

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  function canProceed() {
    const f = current.field as keyof Profile;
    if (current.type === "text") return textVal.trim().length > 0;
    if (current.type === "multi") return (profile.interests as string[]).length > 0;
    return (profile[f] as string).length > 0;
  }

  function handleNext() {
    // save current step value
    if (current.type === "text") {
      setProfile(p => ({ ...p, name: textVal.trim() }));
    }

    // show AI response line briefly
    const key = current.field;
    setAiLine(aiLines[key] || "");

    if (isLast) {
      setShowDone(true);
      setTimeout(() => {
        const finalProfile = { ...profile };
        if (current.type === "text") finalProfile.name = textVal.trim();
        onComplete(finalProfile);
      }, 1800);
      return;
    }

    setTimeout(() => {
      setAiLine("");
      setStep(s => s + 1);
    }, 1000);
  }

  function toggleInterest(label: string) {
    setProfile(p => ({
      ...p,
      interests: p.interests.includes(label)
        ? p.interests.filter(i => i !== label)
        : [...p.interests, label],
    }));
  }

  const progress = ((step) / steps.length) * 100;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(5,10,18,0.7)", backdropFilter: "blur(10px)" }}>

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_32px_80px_rgba(0,0,0,0.25)]"
        style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)" }}>

        {/* Progress bar */}
        <div className="h-1 w-full bg-slate-100">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#10b981,#059669)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">MP AI</p>
            <p className="text-[9px] text-slate-400">Building your travel profile</p>
          </div>
          <div className="ml-auto text-[10px] font-semibold text-slate-400">{step + 1} / {steps.length}</div>
          {onSkip && !showDone && (
            <button
              onClick={onSkip}
              className="ml-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Skip
            </button>
          )}
        </div>

        {/* AI message bubble */}
        <div className="mx-6 mt-3 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-6 text-slate-700"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}>
          {aiLine || current.question}
        </div>

        <div className="px-6 pb-6 pt-4">
          {!showDone ? (
            <>
              <p className="text-xs text-slate-400 mb-4">{current.sub}</p>

              {/* Text input */}
              {current.type === "text" && (
                <input
                  autoFocus
                  value={textVal}
                  onChange={e => setTextVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && canProceed() && handleNext()}
                  placeholder={current.placeholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
                />
              )}

              {/* Single choice */}
              {current.type === "choice" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {current.options!.map(opt => {
                    const isSelected = profile[current.field as keyof Profile] === opt.label;
                    return (
                      <button key={opt.label}
                        onClick={() => setProfile(p => ({ ...p, [current.field]: opt.label }))}
                        className="flex items-start gap-3 rounded-2xl border p-3.5 text-left transition"
                        style={{
                          borderColor: isSelected ? "#10b981" : "rgba(15,23,42,0.1)",
                          background: isSelected ? "rgba(16,185,129,0.06)" : "white",
                          boxShadow: isSelected ? "0 0 0 1.5px #10b981" : "none",
                        }}>
                        <span className="text-xl leading-none mt-0.5">{opt.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{opt.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{"desc" in opt ? opt.desc : ""}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Multi choice */}
              {current.type === "multi" && (
                <div className="grid grid-cols-4 gap-2">
                  {current.options!.map(opt => {
                    const isSelected = profile.interests.includes(opt.label);
                    return (
                      <button key={opt.label}
                        onClick={() => toggleInterest(opt.label)}
                        className="flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition"
                        style={{
                          borderColor: isSelected ? "#10b981" : "rgba(15,23,42,0.1)",
                          background: isSelected ? "rgba(16,185,129,0.07)" : "white",
                          boxShadow: isSelected ? "0 0 0 1.5px #10b981" : "none",
                        }}>
                        <span className="text-xl">{opt.icon}</span>
                        <p className="text-[9px] font-semibold text-slate-700 text-center leading-tight">{opt.label}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Next button */}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="mt-5 w-full rounded-full py-3.5 text-sm font-bold transition"
                style={{
                  background: canProceed() ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(15,23,42,0.08)",
                  color: canProceed() ? "white" : "#94a3b8",
                  cursor: canProceed() ? "pointer" : "not-allowed",
                }}>
                {isLast ? "Build My Profile ✓" : "Continue →"}
              </button>

              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="mt-2 w-full text-center text-xs text-slate-400 hover:text-slate-600 transition py-1">
                  ← Back
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-display text-2xl text-slate-800">Profile ready, {profile.name || textVal}!</p>
              <p className="mt-2 text-xs text-slate-500">Taking you to your personalised dashboard…</p>
              <div className="mt-4 h-1 w-32 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ animation: "fillBar 1.6s linear forwards" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
