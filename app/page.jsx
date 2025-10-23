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
import { Search, Play, Pause, Info } from "lucide-react";
import Supercluster from "supercluster";

export default function Page() {
  const initialView = { longitude: 134.5, latitude: -25.5, zoom: 3.6 };

  const [raw, setRaw] = useState([]);
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");
  const [monthIdx, setMonthIdx] = useState(0);
  const [monthWindow, setMonthWindow] = useState(1);
  const timerRef = useRef(null);
  const [zoom, setZoom] = useState(initialView.zoom);
  const [bounds, setBounds] = useState(null);

  const handleViewStateChange = ({ viewState }) => {
  setZoom(viewState.zoom);
  // You may want to use the map's bounds here for more accuracy
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

const lower = monthIdx;
const upper = monthIdx + Math.max(1, monthWindow - 1);

const filteredData = useMemo(() => {
  return enriched.filter(f => {
    const inTime = f._m >= lower && f._m <= upper;
    const inText = matched ? matched.has(f._i) : true;
    const inBounds = bounds
      ? (
          f.geometry.coordinates[0] >= bounds[0][0] &&
          f.geometry.coordinates[0] <= bounds[1][0] &&
          f.geometry.coordinates[1] >= bounds[0][1] &&
          f.geometry.coordinates[1] <= bounds[1][1]
        )
      : true;
    return inTime && inText && inBounds;
  });
}, [enriched, lower, upper, matched, bounds]);

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

const clusters = useMemo(() => {
  if (!bounds) return [];
  // bounds: [[westLng, southLat], [eastLng, northLat]]
  return cluster.getClusters([
    bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]
  ], Math.round(zoom));
}, [cluster, bounds, zoom]);

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
      if (obj.properties.cluster) {
        // Zoom in on cluster
        const expansionZoom = cluster.getClusterExpansionZoom(obj.properties.cluster_id);
        const [longitude, latitude] = obj.geometry.coordinates;
        // You may want to use DeckGL's view state update here:
        setZoom(expansionZoom);
        setBounds([
          [longitude - 2, latitude - 2],
          [longitude + 2, latitude + 2]
        ]);
      } else {
        setSelected(obj);
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
      ? `${info.object.properties.point_count} articles`
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
          <label className="text-xs mt-3 block">Search locations</label>
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
            <button onClick={() => setQuery("")}
              className="text-sm px-3 py-2 border rounded-xl hover:bg-surface-50">Clear</button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Timeline</span>
              <button onClick={() => setPlaying(p => !p)}
                className="inline-flex items-center gap-1 text-white bg-brand-red hover:opacity-95 px-3 py-1.5 rounded-xl">
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Play"}
              </button>
            </div>
            <input type="range" min={0} max={Math.max(0, maxMonth)} value={monthIdx}
              onChange={e => setMonthIdx(Number(e.target.value))} className="w-full mt-2" />
            <div className="mt-2 flex items-center gap-3 text-sm">
              <label className="whitespace-nowrap">Window</label>
              <input type="number" min={1} max={24} value={monthWindow}
                onChange={e => setMonthWindow(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 border border-surface-border rounded-xl px-2 py-1" title="Months displayed at once" />
              <span className="text-gray-600">month{monthWindow === 1 ? "" : "s"}</span>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 text-brand-blue" />
            <p className="text-sm text-gray-700">
              Drag the slider to move through time. Only points in the current window and matching your search are shown.
            </p>
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

{/* Results drawer */}
<aside className="absolute right-4 top-4 w-[420px]">
  <Panel>
    <h2 className="font-semibold text-lg mb-2">Results</h2>
    <div
      className="flex flex-col gap-4 overflow-y-auto"
      style={{ maxHeight: "80vh", minHeight: "300px" }}
    >
      {filteredData.map((item) => (
        <div key={item._i} className="border-b pb-4 last:border-b-0 last:pb-0">
          <h3 className="font-semibold text-base">{item.properties.title || "Article"}</h3>
          <p className="text-sm text-gray-700 mt-1">
            {item.properties.location}
            {item.properties.state ? `, ${item.properties.state}` : ""} • {item.properties.date}
          </p>
          <p className="text-sm text-gray-700">{item.properties.paper}</p>
          <div className="mt-3 flex gap-3">
            {item.properties.url && (
              <a className="btn-primary" href={item.properties.url} target="_blank" rel="noreferrer">View article</a>
            )}
            {item.properties.page_url && (
              <a className="btn-outline" href={item.properties.page_url} target="_blank" rel="noreferrer">Newspaper page</a>
            )}
          </div>
        </div>
      ))}
    </div>
  </Panel>
</aside>
    </div>
  );
}

function Panel({ children }) {
  return (
    <div className="bg-surface-0/95 backdrop-blur shadow-panel border border-surface-border rounded-2xl p-4">
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
