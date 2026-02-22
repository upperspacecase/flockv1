"use client";

import { useEffect, useRef, useMemo } from "react";
import type { MigrationStop } from "@/lib/app-state";

interface MergedMigrationMapProps {
  stopsA: MigrationStop[];
  stopsB: MigrationStop[];
  width?: number;
  height?: number;
  className?: string;
}

export default function MergedMigrationMap({
  stopsA,
  stopsB,
  height = 200,
  className = "",
}: MergedMigrationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const allStops = useMemo(() => [...stopsA, ...stopsB], [stopsA, stopsB]);

  const overlapCountries = useMemo(() => {
    const countriesA = new Set(stopsA.map((s) => s.country));
    return new Set(stopsB.filter((s) => countriesA.has(s.country)).map((s) => s.country));
  }, [stopsA, stopsB]);

  useEffect(() => {
    if (!mapRef.current || allStops.length === 0) return;

    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;

      if (cancelled || !mapRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        interactive: false,
        scrollZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchZoomRotate: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Fit bounds to all stops
      const bounds = new mapboxgl.LngLatBounds();
      allStops.forEach((s) => bounds.extend([s.lng, s.lat]));
      map.fitBounds(bounds, { padding: 15, maxZoom: 5, duration: 0 });

      map.on("load", () => {
        // Path A
        if (stopsA.length >= 2) {
          map.addSource("path-a", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: stopsA.map((s) => [s.lng, s.lat]),
              },
            },
          });
          map.addLayer({
            id: "path-a",
            type: "line",
            source: "path-a",
            paint: {
              "line-color": "#1a1a1a",
              "line-width": 2,
              "line-opacity": 0.5,
            },
          });
        }

        // Path B (dashed)
        if (stopsB.length >= 2) {
          map.addSource("path-b", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: stopsB.map((s) => [s.lng, s.lat]),
              },
            },
          });
          map.addLayer({
            id: "path-b",
            type: "line",
            source: "path-b",
            paint: {
              "line-color": "#666",
              "line-width": 2,
              "line-opacity": 0.4,
              "line-dasharray": [2, 2],
            },
          });
        }

        // Dots for A
        stopsA.forEach((stop) => {
          const dot = document.createElement("div");
          dot.style.width = "8px";
          dot.style.height = "8px";
          dot.style.borderRadius = "50%";
          dot.style.border = "1.5px solid #1a1a1a";
          dot.style.backgroundColor = "#1a1a1a";
          dot.style.opacity = "0.8";
          new mapboxgl.Marker({ element: dot, anchor: "center" })
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);
        });

        // Dots for B
        stopsB.forEach((stop) => {
          const dot = document.createElement("div");
          dot.style.width = "8px";
          dot.style.height = "8px";
          dot.style.borderRadius = "50%";
          dot.style.border = "1.5px solid #666";
          dot.style.backgroundColor = "#666";
          dot.style.opacity = "0.7";
          new mapboxgl.Marker({ element: dot, anchor: "center" })
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);
        });

        // Overlap glow rings
        stopsB
          .filter((s) => overlapCountries.has(s.country))
          .forEach((stop) => {
            const el = document.createElement("div");
            el.style.width = "24px";
            el.style.height = "24px";
            el.style.borderRadius = "50%";
            el.style.backgroundColor = "rgba(26, 26, 26, 0.12)";
            new mapboxgl.Marker({ element: el, anchor: "center" })
              .setLngLat([stop.lng, stop.lat])
              .addTo(map);
          });
      });
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [allStops, stopsA, stopsB, overlapCountries]);

  return (
    <div
      ref={mapRef}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ height, width: "100%" }}
    />
  );
}
