import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon paths
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const mapIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#10b981" stroke="white" stroke-width="2"/></svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

type Destination = {
  name: string;
  category: "Wildlife" | "Heritage" | "Water" | "Hills" | "Spiritual" | "City";
  region: string;
  description: string;
  bestFor: string;
  lat: number;
  lng: number;
  popularity: number;
};

const allDestinations: Destination[] = [
  { name: "Kanha National Park", category: "Wildlife", region: "Mandla", description: "Premier tiger reserve known for its dense sal forests and the conservation of the rare Barasingha.", bestFor: "Safaris and nature photography", lat: 22.3345, lng: 80.6115, popularity: 100 },
  { name: "Khajuraho Temples", category: "Heritage", region: "Chhatarpur", description: "UNESCO World Heritage site famous for its stunning nagara-style architecture and intricate erotic carvings.", bestFor: "History and architecture buffs", lat: 24.8318, lng: 79.9199, popularity: 98 },
  { name: "Mahakaleshwar Temple, Ujjain", category: "Spiritual", region: "Ujjain", description: "One of the twelve Jyotirlingas, this sacred temple on the Kshipra river is a major spiritual hub.", bestFor: "Pilgrimage and cultural rituals", lat: 23.1827, lng: 75.7682, popularity: 97 },
  { name: "Bandhavgarh National Park", category: "Wildlife", region: "Umaria", description: "Known for having the highest density of Royal Bengal Tigers in India, set against the backdrop of an ancient fort.", bestFor: "Tiger sightings and ancient history", lat: 23.7225, lng: 81.0245, popularity: 96 },
  { name: "Pachmarhi", category: "Hills", region: "Narmadapuram", description: "The only hill station in MP, offering waterfalls, caves, and scenic viewpoints in the Satpura range.", bestFor: "Nature lovers and trekkers", lat: 22.4674, lng: 78.4346, popularity: 95 },
  { name: "Gwalior Fort", category: "Heritage", region: "Gwalior", description: "Described as the 'pearl amongst fortresses in India', it houses palaces, temples, and historic monuments.", bestFor: "Fort exploration and history", lat: 26.2313, lng: 78.1695, popularity: 94 },
  { name: "Sanchi Stupa", category: "Heritage", region: "Raisen", description: "One of the oldest stone structures in India, a masterpiece of Buddhist architecture commissioned by Ashoka.", bestFor: "Buddhism and ancient art", lat: 23.4871, lng: 77.7397, popularity: 93 },
  { name: "Orchha", category: "Heritage", region: "Niwari", description: "A frozen-in-time town on the Betwa river, featuring majestic cenotaphs, palaces, and temples.", bestFor: "Photography and riverside peace", lat: 25.3503, lng: 78.6436, popularity: 92 },
  { name: "Bhedaghat Marble Rocks", category: "Water", region: "Jabalpur", description: "Stunning marble cliffs rising from the Narmada river, known for boat rides under the moonlight.", bestFor: "Boating and scenic views", lat: 23.1293, lng: 79.8021, popularity: 91 },
  { name: "Omkareshwar Temple", category: "Spiritual", region: "Khandwa", description: "A sacred island shaped like the 'Om' symbol, housing one of the twelve Jyotirlingas.", bestFor: "Island pilgrimage and river views", lat: 22.2458, lng: 76.1471, popularity: 90 },
  { name: "Mandu", category: "Heritage", region: "Dhar", description: "The 'City of Joy', famous for its Afghan architecture, romantic legends, and monsoon beauty.", bestFor: "Romantic getaways and ruins", lat: 22.3275, lng: 75.4057, popularity: 89 },
  { name: "Pench National Park", category: "Wildlife", region: "Seoni", description: "The inspiration for Kipling's 'The Jungle Book', a rich habitat for tigers, leopards, and wild dogs.", bestFor: "Wildlife safaris", lat: 21.6521, lng: 79.2274, popularity: 88 },
  { name: "Bhopal Upper Lake", category: "City", region: "Bhopal", description: "Asia's largest artificial lake, offering water sports and a serene escape in the capital city.", bestFor: "Boating and sunset views", lat: 23.2599, lng: 77.4126, popularity: 87 },
  { name: "Maheshwar", category: "Spiritual", region: "Khargone", description: "Known for its beautiful river ghats, the grand Ahilya Fort, and delicate Maheshwari saris.", bestFor: "Textiles and riverside spirituality", lat: 22.1764, lng: 75.5869, popularity: 86 },
  { name: "Bhimbetka Caves", category: "Heritage", region: "Raisen", description: "Rock shelters with paintings dating back to the Paleolithic age, showcasing early human life.", bestFor: "Archaeology and prehistory", lat: 22.9372, lng: 77.6126, popularity: 85 },
  { name: "Indore Rajwada", category: "City", region: "Indore", description: "A seven-story palace of the Holkars, a blend of Maratha and Mughal architecture in the heart of Indore.", bestFor: "City heritage and food (Sarafa)", lat: 22.7196, lng: 75.8577, popularity: 84 },
  { name: "Amarkantak", category: "Spiritual", region: "Anuppur", description: "The source of the Narmada, Son, and Johila rivers, a sacred pilgrimage site in the Maikal hills.", bestFor: "Riverside pilgrimage and nature", lat: 22.6775, lng: 81.7582, popularity: 83 },
  { name: "Panna National Park", category: "Wildlife", region: "Panna", description: "A unique landscape of diamond mines, gorges, and waterfalls, home to tigers and gharials.", bestFor: "Safaris and waterfalls", lat: 24.6468, lng: 79.9944, popularity: 82 },
  { name: "Satpura National Park", category: "Wildlife", region: "Narmadapuram", description: "Offers walking safaris, canoeing, and boat rides, providing a very different wildlife experience.", bestFor: "Walking safaris and birding", lat: 22.5028, lng: 78.1147, popularity: 81 },
  { name: "Chanderi", category: "Heritage", region: "Ashoknagar", description: "Historic town famous for its fort, Jain temples, and world-renowned hand-woven saris.", bestFor: "History and shopping", lat: 24.7169, lng: 78.1347, popularity: 80 },
  { name: "Burhanpur", category: "Heritage", region: "Burhanpur", description: "A historic city known as the 'Gateway to Southern India', home to the unique Shahi Qila.", bestFor: "Mughal history and water systems", lat: 21.3122, lng: 76.2239, popularity: 79 },
  { name: "Bhojpur Temple", category: "Spiritual", region: "Raisen", description: "Houses a massive 18ft tall Shiva Lingam, carved from a single rock, though the temple remains unfinished.", bestFor: "Architecture and religion", lat: 23.1009, lng: 77.5878, popularity: 78 },
  { name: "Chitrakoot", category: "Spiritual", region: "Satna", description: "A sacred town where Lord Rama is believed to have spent part of his exile.", bestFor: "Pilgrimage and mythology", lat: 25.1764, lng: 80.8654, popularity: 77 },
  { name: "Rewa White Tiger Safari", category: "Wildlife", region: "Rewa", description: "The land where white tigers were first discovered, now offering a dedicated safari park.", bestFor: "White tiger viewing", lat: 24.5362, lng: 81.3037, popularity: 76 },
  { name: "Mandsaur Pashupatinath", category: "Spiritual", region: "Mandsaur", description: "Unique temple housing a rare eight-faced Shiva Lingam on the banks of the Shivna river.", bestFor: "Rare idols and pilgrimage", lat: 24.0722, lng: 75.0683, popularity: 75 },
  { name: "Shivpuri (Madhav NP)", category: "Wildlife", region: "Shivpuri", description: "The former summer capital of Scindias, featuring hunting lodges and the George Castle.", bestFor: "Wildlife and colonial history", lat: 25.4294, lng: 77.6586, popularity: 74 },
  { name: "Datia Peeth", category: "Spiritual", region: "Datia", description: "Famous for the Pitambara Peeth, a powerful Shakti center and the seven-story Bir Singh Palace.", bestFor: "Spiritual power and architecture", lat: 25.6653, lng: 78.4609, popularity: 73 },
  { name: "Maihar Devi Temple", category: "Spiritual", region: "Satna", description: "Temple of Sharda Devi located on Trikuta hill, accessible via a long flight of stairs or ropeway.", bestFor: "Hilltop pilgrimage", lat: 24.2694, lng: 80.7558, popularity: 72 },
  { name: "Neemuch", category: "City", region: "Neemuch", description: "A major center for opium production and a historic cantonment town.", bestFor: "History and local industry", lat: 24.4764, lng: 74.8731, popularity: 71 },
  { name: "Ratlam (Cactus Garden)", category: "City", region: "Ratlam", description: "Famous for its unique Cactus Garden in Sailana and its spicy Ratlami Sev.", bestFor: "Food and botany", lat: 23.3315, lng: 75.0367, popularity: 70 },
  { name: "Dewas (Tekri)", category: "Spiritual", region: "Dewas", description: "Known for the Chamunda Devi temple located on a hill overlooking the city.", bestFor: "Hilltop views and worship", lat: 22.9626, lng: 76.0526, popularity: 69 },
  { name: "Jhabua (Tribal Art)", category: "City", region: "Jhabua", description: "Heart of the Bhil tribal culture, famous for its colorful markets and traditional art.", bestFor: "Tribal culture and crafts", lat: 22.7667, lng: 74.5833, popularity: 68 },
  { name: "Dhar Fort", category: "Heritage", region: "Dhar", description: "Historic fort built by Muhammad bin Tughlaq, showcasing the power of Malwa sultans.", bestFor: "Fort exploration", lat: 22.6012, lng: 75.2925, popularity: 67 },
  { name: "Sehore", category: "City", region: "Sehore", description: "Historic city near Bhopal with old temples and a major role in the 1857 mutiny.", bestFor: "Regional history", lat: 23.2031, lng: 77.0844, popularity: 66 },
  { name: "Patalkot Valley", category: "Hills", region: "Chhindwara", description: "A hidden valley so deep that sunlight only reaches the bottom for a few hours a day.", bestFor: "Offbeat trekking and tribes", lat: 22.4431, lng: 78.6924, popularity: 65 },
  { name: "Vidisha", category: "Heritage", region: "Vidisha", description: "Home to the Heliodorus Pillar and ancient rock-cut caves from the Gupta period.", bestFor: "Archaeology and ancient history", lat: 23.5239, lng: 77.8133, popularity: 64 },
  { name: "Tamia Hills", category: "Hills", region: "Chhindwara", description: "A hidden gem offering panoramic views of the Satpura range and a peaceful climate.", bestFor: "Quiet escapes and viewpoints", lat: 22.3456, lng: 78.6723, popularity: 63 },
  { name: "Kuno National Park", category: "Wildlife", region: "Sheopur", description: "The new home for Cheetahs in India, a pioneering conservation landscape.", bestFor: "Cheetah safaris and conservation", lat: 25.8458, lng: 77.1642, popularity: 62 },
  { name: "Sagar (Lakha Banjara Lake)", category: "City", region: "Sagar", description: "The heart of the city, famous for the historic lake and the Dr. Hari Singh Gour University.", bestFor: "City strolls and history", lat: 23.8388, lng: 78.7378, popularity: 61 },
  { name: "Damoh (Singorgarh Fort)", category: "Heritage", region: "Damoh", description: "Ancient fort of the Gond rulers, nestled in the dense forests of the Vindhyachal range.", bestFor: "Offbeat history and trekking", lat: 23.8322, lng: 79.4442, popularity: 60 },
  { name: "Tikamgarh", category: "Heritage", region: "Tikamgarh", description: "Former capital of Orchha state, known for its old town vibe and large Mahendra Sagar lake.", bestFor: "Local history", lat: 24.7454, lng: 78.8354, popularity: 59 },
  { name: "Katni (Marble City)", category: "City", region: "Katni", description: "A major industrial hub known for its marble and stone quarries.", bestFor: "Industrial exploration", lat: 23.8344, lng: 80.3894, popularity: 58 },
  { name: "Narsinghpur", category: "City", region: "Narsinghpur", description: "Known for its rich agriculture and the ancient Narsingha temple.", bestFor: "Local culture", lat: 22.9431, lng: 79.1969, popularity: 57 },
  { name: "Betul (Balajipuram)", category: "Spiritual", region: "Betul", description: "Home to a massive temple complex with beautiful gardens and unique architectural styles.", bestFor: "Spiritual tourism", lat: 21.9019, lng: 77.8962, popularity: 56 },
  { name: "Itarsi", category: "City", region: "Narmadapuram", description: "One of the most important railway junctions in India, connecting the north and south.", bestFor: "Transit history", lat: 22.6225, lng: 77.7511, popularity: 55 },
  { name: "Barwani (Bawangaja)", category: "Spiritual", region: "Barwani", description: "Famous for the 84ft tall statue of Adinatha, carved directly from the hill rock.", bestFor: "Jain pilgrimage", lat: 22.0347, lng: 74.9036, popularity: 54 },
  { name: "Munda", category: "Heritage", region: "Satna", description: "Known for ancient temples and the cultural depth of the Vindhyan region.", bestFor: "Exploration", lat: 24.3456, lng: 80.9876, popularity: 53 },
  { name: "Hanumantiya Tapu", category: "Water", region: "Khandwa", description: "MP's own 'mini Goa', an island retreat in the Indira Sagar dam reservoir.", bestFor: "Water sports and luxury tents", lat: 22.2345, lng: 76.5678, popularity: 52 },
  { name: "Sailana", category: "Heritage", region: "Ratlam", description: "Famous for its unique Cactus Garden and the culinary heritage of the Sailana royalty.", bestFor: "Gourmets and botanists", lat: 23.4654, lng: 74.9123, popularity: 51 },
  { name: "Karera Bird Sanctuary", category: "Wildlife", region: "Shivpuri", description: "A haven for birdwatchers, especially known for the Great Indian Bustard.", bestFor: "Bird watching", lat: 25.4654, lng: 78.1234, popularity: 50 },
  { name: "Sonagiri", category: "Spiritual", region: "Datia", description: "A complex of nearly 100 white Jain temples scattered across a peaceful hill.", bestFor: "Jain architecture and peace", lat: 25.7532, lng: 78.4721, popularity: 49 },
  { name: "Bhojpur Lakes", category: "Water", region: "Raisen", description: "Scenic lakes near the ancient temple, perfect for a quiet afternoon getaway.", bestFor: "Picnics", lat: 23.1123, lng: 77.5987, popularity: 48 },
];

