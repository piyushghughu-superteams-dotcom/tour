import { NavLink } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { type Profile } from "../components/ProfileSetupModal";

function getProfileSummary(profile: Profile) {
  const interests = profile.interests.slice(0, 3).join(", ");
  return {
    greeting: `Welcome${profile.name ? `, ${profile.name}` : ""}`,
    focus: profile.style || "Flexible Traveler",
    duration: profile.duration || "Short Trip",
    budget: profile.budget || "Mid Range",
    groupSize: profile.groupSize || "Solo",
    interests: interests || "Wildlife, heritage, and scenic escapes",
  };
}

function buildGuidedPlan(profile: Profile) {
  const styleRoutes: Record<string, string[]> = {
    "Adventure Seeker": ["Kanha or Pench safari", "Bhedaghat river stretch", "Pachmarhi viewpoints"],
    "Culture Explorer": ["Khajuraho temples", "Orchha heritage stay", "Gwalior fort circuit"],
    "Nature Lover": ["Pachmarhi hill retreat", "Waterfront and falls", "Forest-edge slow stays"],
    "Luxury Traveler": ["Premium safari lodge", "Boutique heritage stay", "Private scenic transfers"],
  };

  const route = styleRoutes[profile.style] || ["Wildlife circuit", "Heritage stop", "Nature retreat"];

  const cards = [
    {
      title: "Arrival and first anchor",
      detail: `Begin with ${profile.interests[0] || "your top interest"} and keep day one light and flexible.`,
    },
    {
      title: "Stay and pacing",
      detail: `Match hotels and activities to your ${profile.budget || "preferred"} budget for ${profile.groupSize || "your group"}.`,
    },
    {
      title: "Route intelligence",
      detail: `Use ${profile.style || "your travel style"} to balance movement, rest time, and sightseeing density.`,
    },
    {
      title: "Final day rhythm",
      detail: `Close with a scenic stop or easier return leg rather than a rushed finish.`,
    },
  ];

  return {
    title: `${profile.duration || "Short Trip"} AI-guided route`,
    subtitle: `Built around ${profile.interests.length ? profile.interests.join(", ") : "your chosen interests"}.`,
    route,
    cards,
  };
}

const AI_FEATURES = [
  { label: "Smart Routing", sub: "Dynamic Pathfinding", color: "text-emerald-400" },
  { label: "Budget Engine", sub: "Cost Optimization", color: "text-amber-400" },
  { label: "Culture Scan", sub: "Heritage Discovery", color: "text-sky-400" },
  { label: "Trip Planner", sub: "AI-Guided Itinerary", color: "text-violet-400" },
];

