"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { Map, MapProvider } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { DeckGL } from "@deck.gl/react";
{ /* import { ScatterplotLayer } from "@deck.gl/layers"; REMOVED THIS */} 
import { ScatterplotLayer, IconLayer } from "@deck.gl/layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Search, Play, Pause, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Supercluster from "supercluster";

export const metadata = {
  title: "Historic Fires Near Me",
  description:
    "An interactive map exploring nineteenth century Australian bushfire reporting from digitised newspapers (1850–1900).",
  openGraph: {
    title: "Historic Fires Near Me",
    description:
      "Explore patterns in nineteenth century Australian bushfire reporting using digitised newspapers from Trove.",
    url: "https://your-site-url",
    siteName: "Historic Fires Near Me",
    images: [
      {
        url: "https://your-site-url/og-image.png",
        width: 1200,
        height: 630,
        alt: "Historic Fires Near Me map preview"
      }
    ],
    locale: "en_AU",
    type: "website"
  }
};


export default function Page() {
  const initialView = { longitude: 134.5, latitude: -25.5, zoom: 3.6 };

  const [raw, setRaw] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [monthIdx, setMonthIdx] = useState(0);
  const [monthWindow, setMonthWindow] = useState(12);
  const [zoom, setZoom] = useState(initialView.zoom);
  const [bounds, setBounds] = useState(null);
  const [clusterSelection, setClusterSelection] = useState(null);
  const [resultsOpen, setResultsOpen] = useState(true);
// null = no cluster selected, show all articles in view

{/*const handleAdvanceWindow = () => {
  setMonthIdx(idx => {
    const next = idx + monthWindow;
    if (next >= months.length) return idx;
    return next;
  });
};*/}

  const handleViewStateChange = ({ viewState }) => {
  setZoom(viewState.zoom);
  // Ythe map's bounds here for more accuracy
  // For now, use a simple bounding box around the center
  const delta = 10; // adjust for your use case
  setBounds([
    [viewState.longitude - delta, viewState.latitude - delta],
    [viewState.longitude + delta, viewState.latitude + delta]
  ]);
};

  useEffect(() => {
    fetch("/articles.geojson").then(r => r.json()).then(gj => setRaw(gj.features || []));
  }, []);

  const fuse = useMemo(() => new Fuse(
    raw.map((f, i) => ({ i, location: f.properties.location })),
    { keys: ["location"], threshold: 0.3, minMatchCharLength: 2 }
  ), [raw]);

  const enriched = useMemo(() => {
    if (!raw.length) return [];
    const months = raw.map(f => {
      const d = new Date(f.properties.date);
      return d.getFullYear() * 12 + d.getMonth();
    });
    const minMonth = Math.min(...months);
    return raw.map((f, idx) => {
      const d = new Date(f.properties.date);
      return { ...f, _i: idx, _m: d.getFullYear() * 12 + d.getMonth() - minMonth, _min: minMonth };
    });
  }, [raw]);

  const maxMonth = useMemo(() => enriched.reduce((m, f) => Math.max(m, f._m), 0), [enriched]);

  useEffect(() => {
  if (raw.length > 0) {
    console.log("Example feature:", raw[0].properties);
  }
}, [raw]);


  const matched = useMemo(() => {
  const q = query.trim();
  if (!q) {
    console.log("Search empty → showing all");
    return null;
  }
  
  const res = fuse.search(q);
  console.log("Search query:", q, "| Fuse results:", res.length);
  if (res.length > 0) {
    console.log("Example match:", res[0]);
  }
  return new Set(res.map(r => r.item.i));
}, [query, fuse]);

const safeWindow = Math.max(1, Number(monthWindow) || 1);
const maxStart = Math.max(0, maxMonth - (safeWindow - 1));

const lower = Math.min(monthIdx, maxStart);
const upper = Math.min(maxMonth, lower + (safeWindow - 1));
const handleAdvanceWindow = () => {
  setMonthIdx(idx => Math.min(idx + safeWindow, maxMonth));
};


const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const toTextAbsMonth = absMonth => {
  const year = Math.floor(absMonth / 12);
  const month = absMonth % 12;
  return `${monthNames[month]} ${year}`;
};

// Human readable label for the selected month range
const rangeLabel = useMemo(() => {
  if (!enriched.length) return "";

  // All features share the same _min
  const base = enriched[0]._min; // absolute month index of _m = 0
  const toAbs = mNorm => base + mNorm; // convert normalised _m back to absolute

  const startAbs = toAbs(lower);
  const endAbs = toAbs(upper);

  if (startAbs === endAbs) {
    return `Showing ${toTextAbsMonth(startAbs)}`;
  }
  return `Showing ${toTextAbsMonth(startAbs)} to ${toTextAbsMonth(endAbs)}`;
}, [enriched, lower, upper]);

// Timeline endpoint labels 
const timelineMinLabel = useMemo(() => {
  if (!enriched.length) return "";
  return toTextAbsMonth(enriched[0]._min);
}, [enriched]);

const timelineMaxLabel = useMemo(() => {
  if (!enriched.length) return "";
  return toTextAbsMonth(enriched[0]._min + maxMonth);
}, [enriched, maxMonth]);

const filteredData = useMemo(() => {
  return enriched.filter(f => {
    const inTime = f._m >= lower && f._m <= upper;
    const inText = matched ? matched.has(f._i) : true;
    // No spatial filtering here: include all fires in Australia
    return inTime && inText;
  });
}, [enriched, lower, upper, matched]);

// Data used specifically for the Results panel
const listData = useMemo(() => {
  if (!clusterSelection) return filteredData;
  return filteredData.filter(f => clusterSelection.has(f._i));
}, [filteredData, clusterSelection]);

// 4. RESET cluster selection when filters change
useEffect(() => {
  setClusterSelection(null);
}, [lower, upper, matched]);

const points = useMemo(() =>
  filteredData.map(f => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: f.geometry.coordinates },
    properties: { ...f.properties, cluster: false, _i: f._i }
  }))