export default function DestinationExplorer() {
  const [selected, setSelected] = useState<Destination>(allDestinations[0]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = ["All", "Wildlife", "Heritage", "Water", "Hills", "Spiritual", "City"];

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const list = allDestinations.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.region.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.bestFor.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });

    // Sort by popularity (descending)
    return list.sort((a, b) => b.popularity - a.popularity);
  }, [query, category]);

  useEffect(() => {
    if (filtered.length > 0) {
      setSelected(filtered[0]);
    }
  }, [filtered]);

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-9rem)] min-h-[600px] overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-xl">

      {/* Left Panel: Search & List */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200 bg-white/80">
        <div className="p-7 space-y-6 flex-shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Global Atlas</p>
            <h2 className="mt-2 font-display text-3xl text-slate-900">Destination Explorer</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Discover 50+ handpicked locations across MP with real-time mapping.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400">
                <path d="M21 21l-4.35-4.35M10.8 18a7.2 7.2 0 100-14.4 7.2 7.2 0 000 14.4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, region..."
                className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${category === item
                      ? "bg-slate-900 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-7 space-y-3">
          {filtered.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelected(item)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${selected.name === item.name
                  ? "bg-slate-900 border-slate-900 text-white shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${selected.name === item.name ? "text-slate-400" : "text-emerald-600"}`}>
                    {item.region}
                  </p>
                </div>
                {selected.name === item.name && (
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse mt-1.5 shrink-0" />
                )}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="py-10 text-center text-slate-400">
              <p className="text-sm">No destinations found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Details & Map */}
      <div className="flex-1 h-full overflow-hidden flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto p-7 xl:p-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="font-display text-4xl xl:text-5xl text-slate-900 mb-4 leading-tight">{selected.name}</h1>
              <p className="text-slate-500 text-lg leading-relaxed">{selected.description}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Category</p>
                <p className="font-semibold text-slate-900">{selected.category}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Region</p>
                <p className="font-semibold text-slate-900">{selected.region}</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">Best For</p>
                <p className="font-semibold text-emerald-700">{selected.bestFor}</p>
              </div>
            </div>

            <div className="relative h-[400px] w-full rounded-[2rem] border border-slate-200 overflow-hidden shadow-lg group">
              <MapContainer
                center={[selected.lat, selected.lng]}
                zoom={9}
                style={{ height: '100%', width: '100%', zIndex: 10 }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapController center={[selected.lat, selected.lng]} zoom={9} />
                <Marker position={[selected.lat, selected.lng]} icon={mapIcon}>
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-slate-900">{selected.name}</p>
                      <p className="text-[10px] text-slate-500">{selected.region}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
              <div className="absolute top-4 right-4 z-[1000] rounded-full bg-slate-950/90 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl border border-white/10">
                Active Coordinate System
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-container {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
