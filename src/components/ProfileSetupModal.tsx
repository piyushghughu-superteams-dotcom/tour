import { useState, useEffect } from "react";

type StepOption = { label: string; icon: string; desc?: string };

export interface Profile {
  name: string;
  profession: string;
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

const steps = [
  {
    id: "name",
    field: "name",
    type: "text",
    label: "Your Name",
    question: "What should we call you?",
    sub: "We'll personalise your entire AI dashboard around you.",
    placeholder: "Enter your name…",
    icon: "👋",
  },
  {
    id: "profession",
    field: "profession",
    type: "choice",
    label: "Profession",
    question: "What do you do professionally?",
    sub: "Helps AI match trip pacing, content depth, and experience type.",
    icon: "💼",
    options: [
      { label: "Business Professional", icon: "🏢", desc: "Meetings, efficiency, premium stays" },
      { label: "Engineer", icon: "⚙️", desc: "Analytical, tech-savvy, planned routes" },
      { label: "Student", icon: "🎓", desc: "Budget-smart, experience-rich travel" },
      { label: "Photographer", icon: "📸", desc: "Golden hours, scenic routes, unique spots" },
      { label: "Doctor / Healthcare", icon: "🏥", desc: "Relaxation-focused, wellness retreats" },
      { label: "Teacher / Academic", icon: "📚", desc: "Cultural depth, heritage, learning trails" },
      { label: "Artist / Creative", icon: "🎨", desc: "Offbeat places, local art, slow travel" },
      { label: "Government / Defence", icon: "🎖️", desc: "Structured, safe, well-planned routes" },
      { label: "Entrepreneur", icon: "🚀", desc: "Flexible, fast-paced, premium experience" },
      { label: "Retired", icon: "🌅", desc: "Comfort-first, leisurely paced travel" },
      { label: "Other", icon: "✏️", desc: "Type your own profession below" },
    ],
  },
  {
    id: "style",
    field: "style",
    type: "choice",
    label: "Travel Style",
    question: "What kind of traveler are you?",
    sub: "Your style shapes every route, stay, and recommendation.",
    icon: "🧭",
    options: [
      { label: "Adventure Seeker", icon: "🏕️", desc: "Safaris, treks, offbeat trails" },
      { label: "Culture Explorer", icon: "🏛️", desc: "Temples, forts, local history" },
      { label: "Nature Lover", icon: "🌿", desc: "Rivers, hills, quiet escapes" },
      { label: "Luxury Traveler", icon: "✨", desc: "Premium stays, curated routes" },
    ],
  },
  {
    id: "duration",
    field: "duration",
    type: "choice",
    label: "Trip Duration",
    question: "How long is your trip?",
    sub: "AI will build the right depth and density for your schedule.",
    icon: "🗓️",
    options: [
      { label: "Weekend", icon: "⚡", desc: "2–3 days" },
      { label: "Short Trip", icon: "📅", desc: "4–6 days" },
      { label: "Week+", icon: "🗓️", desc: "7–10 days" },
      { label: "Long Journey", icon: "🌍", desc: "10+ days" },
    ],
  },
  {
    id: "budget",
    field: "budget",
    type: "choice",
    label: "Budget",
    question: "What's your daily budget?",
    sub: "AI will filter hotels, activities, and routes accordingly.",
    icon: "💳",
    options: [
      { label: "Budget", icon: "💰", desc: "Under ₹2,000/day" },
      { label: "Mid Range", icon: "💳", desc: "₹2,000–₹5,000/day" },
      { label: "Premium", icon: "🏆", desc: "₹5,000–₹12,000/day" },
      { label: "Luxury", icon: "👑", desc: "₹12,000+/day" },
    ],
  },
  {
    id: "groupSize",
    field: "groupSize",
    type: "choice",
    label: "Group Size",
    question: "How many people are travelling?",
    sub: "Routes, stays, and pacing adapt to your group.",
    icon: "👥",
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
    field: "interests",
    type: "multi",
    label: "Interests",
    question: "What excites you most?",
    sub: "Pick as many as you like — AI weighs all of them.",
    icon: "🎯",
    options: [
      { label: "Wildlife Safaris", icon: "🐯" },
      { label: "Heritage Temples", icon: "🛕" },
      { label: "River & Waterfalls", icon: "🌊" },
      { label: "Hill Stations", icon: "⛰️" },
      { label: "Local Cuisine", icon: "🍛" },
      { label: "Photography", icon: "📸" },
      { label: "Camping", icon: "🏕️" },
      { label: "Boat Rides", icon: "⛵" },
      { label: "Ayurveda & Wellness", icon: "🧘" },
      { label: "Bird Watching", icon: "🦅" },
      { label: "Night Sky & Stars", icon: "🌌" },
      { label: "Local Markets", icon: "🛍️" },
    ],
  },
];

const aiResponses: Record<string, (val: string) => string> = {
  name: (v) => `Great to meet you, ${v}! Let's build a trip profile that's entirely yours.`,
  profession: (v) => `Got it — a ${v.toLowerCase()} traveler. AI will tune pacing and experiences accordingly.`,
  style: (v) => `${v} — perfect. Every recommendation will reflect your travel energy.`,
  duration: (v) => `${v} trip noted. AI will keep the itinerary tight, well-paced, and realistic.`,
  budget: (v) => `${v} budget locked in. Only relevant stays and activities will surface.`,
  groupSize: (v) => `Travelling as ${v.toLowerCase()}. Routes and stays will be sized for your group.`,
  interests: () => `Excellent choices. Your personalised AI dashboard is being built now.`,
};

export default function ProfileSetupModal({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");
  const [visible, setVisible] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const [done, setDone] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    name: "", profession: "", style: "", duration: "", budget: "", groupSize: "", interests: [],
  });
  const [textVal, setTextVal] = useState("");
  const [otherProfession, setOtherProfession] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const current = steps[step];
  const isLast = step === steps.length - 1;