function MobileFeatureCycle() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % AI_FEATURES.length), 2200);
    return () => clearInterval(t);
  }, []);

  const f = AI_FEATURES[active];

  return (
    <div className="relative flex items-center justify-center">
      {/* Phone frame */}
      <div className="relative w-44 h-[22rem] rounded-[2.5rem] border-4 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col">
        {/* Screen image cycles */}
        <div className="relative flex-1 overflow-hidden">
          <img
            src="/images/hills/four.jpg"
            alt="screen"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          {/* Dynamic feature overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4">
            <div
              key={active}
              className="animate-fadeIn"
            >
              <p className={`text-[9px] font-bold uppercase tracking-[0.22em] ${f.color}`}>{f.label}</p>
              <p className="mt-1 text-xs font-semibold text-white">{f.sub}</p>
            </div>
          </div>
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-900 rounded-full z-10" />
        </div>
        {/* Home bar */}
        <div className="h-6 bg-slate-950 flex items-center justify-center">
          <div className="w-10 h-1 rounded-full bg-slate-600" />
        </div>
      </div>
      {/* Feature dot indicators */}
      <div className="absolute -bottom-6 flex gap-1.5">
        {AI_FEATURES.map((_, i) => (
          <span
            key={i}
            className={`block h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-5 bg-emerald-400" : "w-1.5 bg-slate-600"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardHome({
  profile,
  onEditProfile,
}: {
  profile: Profile | null;
  onEditProfile: () => void;
}) {
  const summary = profile ? getProfileSummary(profile) : null;
  const guidedPlan = useMemo(() => (profile ? buildGuidedPlan(profile) : null), [profile]);

  return (
    <div className="space-y-8 pb-16">

      {/* ── SECTION 1: Hero ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] min-h-[22rem] flex items-center shadow-2xl">
        {/* Scenic background — warm/green tones, not dark */}
        <img
          src="/images/hills/four.jpg"
          alt="Madhya Pradesh"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />

        <div className="relative z-10 w-full px-8 py-12 md:px-14 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
          {/* Left: text */}
          <div className="max-w-xl">
            <h1 className="mt-2 text-4xl md:text-5xl leading-[1.1] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              {summary
                ? "Your MP trip, refined by intelligence."
                : "The next generation of travel planning."}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-200">
              {summary
                ? `Optimizing a ${summary.duration.toLowerCase()} for ${summary.groupSize.toLowerCase()} based on ${summary.interests.toLowerCase()}.`
                : "Neural route optimization, smart budget analysis, and real-time destination discovery — unified."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onEditProfile}
                className="rounded-full bg-[var(--color-gold)] px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:scale-105 hover:brightness-110"
              >
                {profile ? "Update AI Profile" : "Initialize Profile"}
              </button>

            </div>
          </div>

          {/* Right: mobile feature cycle */}
          <div className="hidden md:flex items-center justify-center pr-4">
            <MobileFeatureCycle />
          </div>
        </div>
      </section>
      
      {/* ── SECTION 1.5: Quick Status Row ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Profile Status", value: profile ? "Complete" : "Pending", sub: profile ? "Optimizing for you" : "AI is on standby", icon: "👤", color: "bg-emerald-50 text-emerald-600" },
          { label: "Current Plan", value: profile ? `${profile.duration}` : "None", sub: profile ? "Active Route" : "Awaiting sync", icon: "🗺️", color: "bg-blue-50 text-blue-600" },
          { label: "Travel Style", value: profile ? `${profile.style.split(' ')[0]}` : "Mixed", sub: profile ? "Theme locked" : "Default mode", icon: "🧭", color: "bg-violet-50 text-violet-600" },
          { label: "Live Weather", value: "24°C", sub: "Clear skies in MP", icon: "☀️", color: "bg-amber-50 text-amber-600" },
        ].map((stat, i) => (
          <div key={i} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xl ${stat.color}`}>{stat.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="font-display text-lg text-slate-900 truncate">{stat.value}</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-slate-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* ── SECTION 2: Video Left + Two Content Blocks Right ── */}
      <section className="grid grid-cols-1 lg:grid-cols-[0.45fr_1fr] gap-6 items-start">
        {/* Left column: stacked small cards */}
        <div className="flex flex-col gap-4">
          {/* Video card */}
          <div className="group relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl border border-slate-200">
            <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-100">
              <source src="/videos/Home/travel.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-5 flex flex-col justify-end">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-400">Live Capture</p>
              <p className="mt-1 text-sm font-bold text-white">Journey in Motion</p>
            </div>
          </div>

          {/* Profile pulse small card */}
          <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600">Live Profile Signal</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-xl text-slate-900 truncate">{summary?.focus || "Initialize"}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{summary?.interests || "Awaiting preferences"}</p>
              </div>
              <div className="shrink-0 h-10 w-10 rounded-full border-4 border-white bg-emerald-500 shadow flex items-center justify-center text-white font-bold text-sm">
                {profile?.name?.charAt(0) || "?"}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: large content block + medium block */}
        <div className="flex flex-col gap-4">
          {/* Large AI Platform Guide card */}
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl text-slate-900">AI Platform Guide</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Intelligent Tourism Ecosystem</p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Neural Trip Planning",
                  desc: "Analyzes thousands of data points to build paths that respect your energy and interests.",
                  icon: "M9 20l-5.447-2.724A2 2 0 013 15.382V6m0 0l5.447 2.724a2 2 0 011.106 1.789V15m-6.553-9h.01m13.447 11.447L21 15.382V6m0 0l-5.447 2.724a2 2 0 00-1.106 1.789V15m6.553-9h.01",
                },
                {
                  title: "Smart Budget Allocation",
                  desc: "Dynamic pricing distributes your budget across stays, safaris, and local experiences.",
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  title: "Visual Route Optimizer",
                  desc: "Interactive roadmaps simulate your journey stop-by-stop with beautiful transitions.",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                },
                {
                  title: "Context-Aware Atlas",
                  desc: "Historical and cultural context for every destination across Madhya Pradesh.",
                  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                },
              ].map((item, idx) => (
                <div key={idx} className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-5 transition hover:bg-white hover:shadow-md">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm transition group-hover:scale-110 group-hover:text-blue-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Medium: AI-guided plan summary (if profile set) */}
          {guidedPlan ? (
            <div className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-violet-500">AI Route Preview</p>
              <h3 className="mt-2 font-display text-lg text-slate-900">{guidedPlan.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{guidedPlan.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {guidedPlan.route.map((stop, i) => (
                  <span key={i} className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                    {stop}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Route preview unlocks after profile setup</p>
                <p className="text-xs text-slate-400 mt-0.5">Initialize your AI profile to see a personalized MP route.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 3: Two Content Blocks Left + Video Right ── */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.45fr] gap-6 items-start">
        {/* Left: two stacked content cards */}
        <div className="flex flex-col gap-4">
          {/* Wider destination highlights card */}
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-7 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl text-slate-900">Discover MP Destinations</h2>
                <p className="text-xs text-slate-500 mt-1">Curated zones matched to your travel style</p>
              </div>
              <NavLink to="/dashboard/map" className="text-xs font-bold text-blue-600 hover:underline shrink-0">
                Open Atlas →
              </NavLink>
            </div>
            <div className="flex flex-col divide-y divide-slate-100">
              {[
                {
                  label: "Pachmarhi",
                  tag: "Hill Station",
                  accent: "#10b981",
                  desc: "MP's only hill station. Dense forests, dramatic cliffs, and cool air make it the perfect reset from city life.",
                },
                {
                  label: "Khajuraho",
                  tag: "UNESCO Heritage",
                  accent: "#f59e0b",
                  desc: "Thousand-year-old temples carved with extraordinary detail. A living record of medieval Indian art and devotion.",
                },
                {
                  label: "Kanha & Pench",
                  tag: "Wildlife Corridor",
                  accent: "#16a34a",
                  desc: "The real Jungle Book country. Home to Bengal tigers, leopards, and some of India's finest safari experiences.",
                },
                {
                  label: "Bhedaghat",
                  tag: "Marble Gorge",
                  accent: "#0ea5e9",
                  desc: "100-foot marble cliffs line the Narmada river. By moonlight or boat, it's unlike anything else in India.",
                },
                {
                  label: "Orchha",
                  tag: "Forgotten Kingdom",
                  accent: "#e11d48",
                  desc: "A medieval Bundela capital frozen in time. Riverside cenotaphs, painted palaces, and absolute quiet.",
                },
              ].map((dest) => (
                <NavLink
                  key={dest.label}
                  to="/dashboard/map"
                  className="group flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:opacity-80 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-display text-xl font-semibold text-slate-900 group-hover:underline underline-offset-2">{dest.label}</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: dest.accent }}>{dest.tag}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{dest.desc}</p>
                  </div>
                  <svg className="w-4 h-4 shrink-0 mt-1.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: tall video + tiny card */}
        <div className="flex flex-col gap-4">
          <div className="group relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl border border-slate-200" style={{ aspectRatio: "3/4" }}>
            <video autoPlay loop muted playsInline className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-100">
              <source src="/videos/Home/historic_place.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent p-5 flex flex-col justify-end">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-amber-400">Culture Engine</p>
              <p className="mt-1 text-sm font-bold text-white">Heritage Discovery</p>
              <p className="mt-1 text-xs text-slate-300">Deep cultural context for every MP landmark.</p>
            </div>
          </div>

          {/* Smart AI Insight Card */}
          <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-emerald-900">Live AI Insight</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
                {profile ? (
                  <>Current weather in <b>{guidedPlan?.route[0] || "Kanha"}</b> is 24°C. Perfect for a <b>{profile.style.toLowerCase()}</b> session today.</>
                ) : (
                  "Complete your profile to unlock real-time weather and travel insights for your route."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: Platform Deep Dive ── */}
      <section className="rounded-[2.5rem] border border-slate-200 bg-white/70 shadow-xl backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <div className="border-b border-slate-100 px-8 py-10 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600">Platform Overview</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-slate-900 leading-tight">
              Built differently,<br />for Madhya Pradesh.
            </h2>
          </div>
          <p className="text-base leading-relaxed text-slate-500">
            Most travel apps treat India like a product catalogue. We built this as an intelligence layer — one that understands the specific rhythms, distances, and seasons of MP travel. The state is enormous, underexplored, and logistically unforgiving if you plan it blind.
          </p>
        </div>

        {/* How it works — 3 steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
          {[
            {
              step: "01",
              title: "You set a profile once.",
              body: "Tell the AI your travel style, group size, budget band, and what excites you — wildlife, heritage, hills, or all three. That profile becomes the lens through which everything else is filtered. You don't repeat yourself across tools.",
              color: "text-emerald-500",
            },
            {
              step: "02",
              title: "The engine builds context.",
              body: "It cross-references 52+ destinations, seasonal road conditions, safari booking windows, and distance logic to surface options that actually fit your constraints — not just the ones with the best SEO. Kanha in December is different from Kanha in June.",
              color: "text-sky-500",
            },
            {
              step: "03",
              title: "You navigate, not guess.",
              body: "Every tool reads from the same profile. Change your group size and the budget recalculates. Switch your style and the planner reorders your stops. No re-entering information, no contradictions between tabs.",
              color: "text-amber-500",
            },
          ].map((s) => (
            <div key={s.step} className="px-8 py-9 md:px-10">
              <p className={`font-display text-6xl font-bold ${s.color} opacity-15 leading-none`}>{s.step}</p>
              <h3 className="mt-5 font-display text-xl text-slate-900">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Tool deep-dives */}
        <div className="divide-y divide-slate-100">
          {[
            {
              label: "AI Trip Planner",
              tag: "Core Module",
              color: "#10b981",
              path: "planner",
              headline: "An itinerary that thinks about your energy, not just your calendar.",
              body: "Generic trip planners fill every hour. This one doesn't. It models travel fatigue, accounts for drive time between MP's spread-out destinations, and deliberately spaces high-intensity experiences like safaris with slower cultural days. A 5-day plan built here will feel different on day four than one assembled from a blog post.",
              detail: "It understands that Kanha and Pench are 3 hours apart. That Khajuraho needs a full morning, not 90 minutes. That arriving in Pachmarhi after dark on a mountain road is a choice you don't want to make by accident.",
            },
            {
              label: "Smart Atlas",
              tag: "Discovery Layer",
              color: "#0ea5e9",
              path: "map",
              headline: "Every destination has a story. Most apps skip it.",
              body: "The Smart Atlas doesn't just show you where a place is — it tells you why it matters. Each entry carries historical context, the best season to visit, what kind of traveler it suits, and what nearby stops pair well with it. It's the difference between knowing Orchha exists and knowing it was a Bundela capital abandoned mid-construction because the king moved his court overnight on a spiritual whim.",
              detail: "Filter by category — wildlife, hill stations, temples, waterfalls, forts — or let the AI surface destinations matched to your profile automatically.",
            },
            {
              label: "Road Guide",
              tag: "Navigation Intelligence",
              color: "#ef4444",
              path: "routes",
              headline: "MP roads are beautiful. Some of them are also deceptive.",
              body: "The Road Guide overlays route logic that GPS apps miss: which NH stretches are smooth and which are under seasonal repair, where fuel stops thin out near forest zones, and which roads become genuinely risky after monsoon. For a state where the difference between a good and bad road can mean 2 extra hours, this context matters far more than turn-by-turn directions alone.",
              detail: "Optimized for self-drive trips. Includes landmark callouts, recommended pit stops, and distance realism between major MP nodes so your ETA is something you can actually trust.",
            },
            {
              label: "Budget Planner",
              tag: "Financial Intelligence",
              color: "#ec4899",
              path: "budget",
              headline: "MP travel can work on any budget. The trick is knowing where it flexes.",
              body: "Safari lodges near Kanha range from ₹3,000 to ₹30,000 a night — and the difference isn't always what you'd expect. The Budget Planner breaks your total envelope across accommodation, park fees, transport, food, and experiences, then flags where you can stretch (some of India's best forest lodges are mid-range in MP) and where cutting corners has a real cost.",
              detail: "Set your total budget and group size. The planner distributes it intelligently and recalculates when you swap a destination, add a night, or change your travel style.",
            },
          ].map((tool) => (
            <div key={tool.path} className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr]">
              <div className="px-8 py-9 md:px-12 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between gap-8">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: tool.color }}>{tool.tag}</p>
                  <h3 className="mt-3 font-display text-2xl md:text-3xl text-slate-900 leading-snug">{tool.headline}</h3>
                </div>
                <NavLink
                  to={`/dashboard/${tool.path}`}
                  className="inline-flex items-center gap-2 self-start rounded-full border px-5 py-2.5 text-xs font-bold transition hover:shadow-md"
                  style={{ borderColor: `${tool.color}50`, color: tool.color, background: `${tool.color}08` }}
                >
                  Open {tool.label}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              </div>
              <div className="px-8 py-9 md:px-12 flex flex-col gap-5 justify-center">
                <p className="text-sm leading-[1.8] text-slate-600">{tool.body}</p>
                <p className="text-xs leading-relaxed text-slate-400 border-l-2 pl-4 italic" style={{ borderColor: `${tool.color}60` }}>{tool.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-8 py-7 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
            The platform is most useful once your profile is set. Every tool sharpens around your specific trip — not a generic MP itinerary pulled from a travel blog.
          </p>
          <button
            onClick={onEditProfile}
            className="shrink-0 rounded-full bg-slate-950 px-7 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm"
          >
            {profile ? "Update Profile" : "Set Up Profile"}
          </button>
        </div>
      </section>
    </div>
  );
}
