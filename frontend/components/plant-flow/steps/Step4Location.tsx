"use client";

import { LOCATIONS } from "@/data/mockData";

interface Step4LocationProps {
  location: string | null;
  onSelectLocation: (loc: string) => void;
}

export function Step4Location({
  location,
  onSelectLocation,
}: Step4LocationProps) {
  return (
    <div>
      <p className="text-[#4a6557] mb-5">Choose a plantation site for your tree.</p>
      <div className="grid grid-cols-1 gap-3">
        {LOCATIONS.map((loc) => (
          <button
            key={loc}
            id={`location-option-${loc.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}
            onClick={() => onSelectLocation(loc)}
            className="flex items-center gap-3 p-4 rounded-xl text-left transition-all cursor-pointer"
            style={{
              border: location === loc ? "2px solid #52b788" : "2px solid #eaf2ec",
              background: location === loc ? "#f0faf4" : "#fff",
            }}
          >
            <span className="text-lg">📍</span>
            <span className="font-medium text-[#173324] text-sm">{loc}</span>
            {location === loc && <span className="ml-auto text-[#52b788]">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
