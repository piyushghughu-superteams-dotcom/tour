import { useState } from "react";
import Footer from "../components/Footer/Footer";


const categories = [
  {
    title: "Wildlife Safaris",
    subtitle: "Forest drives and tiger country",
    description:
      "Explore the jungle circuits that make Madhya Pradesh one of India's most memorable wildlife destinations.",
    image: "/images/jungle/one.jpg",
    className: "md:col-span-2 md:row-span-2 min-h-[460px]",
    meta: "Kanha • Bandhavgarh • Pench",
  },
  {
    title: "Heritage & Temples",
    subtitle: "Architecture, sculpture, living history",
    description:
      "From carved temples to old forts and palace towns, this side of MP feels timeless and deeply rooted.",
    image: "/images/History/one.jpg",
    className: "min-h-[280px]",
    meta: "Khajuraho • Orchha • Gwalior",
  },
  {
    title: "Water Escapes",
    subtitle: "Rivers, rocks and quiet landscapes",
    description:
      "Slow down with scenic river views, rocky gorges, seasonal waterfalls and calm nature-led experiences.",
    image: "/images/waterplaces/one.jpg",
    className: "min-h-[280px]",
    meta: "Bhedaghat • Waterfalls • Riverfronts",
  },
  {
    title: "Hill Stations",
    subtitle: "Cool air, viewpoints and slower days",
    description:
      "Bring in green valleys, layered hill views, and peaceful stays for travelers looking for a softer pace.",
    image: "/images/hills/one.jpg",
    className: "md:col-span-2 min-h-[300px]",
    meta: "Pachmarhi • Scenic drives • Valley views",
  },
];


const plannerPoints = [
  "Suggest routes based on your days, budget, and interests",
  "Combine wildlife, culture, and nature without overplanning",
  "Surface practical trip ideas instead of generic inspiration",
];

const galleryImages: Record<string, string[]> = {
  "Wildlife Safaris": [
    "/images/jungle/one.jpg","/images/jungle/two.jpg","/images/jungle/three.jpg",
    "/images/jungle/four.jpg","/images/jungle/five.jpg","/images/jungle/six.jpg",
    "/images/jungle/seven.jpg","/images/jungle/eight.jpg","/images/jungle/nine.jpg",
  ],
  "Heritage & Temples": [
    "/images/History/one.jpg","/images/History/two.jpg","/images/History/three.jpg",
    "/images/History/four.jpg","/images/History/five.jpg","/images/History/six.jpg",
    "/images/History/seven.jpg","/images/History/eight.jpg",
  ],
  "Water Escapes": [
    "/images/waterplaces/one.jpg","/images/waterplaces/two.jpg","/images/waterplaces/three.jpg",
    "/images/waterplaces/four.jpg","/images/waterplaces/five.jpg",
  ],
  "Hill Stations": [
    "/images/hills/one.jpg","/images/hills/two.jpg","/images/hills/three.jpeg",
    "/images/hills/four.jpg","/images/hills/five.jpg","/images/hills/six.jpg",
  ],
};