  function canProceed() {
    if (current.type === "text") return textVal.trim().length > 0;
    if (current.type === "multi") return profile.interests.length > 0;
    if (current.field === "profession" && profile.profession === "Other") return otherProfession.trim().length > 0;
    return (profile[current.field as keyof Profile] as string).length > 0;
  }

  function currentValue(): string {
    if (current.type === "text") return textVal.trim();
    if (current.type === "multi") return profile.interests.join(", ");
    return profile[current.field as keyof Profile] as string;
  }

  function advance() {
    if (!canProceed() || transitioning) return;

    const val = currentValue();
    const msg = aiResponses[current.field]?.(val) ?? "";
    setAiMsg(msg);

    if (current.type === "text") {
      setProfile((p) => ({ ...p, name: textVal.trim() }));
    }
    if (current.field === "profession" && profile.profession === "Other" && otherProfession.trim()) {
      setProfile((p) => ({ ...p, profession: otherProfession.trim() }));
    }

    if (isLast) {
      setDone(true);
      setTimeout(() => {
        const final: Profile = { ...profile };
        if (current.type === "text") final.name = textVal.trim();
        if (current.field === "profession" && final.profession === "Other" && otherProfession.trim()) final.profession = otherProfession.trim();
        onComplete(final);
      }, 1800);
      return;
    }

    setTransitioning(true);
    setAnimDir("forward");
    setTimeout(() => {
      setAiMsg("");
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 900);
  }

  function goBack() {
    if (step === 0 || transitioning) return;
    setAnimDir("back");
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setAiMsg("");
      setTransitioning(false);
    }, 300);
  }

  function toggleInterest(label: string) {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(label)
        ? p.interests.filter((i) => i !== label)
        : [...p.interests, label],
    }));
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(2,6,18,0.82)", backdropFilter: "blur(14px)" }}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-[2.2rem] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.22)]"
        style={{ animation: "modalIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-7 pt-7 pb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#064e3b]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">MP AI Planner</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.18em]">Building your travel profile</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-400">{step + 1} / {steps.length}</span>
            {onSkip && !done && (
              <button
                onClick={onSkip}
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
              >
                Skip
              </button>
            )}
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1.5 px-7 pb-4">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                flex: i === step ? 2 : 1,
                background: i < step ? "#064e3b" : i === step ? "#065f46" : "#e2e8f0",
              }}
            />
          ))}
        </div>

        {/* AI message */}
        <div className="mx-7 mb-5 rounded-2xl px-5 py-4 bg-[#f0fdf4] border border-[#bbf7d0]">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-base">{current.icon}</span>
            <p className="text-sm leading-6 text-slate-800 font-medium">
              {aiMsg || current.question}
            </p>
          </div>
          <p className="mt-1 ml-7 text-xs text-slate-400">{current.sub}</p>
        </div>

        {/* Content */}
        <div
          className="px-7 pb-7 transition-all duration-300"
          style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? `translateX(${animDir === "forward" ? "-20px" : "20px"})` : "none" }}
        >
          {!done ? (
            <>
              {/* Text input */}
              {current.type === "text" && (
                <input
                  autoFocus
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canProceed() && advance()}
                  placeholder={current.placeholder}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-4 text-base font-medium text-slate-800 outline-none placeholder:text-slate-300 transition-all focus:border-[#065f46] focus:bg-white focus:ring-4 focus:ring-[#064e3b]/10"
                />
              )}

              {/* Single choice */}
              {current.type === "choice" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {current.options!.map((opt: StepOption) => {
                    const isSelected = (profile[current.field as keyof Profile] as string) === opt.label ||
                      (opt.label === "Other" && current.field === "profession" && !current.options!.some(o => o.label === profile.profession) && profile.profession !== "");
                    return (
                      <button
                        key={opt.label}
                        onClick={() => setProfile((p) => ({ ...p, [current.field]: opt.label }))}
                        className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${opt.label === "Other" && current.field === "profession" ? "col-span-2 justify-center" : ""}`}
                        style={{
                          borderColor: isSelected ? "#065f46" : "#e2e8f0",
                          background: isSelected ? "#f0fdf4" : "white",
                          transform: isSelected ? "scale(1.01)" : "scale(1)",
                        }}
                      >
                        <span className="text-2xl leading-none shrink-0">{opt.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{opt.label}</p>
                          {"desc" in opt && <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.desc}</p>}
                        </div>
                        {isSelected && (
                          <div className="ml-auto shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#065f46]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Other profession input */}
              {current.field === "profession" && profile.profession === "Other" && (
                <input
                  autoFocus
                  value={otherProfession}
                  onChange={(e) => {
                    setOtherProfession(e.target.value);
                    setProfile((p) => ({ ...p, profession: e.target.value || "Other" }));
                  }}
                  placeholder="Type your profession…"
                  className="mt-3 w-full rounded-2xl border-2 border-[#065f46] bg-[#f0fdf4] px-5 py-3.5 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-300 transition-all"
                />
              )}

              {/* Multi choice */}
              {current.type === "multi" && (
                <div className="grid grid-cols-3 gap-2.5">
                  {current.options!.map((opt: StepOption) => {
                    const isSelected = profile.interests.includes(opt.label);
                    return (
                      <button
                        key={opt.label}
                        onClick={() => toggleInterest(opt.label)}
                        className="flex flex-col items-center gap-2 rounded-2xl border-2 py-4 px-2 transition-all duration-200"
                        style={{
                          borderColor: isSelected ? "#065f46" : "#e2e8f0",
                          background: isSelected ? "#f0fdf4" : "white",
                          transform: isSelected ? "scale(1.02)" : "scale(1)",
                        }}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <p className="text-[10px] font-semibold text-slate-700 text-center leading-tight">{opt.label}</p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                {step > 0 && (
                  <button
                    onClick={goBack}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={advance}
                  disabled={!canProceed()}
                  className="flex-1 rounded-full py-3.5 text-sm font-bold transition-all duration-200"
                  style={{
                    background: canProceed() ? "#064e3b" : "#e2e8f0",
                    color: canProceed() ? "white" : "#94a3b8",
                    cursor: canProceed() ? "pointer" : "not-allowed",
                    boxShadow: canProceed() ? "0 8px 24px rgba(6,78,59,0.25)" : "none",
                  }}
                >
                  {isLast ? "Build My Profile →" : "Continue →"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#064e3b] shadow-[0_12px_32px_rgba(6,78,59,0.28)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-display text-3xl text-slate-900">Profile ready{profile.name ? `, ${profile.name}` : ""}!</p>
              <p className="mt-2 text-sm text-slate-400">Taking you to your personalised AI dashboard…</p>
              <div className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#064e3b]" style={{ animation: "fillBar 1.6s linear forwards" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
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
