function Footer() {
  return (
    <footer className="mt-10 bg-slate-950 px-4 py-20 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:grid-cols-4 md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              MP Tourism
            </p>
            <h2 className="mt-4 font-display text-3xl">Journeys shaped around the real character of the state.</h2>
            <p className="mt-4 max-w-xs text-sm leading-7 text-slate-300">
              Built to present wildlife, heritage, and nature-led travel in a cleaner,
              more believable way, with AI added where it genuinely helps.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Categories
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Wildlife Safaris</p>
              <p>Heritage & Temples</p>
              <p>Water Escapes</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Travel Focus
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Short Itinerary Ideas</p>
              <p>Destination Discovery</p>
              <p>AI Route Support</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Experience
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Destination-led storytelling</p>
              <p>Real category imagery</p>
              <p>Clean next-step navigation</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MP Tourism. A stronger tourism-first homepage.</p>
          <p>Next step: destination detail pages and route planning flow.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
