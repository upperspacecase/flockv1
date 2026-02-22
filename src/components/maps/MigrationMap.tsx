"use client";

import { useEffect, useRef, useMemo } from "react";
import type { MigrationStop } from "@/lib/app-state";
import type L from "leaflet";

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
  const mapInstanceRef = useRef<L.Map | null>(null);

  const allStops = useMemo(() => [...stops, ...futureStops], [stops, futureStops]);
  const overlapSet = useMemo(
    () => new Set(overlappingStops.map((s) => s.country)),
    [overlappingStops]
  );

  useEffect(() => {
    if (!mapRef.current || allStops.length === 0) return;

    let cancelled = false;

    (async () => {
      const leaflet = await import("leaflet");

      if (cancelled || !mapRef.current) return;

      // Clean up previous map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = leaflet.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: !compact,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: !compact,
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
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: compact ? 3 : 5 });

      // Past migration path
      if (stops.length >= 2) {
        leaflet
          .polyline(
            stops.map((s) => [s.lat, s.lng] as [number, number]),
            { color: "#1a1a1a", weight: compact ? 1.5 : 2, opacity: 0.6 }
          )
          .addTo(map);
      }

      // Future migration path (dashed)
      if (futureStops.length > 0 && stops.length > 0) {
        const lastStop = stops[stops.length - 1];
        leaflet
          .polyline(
            [
              [lastStop.lat, lastStop.lng] as [number, number],
              ...futureStops.map((s) => [s.lat, s.lng] as [number, number]),
            ],
            { color: "#1a1a1a", weight: compact ? 1 : 1.5, opacity: 0.3, dashArray: "6 8" }
          )
          .addTo(map);
      }

      // Stop markers
      allStops.forEach((stop) => {
        const isFuture = futureStops.includes(stop);
        const isOverlap = overlapSet.has(stop.country);
        const radius = compact ? 3 : 5;

        if (isOverlap) {
          leaflet
            .circleMarker([stop.lat, stop.lng], {
              radius: radius + 6,
              color: "transparent",
              fillColor: "#1a1a1a",
              fillOpacity: 0.1,
            })
            .addTo(map);
        }

        const marker = leaflet
          .circleMarker([stop.lat, stop.lng], {
            radius,
            color: "#1a1a1a",
            fillColor: isFuture ? "#999" : "#1a1a1a",
            fillOpacity: isFuture ? 0.4 : 0.8,
            weight: 1.5,
          })
          .addTo(map);

        if (showLabels && !compact) {
          marker.bindTooltip(stop.country, {
            permanent: true,
            direction: "top",
            offset: [0, -8],
            className: "migration-label",
          });
        }
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
