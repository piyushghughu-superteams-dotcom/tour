import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ProfileSetupModal, { type Profile } from "../components/ProfileSetupModal";

import InteractiveMap from "./InteractiveMap";
import SmartCompass from "./SmartCompass";
import AiBudgetPlanner from "./AiBudgetPlanner";
import SmartAnalyzer from "./SmartAnalyzer";
import AiRouteOptimizer from "./AiRouteOptimizer";
import AIChat from "./AIChat";


const PROFILE_STORAGE_KEY = "mp-tourism-profile";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHome from "./DashboardHome";
import DestinationExplorer from "./DestinationExplorer";
import AiTripPlanner from "./AiTripPlanner";
import HotelsAndStays from "./HotelsAndStays";


function ComingSoon({ title }: { title: string }) {
  return (
    <div className="rounded-[2rem] border border-white/50 bg-white/80 p-10 text-center shadow-[0_24px_80px_rgba(148,163,184,0.18)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981,#0f766e)]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="mt-5 font-display text-3xl text-slate-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
        This section is being shaped into the same premium AI-tourism experience as the homepage.
      </p>
      <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        Coming soon
      </span>
    </div>
  );
}

const MARQUEE_ITEMS = [
  "Kanha National Park",
  "Khajuraho Temples",
  "Pachmarhi Hills",
  "Bhedaghat Marble Rocks",
  "Orchha Heritage",
  "Bandhavgarh Tiger Reserve",
  "Mandu Ruins",
  "Omkareshwar Ghats",
  "Pench Safari",
  "Ujjain Temples",
];

function TopBarMarquee() {
  return (
    <div className="overflow-hidden w-56 md:w-80">
      <div
        className="flex gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        style={{ animation: "marqueeScroll 18s linear infinite" }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} className="shrink-0 flex items-center gap-2">
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      setShowProfileModal(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Profile;
      setProfile(parsed);
    } catch {
      setShowProfileModal(true);
    }
  }, []);

  function handleComplete(nextProfile: Profile) {
    setProfile(nextProfile);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    setShowProfileModal(false);
  }

  function handleSkip() {
    setShowProfileModal(false);
  }

  function handleEditProfile() {
    setShowProfileModal(true);
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[var(--color-cream)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.07),transparent_24%)]" />

      {showProfileModal && <ProfileSetupModal onComplete={handleComplete} onSkip={handleSkip} />}

      <div className="relative flex h-full overflow-hidden">
        <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 flex flex-col min-w-0 h-full">
          <div className="sticky top-0 z-20 shrink-0 border-b border-white/50 bg-white/60 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-8">
              <TopBarMarquee />

              <div className="relative flex items-center gap-3">
                <button
                  onClick={() => setShowProfilePanel((p) => !p)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white transition hover:bg-slate-700"
                  title="My profile"
                >
                  {profile?.name ? profile.name.slice(0, 1).toUpperCase() : "U"}
                </button>

                {showProfilePanel && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowProfilePanel(false)} />
                    <div className="absolute right-0 top-12 z-40 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_16px_48px_rgba(15,23,42,0.14)]"
                      style={{ animation: "dropIn 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
                      <div className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-900">{profile?.name || "Guest"}</p>
                        <p className="text-xs text-slate-400">{profile?.profession || "No profession set"}</p>
                      </div>
                      <div className="border-t border-slate-100 px-3 py-2">
                        <button
                          onClick={() => { setShowProfilePanel(false); handleEditProfile(); }}
                          className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 md:py-8">
              <Routes>
                <Route index element={<Navigate to="/dashboard/home" replace />} />
                <Route path="home" element={<DashboardHome profile={profile} onEditProfile={handleEditProfile} />} />

                <Route path="map" element={<InteractiveMap />} />
                <Route path="compass" element={<SmartCompass />} />
                <Route path="itinerary" element={<ComingSoon title="Itinerary Builder" />} />
                <Route path="planner" element={<AiTripPlanner />} />
                <Route path="budget" element={<AiBudgetPlanner />} />
                <Route path="destinations" element={<DestinationExplorer />} />
                <Route path="dest-wildlife" element={<DestinationExplorer initialCategory="Wildlife" />} />
                <Route path="dest-heritage" element={<DestinationExplorer initialCategory="Heritage" />} />
                <Route path="dest-nature" element={<DestinationExplorer initialCategory="Hills" />} />
                <Route path="dest-spiritual" element={<DestinationExplorer initialCategory="Spiritual" />} />

                <Route path="hotels" element={<HotelsAndStays />} />
                <Route path="routes" element={<AiRouteOptimizer />} />
                <Route path="weather" element={<SmartAnalyzer />} />
                <Route path="chat" element={<AIChat profile={profile} />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
