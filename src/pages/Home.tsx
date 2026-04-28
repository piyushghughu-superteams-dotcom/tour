import Footer from "../components/Footer/Footer";

const highlights = [
  { value: "12", label: "National parks and reserves" },
  { value: "4", label: "Signature travel themes" },
  { value: "7+", label: "Strong short-trip circuits" },
  { value: "AI", label: "Planner support when needed" },
];

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

const quickJourneys = [
  {
    title: "For first-time visitors",
    detail: "Mix wildlife, one heritage stop, and a calm river experience in a balanced 5 to 7 day journey.",
  },
  {
    title: "For culture-focused trips",
    detail: "Build around temples, architecture, local stories, and slower stays in historical towns.",
  },
  {
    title: "For nature weekends",
    detail: "Choose a shorter route around forests, viewpoints, and water landscapes with easy pacing.",
  },
];

const plannerPoints = [
  "Suggest routes based on your days, budget, and interests",
  "Combine wildlife, culture, and nature without overplanning",
  "Surface practical trip ideas instead of generic inspiration",
];

function Home() {
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

      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-slate-950 px-4 pb-16 pt-32 md:px-8"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full scale-[1.03] object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.35),rgba(2,6,23,0.8)),linear-gradient(90deg,rgba(15,23,42,0.68),rgba(15,23,42,0.22)_48%,rgba(15,23,42,0.55)),radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_28%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl items-end gap-12 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="max-w-4xl pt-10 text-white">
            <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/85 backdrop-blur-xl">
              Real journeys through Madhya Pradesh
            </div>

            <h1 className="font-display text-5xl leading-[0.94] sm:text-6xl md:text-7xl lg:text-[5.35rem]">
              Discover forests, heritage towns, and riverside landscapes in one state.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              Madhya Pradesh brings together tiger reserves, historic architecture,
              sacred places, and quiet natural escapes. This homepage is now shaped
              around real travel categories so it feels closer to an actual tourism brand.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#categories"
                className="rounded-full bg-[var(--color-gold)] px-7 py-4 text-center text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                Explore Categories
              </a>
              <a
                href="#planner"
                className="rounded-full border border-white/25 bg-white/10 px-7 py-4 text-center text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/16"
              >
                Use AI Trip Planner
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl"
                >
                  <p className="font-display text-3xl text-[var(--color-gold)]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Suggested Route
              </p>
              <h2 className="mt-4 font-display text-3xl">
                6 days across wildlife, heritage, and river views
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-200">
                A good first MP itinerary can begin with a safari circuit, continue into
                temple or fort architecture, and end with a quieter nature stop.
              </p>

              <div className="mt-6 space-y-3">
                {quickJourneys.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              I used your real image folders to build the core homepage categories:
              jungle, heritage, water escapes, and hill stations. This makes the section
              feel more authentic and much easier to expand later.
            </p>
          </div>

          <div className="mt-12 grid auto-rows-[minmax(240px,auto)] gap-6 md:grid-cols-4">
            {categories.map((category) => (
              <article
                key={category.title}
                className={`group relative overflow-hidden rounded-[2rem] ${category.className}`}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.78))]" />
                <div className="relative flex h-full flex-col justify-end p-7 text-white shadow-[0_22px_70px_rgba(15,23,42,0.18)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/75">
                    {category.meta}
                  </p>
                  <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                    {category.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-white/85">
                    {category.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-[var(--color-gold)]">
                    {category.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
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
