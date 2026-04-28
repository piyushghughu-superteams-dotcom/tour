import { useEffect } from "react";

const galleryImages: Record<string, string[]> = {
  "Wildlife Safaris": [
    "/images/jungle/one.jpg",
    "/images/jungle/two.jpg",
    "/images/jungle/three.jpg",
    "/images/jungle/four.jpg",
    "/images/jungle/five.jpg",
    "/images/jungle/six.jpg",
    "/images/jungle/seven.jpg",
    "/images/jungle/eight.jpg",
    "/images/jungle/nine.jpg",
  ],
  "Heritage & Temples": [
    "/images/History/one.jpg",
    "/images/History/two.jpg",
    "/images/History/three.jpg",
    "/images/History/four.jpg",
    "/images/History/five.jpg",
    "/images/History/six.jpg",
    "/images/History/seven.jpg",
    "/images/History/eight.jpg",
  ],
  "Water Escapes": [
    "/images/waterplaces/one.jpg",
    "/images/waterplaces/two.jpg",
    "/images/waterplaces/three.jpg",
    "/images/waterplaces/four.jpg",
    "/images/waterplaces/five.jpg",
  ],
  "Hill Stations": [
    "/images/hills/one.jpg",
    "/images/hills/two.jpg",
    "/images/hills/three.jpeg",
    "/images/hills/four.jpg",
    "/images/hills/five.jpg",
    "/images/hills/six.jpg",
  ],
};

interface Props {
  category: string;
  onClose: () => void;
}

export default function CategoryGallery({ category, onClose }: Props) {
  const images = galleryImages[category] ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "rgba(8,12,16,0.96)", backdropFilter: "blur(12px)" }}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5 md:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Photo Gallery
          </p>
          <h2 className="font-display text-2xl text-white md:text-3xl">{category}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-white/40 hover:text-white"
          aria-label="Close gallery"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Photo grid */}
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((src, i) => (
            <div
              key={src}
              className="group overflow-hidden rounded-2xl"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={src}
                alt={`${category} ${i + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
