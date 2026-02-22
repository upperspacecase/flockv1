"use client";

import { useEffect, useRef, useMemo } from "react";
import type { MigrationStop } from "@/lib/app-state";

interface MigrationMapProps {
  stops: MigrationStop[];
  futureStops?: MigrationStop[];
  overlappingStops?: MigrationStop[];
  width?: number;
  height?: number;
  className?: string;
  animated?: boolean;
  showLabels?: boolean;
  compact?: boolean;
}

export default function MigrationMap({
  stops,
  futureStops = [],
  overlappingStops = [],
  height = 180,
  className = "",
  showLabels = false,
  compact = false,
}: MigrationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const allStops = useMemo(() => [...stops, ...futureStops], [stops, futureStops]);
  const overlapSet = useMemo(
    () => new Set(overlappingStops.map((s) => s.country)),
    [overlappingStops]
  );

  useEffect(() => {
    if (!mapRef.current || allStops.length === 0) return;

    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;

      if (cancelled || !mapRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

      // Clean up previous map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        interactive: !compact,
        scrollZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchZoomRotate: !compact ? true : false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Fit bounds to all stops
      const bounds = new mapboxgl.LngLatBounds();
      allStops.forEach((s) => bounds.extend([s.lng, s.lat]));
      map.fitBounds(bounds, {
        padding: 20,
        maxZoom: compact ? 3 : 5,
        duration: 0,
      });

      map.on("load", () => {
        // Past migration path
        if (stops.length >= 2) {
          map.addSource("past-path", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: stops.map((s) => [s.lng, s.lat]),
              },
            },
          });
          map.addLayer({
            id: "past-path",
            type: "line",
            source: "past-path",
            paint: {
              "line-color": "#1a1a1a",
              "line-width": compact ? 1.5 : 2,
              "line-opacity": 0.6,
            },
          });
        }

        // Future migration path (dashed)
        if (futureStops.length > 0 && stops.length > 0) {
          const lastStop = stops[stops.length - 1];
          map.addSource("future-path", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [
                  [lastStop.lng, lastStop.lat],
                  ...futureStops.map((s) => [s.lng, s.lat]),
                ],
              },
            },
          });
          map.addLayer({
            id: "future-path",
            type: "line",
            source: "future-path",
            paint: {
              "line-color": "#1a1a1a",
              "line-width": compact ? 1 : 1.5,
              "line-opacity": 0.3,
              "line-dasharray": [2, 2.5],
            },
          });
        }

        // Stop markers (overlap glow rings, dots, and labels)
        allStops.forEach((stop, i) => {
          const isFuture = futureStops.includes(stop);
          const isOverlap = overlapSet.has(stop.country);

          // Overlap glow ring
          if (isOverlap) {
            const el = document.createElement("div");
            const size = compact ? 18 : 22;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.borderRadius = "50%";
            el.style.backgroundColor = "rgba(26, 26, 26, 0.1)";
            new mapboxgl.Marker({ element: el, anchor: "center" })
              .setLngLat([stop.lng, stop.lat])
              .addTo(map);
          }

          // Dot marker
          const dot = document.createElement("div");
          const radius = compact ? 6 : 10;
          dot.style.width = `${radius}px`;
          dot.style.height = `${radius}px`;
          dot.style.borderRadius = "50%";
          dot.style.border = "1.5px solid #1a1a1a";
          dot.style.backgroundColor = isFuture ? "#999" : "#1a1a1a";
          dot.style.opacity = isFuture ? "0.4" : "0.8";

          new mapboxgl.Marker({ element: dot, anchor: "center" })
            .setLngLat([stop.lng, stop.lat])
            .addTo(map);

          // Labels
          if (showLabels && !compact) {
            new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: [0, -8],
              className: "migration-label-popup",
            })
              .setLngLat([stop.lng, stop.lat])
              .setHTML(
                `<span class="migration-label">${stop.country}</span>`
              )
              .addTo(map);
          }
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
  }, [allStops, stops, futureStops, overlapSet, compact, showLabels]);

  return (
    <div
      ref={mapRef}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ height: compact ? 80 : height, width: "100%" }}
    />
  );
}
