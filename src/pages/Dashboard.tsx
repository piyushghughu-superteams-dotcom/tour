import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ProfileSetupModal, { type Profile } from "../components/ProfileSetupModal";
import AiTripPlanner from "./AiTripPlanner";
import InteractiveMap from "./InteractiveMap";
import SmartCompass from "./SmartCompass";
import AiBudgetPlanner from "./AiBudgetPlanner";
import SmartAnalyzer from "./SmartAnalyzer";
import AiRouteOptimizer from "./AiRouteOptimizer";

const PROFILE_STORAGE_KEY = "mp-tourism-profile";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHome from "./DashboardHome";

type Destination = {
  name: string;
  category: "Wildlife" | "Heritage" | "Water" | "Hills" | "Spiritual" | "City";
  region: string;
  description: string;
  bestFor: string;
};

const mpDestinations: Destination[] = [
  { name: "Kanha National Park", category: "Wildlife", region: "Mandla", description: "One of MP's best-known tiger reserve landscapes with deep forest drives and rich wildlife viewing.", bestFor: "Safaris and forest stays" },
  { name: "Bandhavgarh National Park", category: "Wildlife", region: "Umaria", description: "A high-interest tiger reserve known for dramatic sightings and strong safari appeal.", bestFor: "Short premium wildlife trips" },
  { name: "Pench National Park", category: "Wildlife", region: "Seoni", description: "Forest routes, wildlife drives, and a strong nature-focused circuit for MP travelers.", bestFor: "Safari-focused itineraries" },
  { name: "Pachmarhi", category: "Hills", region: "Narmadapuram", description: "MP's classic hill station with viewpoints, caves, waterfalls, and slower scenic pacing.", bestFor: "Hill retreats and nature breaks" },
  { name: "Khajuraho", category: "Heritage", region: "Chhatarpur", description: "Historic temple architecture and one of the most iconic cultural destinations in the state.", bestFor: "Heritage and architecture" },
  { name: "Orchha", category: "Heritage", region: "Niwari", description: "A heritage town of cenotaphs, palaces, and riverside history with a relaxed atmosphere.", bestFor: "Culture-led routes" },
  { name: "Gwalior", category: "Heritage", region: "Gwalior", description: "Fort architecture, old-city character, and one of MP's strongest historical stopovers.", bestFor: "Forts and city heritage" },
  { name: "Mandu", category: "Heritage", region: "Dhar", description: "Romantic ruins, elevated views, and a strong monsoon-season heritage destination.", bestFor: "Scenic heritage travel" },
  { name: "Bhedaghat", category: "Water", region: "Jabalpur", description: "Marble rocks, river views, and one of MP's most visual and memorable natural attractions.", bestFor: "Boat rides and river landscapes" },
  { name: "Dhuandhar Falls", category: "Water", region: "Jabalpur", description: "A dramatic falls stop that works well with the Bhedaghat circuit.", bestFor: "Waterfront sightseeing" },
  { name: "Omkareshwar", category: "Spiritual", region: "Khandwa", description: "A sacred island destination with temple routes and riverfront atmosphere.", bestFor: "Spiritual travel" },
  { name: "Ujjain", category: "Spiritual", region: "Ujjain", description: "A major pilgrimage city and one of the strongest spiritual circuits in MP.", bestFor: "Temple and ritual routes" },
  { name: "Maheshwar", category: "Spiritual", region: "Khargone", description: "A quieter heritage-spiritual destination with ghats, weaving traditions, and river views.", bestFor: "Slow riverside stays" },
  { name: "Bhimbetka", category: "Heritage", region: "Raisen", description: "Historic rock shelters and a strong stop for prehistory and cultural depth.", bestFor: "History and archaeology" },
  { name: "Sanchi", category: "Heritage", region: "Raisen", description: "A landmark Buddhist heritage site that fits well into central MP routes.", bestFor: "Cultural day trips" },
  { name: "Bhopal", category: "City", region: "Bhopal", description: "The state capital with lakes, museums, and a strong position for route planning.", bestFor: "City base and regional access" },
  { name: "Indore", category: "City", region: "Indore", description: "A major city base for food, mobility, and access to western MP circuits.", bestFor: "Urban base and food stops" },
  { name: "Tamia", category: "Hills", region: "Chhindwara", description: "A quieter highland destination for travelers who want scenic views beyond the usual circuit.", bestFor: "Offbeat hill travel" },
];


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

function DestinationExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Destination>(mpDestinations[0]);

  const categories = ["All", "Wildlife", "Heritage", "Water", "Hills", "Spiritual", "City"];

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return mpDestinations.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.region.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.bestFor.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [query, category]);

  useEffect(() => {
    if (filtered.length > 0) {
      setSelected(filtered[0]);
    }
  }, [filtered]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Explore All Places</p>
            <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">Search Madhya Pradesh from one dashboard list.</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This is the core explorer structure for the platform. Later you can attach all your images, richer details, and live Google Maps behavior on top of this same data flow.
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{filtered.length}</span> places available in the current search
          </div>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3 rounded-[1.4rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400">
                <path d="M21 21l-4.35-4.35M10.8 18a7.2 7.2 0 100-14.4 7.2 7.2 0 000 14.4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Kanha, Khajuraho, waterfalls, hill stations..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    category === item
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5 grid max-h-[620px] gap-3 overflow-y-auto pr-1">
              {filtered.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelected(item)}
                  className={`rounded-[1.4rem] border p-4 text-left transition ${
                    selected.name === item.name
                      ? "border-slate-950 bg-slate-950 text-white shadow-[0_16px_32px_rgba(15,23,42,0.16)]"
                      : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold">{item.name}</p>
                      <p className={`mt-2 text-xs uppercase tracking-[0.22em] ${selected.name === item.name ? "text-white/60" : "text-slate-400"}`}>
                        {item.category} • {item.region}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${selected.name === item.name ? "bg-white/10 text-white/80" : "bg-emerald-50 text-emerald-700"}`}>
                      {item.bestFor}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${selected.name === item.name ? "text-white/75" : "text-slate-600"}`}>
                    {item.description}
                  </p>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  No destinations matched your search. Try another place name or category.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(160deg,rgba(16,185,129,0.14),rgba(14,165,233,0.1))] p-6 shadow-[0_18px_60px_rgba(148,163,184,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800">Selected destination</p>
              <h2 className="mt-3 font-display text-3xl text-slate-900">{selected.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{selected.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/75 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Category</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selected.category}</p>
                </div>
                <div className="rounded-2xl bg-white/75 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Region</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selected.region}</p>
                </div>
                <div className="rounded-2xl bg-white/75 p-4 sm:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Best for</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selected.bestFor}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-slate-200 bg-white/85 p-6 shadow-[0_18px_60px_rgba(148,163,184,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Google Map Integration</p>
              <h3 className="mt-3 font-display text-3xl text-slate-900">Ready placeholder for the live map.</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                We can connect the Google Map here later so clicking any place from the list opens its marker, route context, and nearby suggestions.
              </p>

              <div className="mt-5 rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selected.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">{selected.region} • {selected.category}</p>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Map target
                  </span>
                </div>

                <div className="mt-5 flex h-64 items-center justify-center rounded-[1.3rem] bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-center text-slate-300">
                  <div className="max-w-xs">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mx-auto text-emerald-300">
                      <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11zM12 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-4 text-sm font-semibold text-white">Google Map will sit here</p>
                    <p className="mt-2 text-xs leading-6 text-slate-400">
                      Live markers, search sync, and nearby discovery can be connected after the API setup.
                    </p>
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




const categoryColors: Record<string, string> = {
  Wildlife: "#10b981",
  Heritage: "#f59e0b",
  Water: "#0ea5e9",
  Hills: "#6366f1",
  Spiritual: "#ec4899",
  City: "#64748b",
};

function DestinationCategory({
  category,
  title,
  desc,
  extraCategory,
}: {
  category: Destination["category"];
  title: string;
  desc: string;
  extraCategory?: Destination["category"];
}) {
  const [selected, setSelected] = useState<Destination | null>(null);

  const items = useMemo(
    () => mpDestinations.filter((d) => d.category === category || (extraCategory && d.category === extraCategory)),
    [category, extraCategory]
  );

  const color = categoryColors[category] ?? "#10b981";

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color }}>{category}{extraCategory ? ` & ${extraCategory}` : ""}</p>
            <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">{desc}</p>
          </div>
          <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{items.length}</span> destinations
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelected(selected?.name === item.name ? null : item)}
              className={`rounded-[1.6rem] border p-5 text-left transition ${
                selected?.name === item.name
                  ? "border-slate-950 bg-slate-950 text-white shadow-[0_16px_32px_rgba(15,23,42,0.18)]"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(148,163,184,0.14)]"
              }`}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              </div>
              <p className="text-base font-semibold">{item.name}</p>
              <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${selected?.name === item.name ? "text-white/55" : "text-slate-400"}`}>
                {item.region}
              </p>
              <p className={`mt-3 text-sm leading-6 ${selected?.name === item.name ? "text-white/75" : "text-slate-600"}`}>
                {item.description}
              </p>
              <span className={`mt-4 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${selected?.name === item.name ? "bg-white/10 text-white/80" : "bg-slate-50 text-slate-500 border border-slate-200"}`}>
                {item.bestFor}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-8 rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(160deg,rgba(16,185,129,0.10),rgba(14,165,233,0.07))] p-6 shadow-[0_18px_60px_rgba(148,163,184,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800">Selected</p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">{selected.name}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/80 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Category</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selected.category}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Region</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selected.region}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Best for</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{selected.bestFor}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function DestinationMapPage() {
  const [selected, setSelected] = useState<Destination>(mpDestinations[0]);
  const [category, setCategory] = useState("All");

  const categories = ["All", "Wildlife", "Heritage", "Water", "Hills", "Spiritual", "City"];

  const filtered = useMemo(
    () => mpDestinations.filter((d) => category === "All" || d.category === category),
    [category]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Destination Map</p>
        <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">All MP destinations on one map.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Filter by category, pick a destination from the list, and see it pinpointed. Google Maps integration connects here after API setup.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                category === c ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
          <div className="max-h-[540px] overflow-y-auto space-y-2 pr-1">
            {filtered.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelected(item)}
                className={`w-full rounded-[1.3rem] border p-4 text-left transition ${
                  selected.name === item.name
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                }`}
              >
                <p className="text-sm font-semibold">{item.name}</p>
                <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${selected.name === item.name ? "text-white/55" : "text-slate-400"}`}>
                  {item.category} • {item.region}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-base font-semibold text-slate-900">{selected.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">{selected.region} • {selected.category}</p>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                Map target
              </span>
            </div>
            <div className="flex h-[420px] items-center justify-center rounded-[1.3rem] bg-[linear-gradient(160deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92))] text-center text-slate-300">
              <div className="max-w-xs">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto text-emerald-300">
                  <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11zM12 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-4 text-sm font-semibold text-white">{selected.name}</p>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Google Maps live marker will appear here after API integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const STYLE_OPTIONS = ["Adventure Seeker", "Culture Explorer", "Nature Lover", "Luxury Traveler"];
const DURATION_OPTIONS = ["Weekend", "Short Trip", "Week+", "Long Journey"];
const BUDGET_OPTIONS = ["Budget", "Mid Range", "Premium", "Luxury"];
const GROUP_OPTIONS = ["Solo", "2 People", "3 to 5", "6 to 10", "10+"];
const PROFESSION_OPTIONS = ["Business Professional", "Student", "Photographer", "Doctor / Healthcare", "Teacher / Academic", "Artist / Creative", "Government / Defence", "Entrepreneur"];
const INTEREST_OPTIONS = ["Wildlife Safaris", "Heritage Temples", "River & Waterfalls", "Hill Stations", "Local Cuisine", "Photography", "Camping", "Boat Rides", "Ayurveda & Wellness", "Bird Watching", "Night Sky & Stars", "Local Markets"];

function MyProfile({
  profile,
  onSave,
  onOpenModal,
}: {
  profile: Profile | null;
  onSave: (p: Profile) => void;
  onOpenModal: () => void;
}) {
  const empty: Profile = { name: "", profession: "", style: "", duration: "", budget: "", groupSize: "", interests: [] };
  const [form, setForm] = useState<Profile>(profile ?? empty);
  const [saved, setSaved] = useState(false);

  function set(field: keyof Profile, value: string | string[]) {
    setSaved(false);
    setForm((p) => ({ ...p, [field]: value }));
  }

  function toggleInterest(label: string) {
    setSaved(false);
    setForm((p) => ({
      ...p,
      interests: p.interests.includes(label) ? p.interests.filter((i) => i !== label) : [...p.interests, label],
    }));
  }

  function handleSave() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
        active
          ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.28)]"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">My Profile</p>
            <h1 className="mt-2 font-display text-4xl text-slate-900">Your travel identity.</h1>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Fill this manually or use the AI setup wizard. All fields shape your AI trip recommendations.
            </p>
          </div>
          <button
            onClick={onOpenModal}
            className="shrink-0 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open AI Setup Wizard
          </button>
        </div>
      </section>

      {/* Name & Profession */}
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_24px_80px_rgba(148,163,184,0.12)] backdrop-blur-xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Basic Info</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Your Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Profession</label>
            <div className="flex flex-wrap gap-2">
              {PROFESSION_OPTIONS.map((o) => (
                <Chip key={o} label={o} active={form.profession === o} onClick={() => set("profession", o)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Travel Style & Duration */}
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_24px_80px_rgba(148,163,184,0.12)] backdrop-blur-xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Travel Preferences</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Travel Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((o) => (
                <Chip key={o} label={o} active={form.style === o} onClick={() => set("style", o)} />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Trip Duration</label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((o) => (
                <Chip key={o} label={o} active={form.duration === o} onClick={() => set("duration", o)} />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Budget</label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map((o) => (
                <Chip key={o} label={o} active={form.budget === o} onClick={() => set("budget", o)} />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Group Size</label>
            <div className="flex flex-wrap gap-2">
              {GROUP_OPTIONS.map((o) => (
                <Chip key={o} label={o} active={form.groupSize === o} onClick={() => set("groupSize", o)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-7 shadow-[0_24px_80px_rgba(148,163,184,0.12)] backdrop-blur-xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Interests</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((o) => (
            <Chip key={o} label={o} active={form.interests.includes(o)} onClick={() => toggleInterest(o)} />
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4 pb-4">
        <button
          onClick={handleSave}
          className="rounded-full bg-[linear-gradient(135deg,#10b981,#059669)] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(16,185,129,0.28)] transition hover:brightness-110"
        >
          Save Profile
        </button>
        {saved && (
          <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Profile saved
          </span>
        )}
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
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">AI Tourism Platform</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <a href="/" className="transition hover:text-slate-900">Home</a>
                  <span>/</span>
                  <span className="font-medium text-slate-900">Dashboard</span>
                </div>
              </div>

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
              <Route path="planner" element={<AiTripPlanner profile={profile} />} />
              <Route path="map" element={<InteractiveMap />} />
              <Route path="compass" element={<SmartCompass />} />
              <Route path="itinerary" element={<ComingSoon title="Itinerary Builder" />} />
              <Route path="budget" element={<AiBudgetPlanner />} />
              <Route path="destinations" element={<DestinationExplorer />} />
              <Route path="dest-wildlife" element={<DestinationCategory category="Wildlife" title="Wildlife Sanctuaries & Tiger Reserves" desc="Safaris, forest drives, and the best wildlife circuits in Madhya Pradesh." />} />
              <Route path="dest-heritage" element={<DestinationCategory category="Heritage" title="Heritage & History" desc="Temples, forts, ruins, and the cultural depth of MP's most storied destinations." />} />
              <Route path="dest-nature" element={<DestinationCategory category="Hills" title="Nature & Hill Stations" desc="Scenic highlands, waterfalls, and peaceful retreats across MP." extraCategory="Water" />} />
              <Route path="dest-spiritual" element={<DestinationCategory category="Spiritual" title="Spiritual Destinations" desc="Pilgrimage cities, sacred ghats, and temple routes through Madhya Pradesh." />} />
              <Route path="dest-map" element={<DestinationMapPage />} />
              <Route path="hotels" element={<ComingSoon title="Hotels & Stays" />} />
              <Route path="routes" element={<AiRouteOptimizer />} />
              <Route path="weather" element={<SmartAnalyzer />} />
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
