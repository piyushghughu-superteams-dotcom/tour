const links = {
  Explore: ["Wildlife Safaris", "Heritage & Temples", "Water Escapes", "Hill Stations"],
  Plan: ["AI Trip Planner", "Road Guide", "Hotels & Stays", "Interactive Map"],
  Company: ["About MP Tourism", "How It Works", "Contact Us", "Privacy Policy"],
};

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Top decorative strip */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(243,199,107,0.4), transparent)" }} />

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f3c76b, transparent 70%)" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8 md:px-10">
        {/* Main grid */}
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">MP</div>
              <div>
                <p className="font-display text-lg leading-none text-white">MP Tourism</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500 mt-0.5">Curated journeys</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-400 max-w-xs">
              Forests, heritage towns, sacred rivers, and cool hill escapes — Madhya Pradesh, planned smarter with AI.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608C4.523 2.567 5.79 2.29 7.156 2.228 8.422 2.17 8.802 2.163 12 2.163zm0-2.163c-3.259 0-3.667.014-4.947.072C5.67.163 4.198.538 2.95 1.787 1.702 3.035 1.327 4.507.937 5.89.014 8.422 0 8.83 0 12c0 3.17.014 3.578.072 4.947.39 1.383.765 2.855 2.013 4.103 1.248 1.248 2.72 1.623 4.103 2.013C8.422 23.986 8.83 24 12 24c3.17 0 3.578-.014 4.947-.072 1.383-.39 2.855-.765 4.103-2.013 1.248-1.248 1.623-2.72 2.013-4.103C23.986 15.578 24 15.17 24 12c0-3.17-.014-3.578-.072-4.947-.39-1.383-.765-2.855-2.013-4.103C20.667.538 19.195.163 17.812.072 15.578.014 15.17 0 12 0z M12 5.838a6.162 6.162 0 100 12.324A6.162 6.162 0 0012 5.838zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "Twitter", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                { label: "YouTube", path: "M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-white/30 hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/50 mb-5">{title}</p>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 transition hover:text-white hover:pl-1 inline-block" style={{ transition: "all 0.2s ease" }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div className="mt-14 rounded-2xl p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p className="text-sm font-semibold text-white">Get MP travel ideas in your inbox</p>
            <p className="text-xs text-slate-500 mt-1">Routes, seasonal picks, and AI-curated itineraries.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <input
              type="email"
              placeholder="your@email.com"
              className="rounded-full px-4 py-2.5 text-xs text-slate-800 outline-none w-52"
              style={{ background: "rgba(255,255,255,0.92)" }}
            />
            <button className="rounded-full px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:brightness-110"
              style={{ background: "var(--color-gold)" }}>
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-8 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 MP Tourism. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p>Built with AI · Madhya Pradesh, India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