function Home() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-[var(--color-cream)] text-slate-950">
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-4 flex w-[min(1200px,calc(100%-1.5rem))] items-center justify-between rounded-full border border-white/35 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl md:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
              MP
            </div>
            <div>
              <p className="font-display text-xl leading-none">MP Tourism</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                Curated journeys
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <a href="#home" className="transition hover:text-emerald-700">
              Home
            </a>
            <a href="#categories" className="transition hover:text-emerald-700">
              Categories
            </a>
            <a href="#visit" className="transition hover:text-emerald-700">
              Why Visit
            </a>
            <a href="#planner" className="transition hover:text-emerald-700">
              AI Planner
            </a>
          </div>

          <a
            href="#categories"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Start Exploring
          </a>
        </div>
      </nav>

      <section id="home" className="relative min-h-screen overflow-hidden">
        {/* Hero image — Bhedaghat river gorge */}
        <img
          src="/images/waterplaces/two.jpg"
          alt="Madhya Pradesh landscape"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Gradient overlay — dark left, lighter right, fades to dark bottom */}
        <div className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(5,12,18,0.82) 0%, rgba(5,12,18,0.55) 50%, rgba(5,12,18,0.35) 100%), linear-gradient(180deg, rgba(5,12,18,0.2) 0%, rgba(5,12,18,0.0) 40%, rgba(5,12,18,0.75) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative flex min-h-screen flex-col px-6 pt-40 pb-20 md:px-12 lg:px-20">
          <div className="mt-auto max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--color-gold)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
                Madhya Pradesh, India
              </span>
            </div>

            <h1 className="font-display text-5xl leading-[1.02] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.96]">
              Where forests,<br />
              temples &amp; rivers<br />
              meet.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/70 md:text-lg">
              Tiger reserves, carved monuments, marble gorges, and cool hill retreats —
              Madhya Pradesh packs more variety than any single trip can hold.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#categories"
                className="rounded-full bg-[var(--color-gold)] px-8 py-4 text-sm font-semibold text-slate-950 shadow-[0_8px_32px_rgba(243,199,107,0.4)] transition hover:brightness-110"
              >
                Explore MP
              </a>
              <a
                href="#planner"
                className="rounded-full border border-white/25 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/18"
              >
                Plan My Trip
              </a>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-6 w-px bg-white/25" />
        </div>
      </section>

      <section id="categories" className="px-4 py-18 md:px-8 md:py-22">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
                Travel Categories
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                Start with the experiences people actually come to MP for.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 md:text-base">
              Four distinct experiences — jungle safaris, ancient monuments, river gorges,
              and cool hill retreats — each worth a journey on its own, even better combined.
            </p>
          </div>

          {/* Expanded gallery view */}
          {expanded ? (
            <div className="mt-12">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                    {categories.find((c) => c.title === expanded)?.meta}
                  </p>
                  <h3 className="font-display text-3xl">{expanded}</h3>
                </div>
                <button
                  onClick={() => setExpanded(null)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {galleryImages[expanded].map((src, i) => (
                  <div key={src} className="group overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={src}
                      alt={`${expanded} ${i + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
          <div className="mt-12 grid auto-rows-[minmax(240px,auto)] gap-6 md:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.title}
                onClick={() => setExpanded(category.title)}
                className={`group relative cursor-pointer overflow-hidden rounded-[2rem] ${category.className}`}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.78))] transition duration-300 group-hover:bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.88))]" />
                <div className="relative flex h-full flex-col justify-end p-7 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/75">
                    {category.meta}
                  </p>
                  <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                    {category.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/85">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--color-gold)]">
                      {category.subtitle}
                    </p>
                    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">
                      View photos
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>

      <section id="visit" className="px-4 py-8 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(148,163,184,0.16)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Why Visit
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              A state that feels varied without feeling overwhelming.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              Madhya Pradesh works well for travelers who want more than one kind of
              experience in the same trip. You can move from wildlife to history to calm
              natural scenery without the journey feeling disconnected.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(148,163,184,0.16)]">
              <h3 className="font-display text-2xl">Wildlife Depth</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                MP stands out for safari travel, forest lodges, and the feeling of being
                close to truly large landscapes.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(148,163,184,0.16)]">
              <h3 className="font-display text-2xl">Historic Character</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Temples, forts, and old towns give the journey cultural weight instead of
                making it only nature-led.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(148,163,184,0.16)]">
              <h3 className="font-display text-2xl">Slower Scenic Stops</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                River views, gorges, and waterfalls give breathing room between bigger
                destinations and busier routes.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(160deg,rgba(16,185,129,0.14),rgba(14,165,233,0.1))] p-7 shadow-[0_18px_60px_rgba(148,163,184,0.16)]">
              <h3 className="font-display text-2xl">Easy to Personalize</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                That mix is exactly where AI can help later, by shaping a route around
                your pace instead of pushing the same itinerary to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="planner" className="px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src="/images/History/two.jpg"
              alt="Historic architecture in Madhya Pradesh"
              className="h-full min-h-[420px] w-full object-cover"
            />
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.26)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              AI Trip Planner
            </p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Keep AI as a helpful layer, not the whole story.
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
              The homepage should first sell the destination itself. AI becomes useful
              after interest is created, by helping visitors turn broad inspiration into a
              practical route.
            </p>

            <div className="mt-8 space-y-4">
              {plannerPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>

            <a
              href="#home"
              className="mt-8 inline-flex rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Plan a Smarter Route
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