, [filteredData]);

const cluster = useMemo(() => {
  const sc = new Supercluster({
    radius: 40,
    maxZoom: 16
  });
  sc.load(points);
  return sc;
}, [points]);

// Approximate Australia bounding box: [west, south, east, north]
const AU_BOUNDS = [113, -44, 154, -10];

const clusters = useMemo(() => {
  // If there are no points, there will be no clusters
  if (!points.length) return [];
  return cluster.getClusters(AU_BOUNDS, Math.round(zoom));
}, [cluster, zoom, points.length]);


const layer = useMemo(() => {
  if (!filteredData.length) return null;
  return new ScatterplotLayer({
    id: "points",
    data: filteredData,
    getPosition: d => d.geometry.coordinates,
    getRadius: 60,
    radiusMinPixels: 2,
    radiusMaxPixels: 8,
    pickable: true,
    onClick: info => setSelected(info.object),
    parameters: { depthTest: false },
    extensions: [new DataFilterExtension({ filterSize: 2 })],
    getFilterValue: d => [d._m, matched ? (matched.has(d._i) ? 1 : 0) : 1],
    filterRange: [[lower, upper], [1, 1]],
    getFillColor: d => [198, 40, 40, 180]
  });
}, [filteredData, monthIdx, monthWindow, matched]);

{/* ADDED THIS ICON LAYER */}
{/* const fireIcons = useMemo(() => {
  if (!filteredData.length) return null;
  return new IconLayer({
    id: "fire-icons",
    data: filteredData,
    pickable: true,
    parameters: { depthTest: false },
    getPosition: d => d.geometry.coordinates,
    sizeUnits: "pixels",
    getSize: 28, // adjust to taste
    getIcon: () => ({
      url: "/icons/sign.png",
      width: 64,
      height: 64,
      anchorY: 64
    }),
    onClick: info => setSelected(info.object)
  });
}, [filteredData]);
*/}

