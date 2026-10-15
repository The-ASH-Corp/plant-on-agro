"use client";

import { useMemo } from "react";
import { PlantationLocationItem } from "../types";
import { TrashIcon } from "@/components/ui/TrashIcon";

interface LocationsTabProps {
  locations: PlantationLocationItem[];
  searchQuery: string;
  onOpenAddLocation: () => void;
  onDeleteLocation?: (id: string, name?: string) => void;
}

export function LocationsTab({
  locations,
  searchQuery,
  onOpenAddLocation,
  onDeleteLocation,
}: LocationsTabProps) {
  const filteredLocations = useMemo(() => {
    return locations.filter(
      (l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.gps.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
            Protected Bio-Sanctuaries & Reserves ({filteredLocations.length})
          </h2>
          <p className="text-xs text-[#73877b]">Geotagged forest sectors with live GPS telemetry, hectare metrics, and soil health</p>
        </div>
        <button
          onClick={onOpenAddLocation}
          className="px-4 py-2 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <span>+</span>
          <span>Geotag Reserve</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => {
          const pct = Math.round((loc.treesPlanted / loc.capacity) * 100);
          return (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-[#eaf1ec] overflow-hidden">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-400/30">
                    NDVI {loc.ndviScore}
                  </span>
                  <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/95 text-[#173324]">
                    {loc.gps}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-[#173324]">
                      {loc.name}
                    </h3>
                    <span className="text-xs text-[#73877b] block">{loc.region}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#73877b]">Capacity</span>
                      <span className="font-bold text-[#173324]">
                        {loc.treesPlanted.toLocaleString()} / {loc.capacity.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#eef3f0] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#2d6a4f] to-[#52b788] h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] text-[11px] text-[#55695d] space-y-1">
                    <div>
                      <span className="font-bold text-[#173324]">Area:</span> {loc.areaHectares} Hectares
                    </div>
                    <div>
                      <span className="font-bold text-[#173324]">Soil:</span> {loc.soilHealth}
                    </div>
                    <div>
                      <span className="font-bold text-[#173324]">Survival:</span> {loc.survivalRate}
                    </div>
                  </div>
                </div>

                {onDeleteLocation && (
                  <div className="px-5 py-3 border-t border-[#f0f4f1] bg-[#fafcfa] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#7a8c81]">Capacity: {loc.capacity.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => onDeleteLocation(loc.id, loc.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                      title={`Delete reserve ${loc.name}`}
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
