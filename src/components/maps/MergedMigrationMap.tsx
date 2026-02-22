"use client";

import { useEffect, useRef, useMemo } from "react";
import type { MigrationStop } from "@/lib/app-state";
import type L from "leaflet";

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
  const mapInstanceRef = useRef<L.Map | null>(null);

  const allStops = useMemo(() => [...stopsA, ...stopsB], [stopsA, stopsB]);

  const overlapCountries = useMemo(() => {
    const countriesA = new Set(stopsA.map((s) => s.country));
    return new Set(stopsB.filter((s) => countriesA.has(s.country)).map((s) => s.country));
  }, [stopsA, stopsB]);

  useEffect(() => {
    if (!mapRef.current || allStops.length === 0) return;

    let cancelled = false;

    (async () => {
      const leaflet = await import("leaflet");

      if (cancelled || !mapRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = leaflet.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
      });

      mapInstanceRef.current = map;

      leaflet
        .tileLayer(
          "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png",
          { maxZoom: 18, opacity: 0.4 }
        )
        .addTo(map);

      const bounds = leaflet.latLngBounds(
        allStops.map((s) => [s.lat, s.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [15, 15], maxZoom: 5 });

      // Path A
      if (stopsA.length >= 2) {
        leaflet
          .polyline(
            stopsA.map((s) => [s.lat, s.lng] as [number, number]),
            { color: "#1a1a1a", weight: 2, opacity: 0.5 }
          )
          .addTo(map);
      }

      // Path B
      if (stopsB.length >= 2) {
        leaflet
          .polyline(
            stopsB.map((s) => [s.lat, s.lng] as [number, number]),
            { color: "#666", weight: 2, opacity: 0.4, dashArray: "4 4" }
          )
          .addTo(map);
      }

      // Dots for A
      stopsA.forEach((stop) => {
        leaflet
          .circleMarker([stop.lat, stop.lng], {
            radius: 4,
            color: "#1a1a1a",
            fillColor: "#1a1a1a",
            fillOpacity: 0.8,
            weight: 1.5,
          })
          .addTo(map);
      });

      // Dots for B
      stopsB.forEach((stop) => {
        leaflet
          .circleMarker([stop.lat, stop.lng], {
            radius: 4,
            color: "#666",
            fillColor: "#666",
            fillOpacity: 0.7,
            weight: 1.5,
          })
          .addTo(map);
      });

      // Overlap glow rings
      stopsB
        .filter((s) => overlapCountries.has(s.country))
        .forEach((stop) => {
          leaflet
            .circleMarker([stop.lat, stop.lng], {
              radius: 12,
              color: "transparent",
              fillColor: "#1a1a1a",
              fillOpacity: 0.12,
            })
            .addTo(map);
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
