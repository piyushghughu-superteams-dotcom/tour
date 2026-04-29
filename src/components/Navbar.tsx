import { useEffect, useRef, useState } from "react";

const words = ["Curated journeys", "AI-powered routes", "Smart itineraries", "Curated journeys"];

export default function Navbar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const [subText, setSubText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [cursor, setCursor] = useState(true);

  // Typewriter
  useEffect(() => {
    const target = words[wordIdx];
    const delay = deleting ? 40 : charIdx === target.length ? 1800 : 65;
    const t = setTimeout(() => {
      if (!deleting && charIdx < target.length) {
        setSubText(target.slice(0, charIdx + 1));
        setCharIdx((p) => p + 1);
      } else if (!deleting && charIdx === target.length) {
        setDeleting(true);
      } else if (deleting && charIdx > 0) {
        setSubText(target.slice(0, charIdx - 1));
        setCharIdx((p) => p - 1);
      } else {
        setDeleting(false);
        setWordIdx((p) => (p + 1) % (words.length - 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursor((p) => !p), 530);
    return () => clearInterval(t);
  }, []);

  // Animated shimmer border canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    function resize() {
      const el = canvas!.parentElement!;
      canvas!.width = el.offsetWidth;
      canvas!.height = el.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    function draw() {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx.clearRect(0, 0, W, H);

      const r = H / 2; // border-radius matches pill shape
      const perimeter = 2 * (W - 2 * r) + 2 * Math.PI * r;

      // Draw glowing dot that travels around the border
      const positions = [t % 1, (t + 0.33) % 1, (t + 0.66) % 1];
      const colors = [
        "rgba(16,185,129,1)",
        "rgba(99,102,241,0.9)",
        "rgba(243,199,107,0.95)",
      ];

      positions.forEach((pos, idx) => {
        const dist = pos * perimeter;
        const { x, y, angle } = pointOnPill(dist, W, H, r);

        // Glow trail
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 28);
        grad.addColorStop(0, colors[idx]);
        grad.addColorStop(0.4, colors[idx].replace("1)", "0.3)").replace("0.9)", "0.25)").replace("0.95)", "0.28)"));
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Bright core dot
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors[idx];
        ctx.fill();

        void angle;
      });

      t += 0.0012;
      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto mt-4 w-[min(1200px,calc(100%-1.5rem))]">
        {/* Animated border canvas — sits behind the pill */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ zIndex: 0 }}
        />

        {/* Pill content */}
        <div className="relative flex items-center justify-between rounded-full border border-white/30 bg-white/80 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl md:px-8" style={{ zIndex: 1 }}>
          <a href="#home" className="flex items-center gap-3" style={{ minWidth: 0 }}>
            {/* Logo with subtle AI pulse ring */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" style={{ animationDuration: "2.4s" }} />
              <span className="absolute inset-[-3px] rounded-full border border-emerald-400/30 animate-pulse" style={{ animationDuration: "2s" }} />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                MP
              </div>
            </div>

            {/* Fixed-width block so typewriter never shifts siblings */}
            <div style={{ width: 160 }}>
              <p className="font-display text-xl leading-none">MP Tourism</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500" style={{ whiteSpace: "nowrap" }}>
                {subText}
                <span
                  className="inline-block w-[1px] h-[0.7em] bg-emerald-500 align-middle ml-[1px] translate-y-[-1px]"
                  style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
                />
              </p>
            </div>
          </a>

          {/* Nav links — same as before */}
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            {[
              { label: "Home", href: "#home" },
              { label: "Categories", href: "#categories" },
              { label: "Why Visit", href: "#visit" },
              { label: "AI Planner", href: "/dashboard/planner" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative transition hover:text-emerald-700 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M2.93 11.07l1.41-1.41M9.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Start Exploring
          </a>
        </div>
      </div>
    </nav>
  );
}

// Helper: given distance along pill perimeter, return x/y/angle
function pointOnPill(dist: number, W: number, H: number, r: number) {
  const straightH = H - 2 * r;
  const straightW = W - 2 * r;
  const topLen = straightW;
  const rightArcLen = Math.PI * r;
  const bottomLen = straightW;

  if (dist < topLen) {
    return { x: r + dist, y: 0, angle: 0 };
  }
  dist -= topLen;
  if (dist < rightArcLen) {
    const a = -Math.PI / 2 + (dist / r);
    return { x: W - r + Math.cos(a) * r, y: r + straightH / 2 + Math.sin(a) * r, angle: a };
  }
  dist -= rightArcLen;
  if (dist < bottomLen) {
    return { x: W - r - dist, y: H, angle: Math.PI };
  }
  dist -= bottomLen;
  const a = Math.PI / 2 + (dist / r);
  return { x: r + Math.cos(a) * r, y: r + straightH / 2 + Math.sin(a) * r, angle: a };
}
