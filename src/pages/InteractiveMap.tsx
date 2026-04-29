import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon paths in React/Vite
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

const activeIcon = L.divIcon({
  className: 'custom-active-marker',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#10b981" stroke="white" stroke-width="2.5"/><circle cx="12" cy="12" r="3" fill="white"/></svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const defaultIconMap = L.divIcon({
  className: 'custom-default-marker',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#0f172a" stroke="white" stroke-width="2"/></svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const centerMP: [number, number] = [23.4734, 77.9479]; // Center of MP

const destinations = [
  { id: '1', name: "Kanha National Park", lat: 22.3345, lng: 80.6115, type: "Wildlife", desc: "Premier tiger reserve with dense sal forests." },
  { id: '2', name: "Khajuraho", lat: 24.8318, lng: 79.9199, type: "Heritage", desc: "UNESCO site famous for intricately carved temples." },
  { id: '3', name: "Pachmarhi", lat: 22.4674, lng: 78.4346, type: "Nature", desc: "Queen of Satpura hill station at 1067m." },
  { id: '4', name: "Mahakaleshwar, Ujjain", lat: 23.1827, lng: 75.7682, type: "Spiritual", desc: "Sacred Jyotirlinga shrine on the Kshipra river." },
  { id: '5', name: "Gwalior Fort", lat: 26.2313, lng: 78.1695, type: "Heritage", desc: "Historic 8th-century hill fort overlooking the city." },
  { id: '6', name: "Bandhavgarh", lat: 23.7225, lng: 81.0245, type: "Wildlife", desc: "Highest density of Bengal tigers in India." },
  { id: '7', name: "Sanchi Stupa", lat: 23.4871, lng: 77.7397, type: "Heritage", desc: "Ancient Buddhist complex built by Ashoka." },
  { id: '8', name: "Omkareshwar", lat: 22.2458, lng: 76.1471, type: "Spiritual", desc: "Sacred island temple on the Narmada river." },
  { id: '9', name: "Bhedaghat", lat: 23.1293, lng: 79.8021, type: "Nature", desc: "Stunning marble rocks gorge on the Narmada." },
];

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap() {
  const navigate = useNavigate();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(centerMP);
  const [mapZoom, setMapZoom] = useState(6.5);
  
  const [searchedPlace, setSearchedPlace] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [activePlaceDetails, setActivePlaceDetails] = useState<{extract?: string, thumbnail?: string, loading: boolean} | null>(null);

  // Debounced search using OpenStreetMap Nominatim API
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          // General world-wide search, but giving MP a slight edge naturally if user types it
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`);
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const allDestinations = searchedPlace ? [searchedPlace, ...destinations] : destinations;

  const handleSelectPlace = async (placeId: string) => {
    const place = allDestinations.find(p => p.id === placeId);
    if (!place) return;
    
    setActiveMarker(place.id);
    setMapCenter([place.lat, place.lng]);
    setMapZoom(place.type === "Custom Search" ? 12 : 10);
    
    // Fetch Wikipedia details for rich info panel
    setActivePlaceDetails({ loading: true });
    try {
      // Clean up the name for better wikipedia matches
      const searchName = place.name.split(',')[0].replace(/National Park|Stupa|Fort/gi, '').trim();
      let res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName)}`);
      
      if (!res.ok && searchName.includes(' ')) {
        // Fallback to first word if exact match fails
        res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName.split(' ')[0])}`);
      }
      
      if (res.ok) {
        const data = await res.json();
        if (data.type !== "disambiguation" && data.extract) {
          setActivePlaceDetails({
            extract: data.extract,
            thumbnail: data.thumbnail?.source,
            loading: false
          });
          return;
        }
      }
      setActivePlaceDetails({ loading: false });
    } catch (err) {
      setActivePlaceDetails({ loading: false });
    }
  };

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    const newPlace = {
      id: 'search-' + result.place_id,
      name: result.name || result.display_name.split(',')[0],
      lat,
      lng,
      type: "Custom Search",
      desc: result.display_name,
    };
    
    setSearchedPlace(newPlace);
    setSearchQuery("");
    setSearchResults([]);
    
    // Automatically select and fetch details for the new searched place
    setTimeout(() => {
      handleSelectPlace(newPlace.id);
    }, 50);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden space-y-4">
      <section className="flex-1 flex flex-col rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_80px_rgba(148,163,184,0.16)] backdrop-blur-xl overflow-hidden">
        <div className="mb-4 flex justify-between items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Interactive Map</p>
            <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">Global Destination Explorer</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              Search any location in the world to instantly pull up Wikipedia details and precise map routing.
            </p>
          </div>
        </div>

        <div className="flex-1 grid gap-6 xl:grid-cols-[360px_1fr] overflow-hidden min-h-0">
          {/* Sidebar Area */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-3 custom-scrollbar relative">
            
            {activeMarker ? (() => {
              const place = allDestinations.find(p => p.id === activeMarker);
              if (!place) return null;
              
              return (
                <div className="flex flex-col bg-white border border-slate-100 rounded-[1.4rem] p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setActiveMarker(null)}
                    className="flex items-center w-max text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-5 transition"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Search
                  </button>
                  
                  {activePlaceDetails?.thumbnail ? (
                    <div className="w-full h-56 rounded-[1rem] overflow-hidden mb-5 shrink-0 bg-slate-100 shadow-inner">
                      <img src={activePlaceDetails.thumbnail} alt={place.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                    </div>
                  ) : activePlaceDetails?.loading ? (
                    <div className="w-full h-56 rounded-[1rem] bg-slate-100 animate-pulse mb-5 shrink-0 flex items-center justify-center shadow-inner">
                       <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Fetching Images...</span>
                    </div>
                  ) : null}

                  <h2 className="font-display text-3xl text-slate-900 leading-tight mb-3">{place.name}</h2>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="inline-block text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {place.type}
                    </span>
                    <span className="text-xs font-medium text-slate-400 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {place.lat.toFixed(2)}, {place.lng.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="prose prose-sm prose-slate text-slate-600">
                    {activePlaceDetails?.loading ? (
                      <div className="space-y-3">
                        <div className="h-3 bg-slate-100 rounded w-full animate-pulse"></div>
                        <div className="h-3 bg-slate-100 rounded w-[90%] animate-pulse"></div>
                        <div className="h-3 bg-slate-100 rounded w-[95%] animate-pulse"></div>
                        <div className="h-3 bg-slate-100 rounded w-[80%] animate-pulse"></div>
                        <div className="h-3 bg-slate-100 rounded w-[85%] animate-pulse"></div>
                      </div>
                    ) : (
                      <p className="leading-relaxed text-[13px] text-justify text-slate-500">
                        {activePlaceDetails?.extract || place.desc || "Detailed Wikipedia information is currently unavailable for this specific coordinate. Zoom out or explore nearby documented landmarks."}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => navigate('/dashboard/planner')}
                      className="w-full py-2.5 bg-slate-900 text-white text-xs rounded-lg font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
                    >
                      Plan Trip Here
                    </button>
                    <button 
                      className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 text-xs rounded-lg font-semibold hover:bg-slate-50 transition"
                    >
                      Save Place
                    </button>
                  </div>
                </div>
              );
            })() : (
              <>
                {/* Search Box */}
                <div className="relative shrink-0 z-50">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search any place globally..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-[1.2rem] border border-slate-200 bg-white pl-11 pr-4 py-3.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition"
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 shadow-2xl rounded-[1rem] overflow-hidden z-50">
                      {searchResults.map(res => (
                        <button
                          key={res.place_id}
                          onClick={() => selectSearchResult(res)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition"
                        >
                          <p className="font-semibold text-sm text-slate-900">{res.name || res.display_name.split(',')[0]}</p>
                          <p className="text-xs text-slate-500 truncate mt-1">{res.display_name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2 ml-1">Featured Places</h3>
                
                {allDestinations.map(dest => (
                  <button
                    key={dest.id}
                    onClick={() => handleSelectPlace(dest.id)}
                    className="text-left p-4 rounded-[1.2rem] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900">{dest.name}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {dest.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{dest.desc}</p>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Map Area */}
          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-100 overflow-hidden relative shadow-inner z-10">
            <MapContainer 
              center={centerMP} 
              zoom={6.5} 
              style={{ height: '100%', width: '100%', zIndex: 10 }}
              zoomControl={true}
            >
              {/* Voyager clean style map tiles */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              
              <MapController center={mapCenter} zoom={mapZoom} />

              {allDestinations.map(dest => (
                <Marker 
                  key={dest.id} 
                  position={[dest.lat, dest.lng]}
                  icon={activeMarker === dest.id ? activeIcon : defaultIconMap}
                  eventHandlers={{
                    click: () => handleSelectPlace(dest.id)
                  }}
                >
                  {/* Keep popup simple, push rich details to sidebar */}
                  <Popup offset={[0, -10]} className="custom-popup">
                    <div className="p-1 max-w-[200px] text-center">
                      <h3 className="font-bold text-sm text-slate-900">{dest.name}</h3>
                      <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mt-1">{dest.type}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>
      
      {/* Global Map Overrides */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .custom-popup .leaflet-popup-content-wrapper { border-radius: 0.8rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .custom-popup .leaflet-popup-content { margin: 12px 16px; }
        .leaflet-container { background: #f8fafc; font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