const fireIcons = useMemo(() => {
  if (!clusters.length) return null;
  return new IconLayer({
    id: "fire-icons",
    data: clusters,
    pickable: true,
    parameters: { depthTest: false },
    getPosition: d => d.geometry.coordinates,
    sizeUnits: "pixels",
    getSize: d => d.properties.cluster
      ? Math.max(18, Math.min(40, 18 + d.properties.point_count * 0.3 * ((zoom - 3) / 13)))
      : 18,
    getIcon: d => d.properties.cluster
      ? { url: "/icons/cluster.png", width: 64, height: 64, anchorY: 64 }
      : { url: "/icons/sign.png", width: 64, height: 64, anchorY: 64 },
 onClick: info => {
  const obj = info.object;
  if (!obj) return;

  if (obj.properties.cluster) {
    // Removed: cluster expansion behaviour
    // Removed: zooming
    // Removed: bounds shrinking

    // New: Only update Results with the articles in this cluster
    const leaves = cluster.getLeaves(obj.properties.cluster_id, Infinity);
    const ids = new Set(leaves.map(f => f.properties._i));
    setClusterSelection(ids);
  } else {
    // Single article
    if (typeof obj.properties._i === "number") {
      setClusterSelection(new Set([obj.properties._i]));
    }
  }
}

  });
}, [clusters, zoom, cluster]);
  return (
    <div id="map" className="relative h-screen">
      <MapProvider>
        {/*<DeckGL initialViewState={initialView} controller layers={layer ? [layer] : []} REMOVED THIS */}
       <DeckGL
  initialViewState={initialView}
  controller
  layers={[fireIcons].filter(Boolean)}
  onViewStateChange={handleViewStateChange}
  getTooltip={info => info.object
    ? info.object.properties.cluster
      ? `${info.object.properties.point_count} reported fires in this area`
      : `${info.object.properties.location} • ${info.object.properties.date}`
    : null}
>
  <Map
    mapLib={maplibregl}
    reuseMaps
    style={{ width: "100%", height: "100%" }}
    mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
  />
</DeckGL>
      </MapProvider>

      {/* Left control panel */}
      <aside className="absolute top-4 left-4 w-[360px] space-y-3">
<Panel>
  <h2 className="text-base font-semibold">Filters</h2>

  {/* Search group */}
  <div className="mt-3">
    <div className="flex items-baseline justify-between">
      <h3 className="text-sm font-semibold">Location</h3>
      <span className="text-xs text-gray-600">Text filter</span>
    </div>

    <label className="text-xs mt-2 block text-gray-600">Search locations</label>
    <div className="mt-1 flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a town or suburb"
          className="w-full pl-9 pr-3 py-2 border border-surface-border rounded-xl outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>
      <button
        onClick={() => setQuery("")}
        className="text-sm px-3 py-2 border rounded-xl hover:bg-surface-50"
      >
        Clear
      </button>
    </div>

    <p className="mt-2 text-xs text-gray-600">
      Matches the location field in the articles.
    </p>
  </div>

  {/* Divider */}
  <div className="my-4 border-t border-surface-border" />

  {/* Timeline group */}
  <div className="rounded-xl bg-surface-50/60 p-3 border border-surface-border">
    <div className="flex items-baseline justify-between">
      <h3 className="text-sm font-semibold">Time</h3>
      <span className="text-xs text-gray-600">Date filter</span>
    </div>

    <div className="mt-2 flex items-center justify-between">
      <span className="text-sm font-medium">Timeline</span>
      <button
  type="button"
  onClick={handleAdvanceWindow}
  className="inline-flex items-center gap-1 text-white bg-brand-red hover:opacity-95 px-3 py-1.5 rounded-xl"
  aria-label="Advance timeline by selected window"
>
  <Play className="h-4 w-4" />
  Next
</button>

    </div>

    <input
      type="range"
      min={0}
      max={Math.max(0, maxMonth)}
      value={monthIdx}
      onChange={e => {
        const next = Number(e.target.value);

        const safeWindow = Math.max(1, Number(monthWindow) || 1);
        const maxStart = Math.max(0, maxMonth - (safeWindow - 1));

        setMonthIdx(Math.min(next, maxStart));
      }}
      className="w-full mt-2"
    />

    <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
      <span>{timelineMinLabel}</span>
      <span>{timelineMaxLabel}</span>
    </div>

    <div className="mt-3 flex items-center gap-3 text-sm">
      <label className="whitespace-nowrap">Window</label>
      <input
        type="number"
        min={1}
        max={24}
        value={monthWindow}
        onChange={e => {
          const nextWindow = Math.max(1, Number(e.target.value) || 1);
          setMonthWindow(nextWindow);

          const nextMaxStart = Math.max(0, maxMonth - (nextWindow - 1));
          setMonthIdx(prev => Math.min(prev, nextMaxStart));
        }}
        className="w-20 border border-surface-border rounded-xl px-2 py-1"
        title="Months displayed at once"
      />
      <span className="text-gray-600">
        month{monthWindow === 1 ? "" : "s"}
      </span>
    </div>

    {rangeLabel && (
  <p className="mt-2 text-s">
    <span className="text-gray-600">Showing </span>
    <span className="text-brand-red font-medium">
      {rangeLabel.replace(/^Showing\s*/, "")}
    </span>
  </p>
)}

  </div>
</Panel>


        <Panel>
  <div className="flex items-center justify-between">
    <h3 className="text-sm font-semibold">Legend</h3>
    <span className="text-xs text-gray-600">Map symbols</span>
  </div>

  <div className="mt-3 space-y-3">
    <div className="flex items-center gap-3">
      <img
        src="/icons/cluster.png"
        alt="Cluster icon"
        className="h-7 w-7"
      />
      <div>
        <p className="text-sm font-medium text-gray-800">Cluster</p>
        <p className="text-xs text-gray-600">A group of articles in the same area. Click to list results.</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <img
        src="/icons/sign.png"
        alt="Single article icon"
        className="h-7 w-7"
      />
      <div>
        <p className="text-sm font-medium text-gray-800">Article</p>
        <p className="text-xs text-gray-600">A single historical newspaper report. Click to view details.</p>
      </div>
    </div>
  </div>
</Panel>

      </aside>

      {/* 
      Selection drawer 
      {selected && (
        <aside className="absolute right-4 top-4 w-[420px]">
          <Panel>
            <h3 className="font-semibold text-lg">{selected.properties.title || "Article"}</h3>
            <p className="text-sm text-gray-700 mt-1">
              {selected.properties.location}{selected.properties.state ? `, ${selected.properties.state}` : ""} • {selected.properties.date}
            </p>
            <p className="text-sm text-gray-700">{selected.properties.paper}</p>
            <div className="mt-3 flex gap-3">
              {selected.properties.url && (
                <a className="btn-primary" href={selected.properties.url} target="_blank" rel="noreferrer">View article</a>
              )}
              {selected.properties.page_url && (
                <a className="btn-outline" href={selected.properties.page_url} target="_blank" rel="noreferrer">Newspaper page</a>
              )}
            </div>
          </Panel>
        </aside> 
        */}

{/* Results drawer with left-edge handle */}
<aside
  className={[
    "absolute top-4 right-4 z-20",
    "transition-transform duration-200 ease-out",
    resultsOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
  ].join(" ")}
>
  {/* Leaf handle (always present, sits on the left edge of the panel) */}
  <button
    type="button"
    onClick={() => setResultsOpen(v => !v)}
    className={[
      "absolute left-0 top-20 -translate-x-full",
      "h-16 w-10",
      "rounded-l-xl rounded-r-none",
      "border border-surface-border border-r-0",
      "bg-surface-0/95 backdrop-blur shadow-panel",
      "flex items-center justify-center",
      "hover:bg-surface-50",
      "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
    ].join(" ")}
    aria-label={resultsOpen ? "Collapse results panel" : "Expand results panel"}
    aria-expanded={resultsOpen}
  >
    {resultsOpen ? <ChevronRight className="h-5 w-5 text-gray-700" /> : <ChevronLeft className="h-5 w-5 text-gray-700" />}
  </button>

  <div className="w-[420px]">
    <Panel>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">Results</h2>

        {clusterSelection && (
          <button
            className="text-xs text-gray-600 hover:underline"
            onClick={() => setClusterSelection(null)}
          >
            Clear selection
          </button>
        )}
      </div>

      <div
        className="flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: "80vh", minHeight: "300px" }}
      >
        {listData.map(item => (
          <div key={item._i} className="border-b pb-4 last:border-b-0 last:pb-0">
            <h3 className="font-semibold text-sm">
              {item.properties.title || "Article"}
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              {item.properties.location}
              {item.properties.state ? `, ${item.properties.state}` : ""} • {item.properties.date}
            </p>
            <p className="text-sm text-gray-700">{item.properties.paper}</p>
            <div className="mt-2 flex gap-3">
              {item.properties.url && (
                <a
                  className="btn-primary"
                  href={item.properties.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View article in Trove
                </a>
              )}
              {item.properties.page_url && (
                <a
                  className="btn-outline"
                  href={item.properties.page_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Newspaper page
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  </div>
</aside>



    </div>
  );
}

function Panel({ children }) {
  return (
    <div className="bg-surface-0/95 backdrop-blur shadow-panel border border-surface-border p-4">
      {children}
      <style jsx global>{`
        .btn-primary {
          display:inline-flex;align-items:center;justify-content:center;
          padding:0.5rem 0.875rem;border-radius:0.75rem;
          background:#C62828;color:#fff;font-weight:600;border:1px solid #C62828
        }
        .btn-primary:hover { opacity:.95 }
        .btn-outline {
          display:inline-flex;align-items:center;justify-content:center;
          padding:0.5rem 0.875rem;border-radius:0.75rem;
          background:#fff;color:#263238;font-weight:600;border:1px solid #E0E6ED
        }
        .btn-outline:hover { background:#F7F9FB }
      `}</style>
    </div>
  );
}
