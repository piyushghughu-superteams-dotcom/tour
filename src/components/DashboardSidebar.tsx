import { NavLink } from "react-router-dom";

const navItems = [
  {
    group: "Overview",
    items: [
      { path: "home", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ],
  },
  {
    group: "AI Chat",
    items: [
      { path: "chat", label: "AI Chat", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
    ],
  },
  {
    group: "AI Planners",
    items: [
      { path: "planner", label: "AI Trip Planner", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
      { path: "budget", label: "AI Budget Planner", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
      { path: "routes", label: "AI Route Optimizer", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
      { path: "hotels", label: "AI Stay Planner", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    ],
  },
  {
    group: "Smart Tools",
    items: [
      { path: "map", label: "Smart Atlas", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
      { path: "compass", label: "Smart Compass", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
      { path: "weather", label: "Smart Analyzer", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
    ],
  },
  {
    group: "Destinations",
    items: [
      { path: "destinations", label: "All Destinations", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
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
      className="hidden shrink-0 border-r border-white/50 bg-white/65 backdrop-blur-xl lg:flex lg:flex-col sticky top-0 h-screen overflow-visible relative"
      style={{ width: collapsed ? 88 : 290 }}
    >
      <div className="border-b border-slate-200/70 px-4 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-700"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            MP
          </button>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display whitespace-nowrap text-lg leading-none text-slate-900">MP Tourism</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-400">AI dashboard platform</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
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
