import { NavLink } from "react-router-dom";

const navItems = [
  {
    group: "Overview",
    items: [
      { path: "home", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ],
  },
  {
    group: "AI Planners",
    items: [
      { path: "planner", label: "AI Trip Planner", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
      { path: "budget", label: "AI Budget Planner", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
      { path: "itinerary", label: "AI Itinerary Builder", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
      { path: "routes", label: "AI Route Optimizer", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
    ],
  },
  {
    group: "Smart Tools",
    items: [
      { path: "map", label: "Smart Atlas", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
      { path: "compass", label: "Smart Compass", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    ],
  },
  {
    group: "Destinations",
    items: [
      { path: "destinations", label: "All Destinations", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
      { path: "dest-wildlife", label: "Wildlife", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" },
      { path: "dest-heritage", label: "Heritage", icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" },
      { path: "dest-nature", label: "Nature & Hills", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
      { path: "dest-spiritual", label: "Spiritual", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
      { path: "dest-map", label: "Destination Map", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
    ],
  },
  {
    group: "Explore",
    items: [
      { path: "hotels", label: "Hotels & Stays", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { path: "routes", label: "Road Guide", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
      { path: "weather", label: "Best Time to Visit", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
    ],
  },
];

function dashboardPath(path: string) {
  return `/dashboard/${path}`;
}

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (updater: (prev: boolean) => boolean) => void;
}

export default function DashboardSidebar({ collapsed, setCollapsed }: DashboardSidebarProps) {
  return (
    <aside
      className="hidden shrink-0 border-r border-white/50 bg-white/65 backdrop-blur-xl lg:flex lg:flex-col sticky top-0 h-screen overflow-hidden"
      style={{ width: collapsed ? 88 : 290 }}
    >
      <div className="border-b border-slate-200/70 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">MP</div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display whitespace-nowrap text-xl leading-none text-slate-900">MP Tourism</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-400">AI dashboard platform</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navItems.map((group) => (
          <div key={group.group} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {group.group}
              </p>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path.startsWith("/") ? item.path : dashboardPath(item.path)}
                end
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isActive
                    ? "bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d={item.icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200/70 p-4">
        <a
          href="/"
          className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {!collapsed && <span>Back to Home</span>}
        </a>
      </div>
    </aside>
  );
}
