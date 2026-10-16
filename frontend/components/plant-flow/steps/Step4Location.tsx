"use client";

interface Step4LocationProps {
  location: string | null;
  onSelectLocation: (loc: string) => void;
  locations?: string[];
}

export function Step4Location({
  location,
  onSelectLocation,
  locations = [],
}: Step4LocationProps) {
  return (
    <div>
      <p className="text-[#4a6557] mb-5">Choose a verified bio-reserve site for your tree.</p>
      {locations.length === 0 ? (
        <div className="text-center py-10 bg-[#f9fbf9] rounded-2xl border border-[#d4e9dd] space-y-2 px-4">
          <span className="text-3xl">📍</span>
          <p className="text-sm font-semibold text-[#173324]">No verified bio-reserve sites registered yet</p>
          <p className="text-xs text-[#52796f] max-w-xs mx-auto">
            You can enter your custom bio-reserve zone below, or add locations via the Admin console.
          </p>
          <div className="pt-2 max-w-xs mx-auto">
            <input
              type="text"
              placeholder="e.g. Western Ghats Ecological Sanctuary"
              value={location || ""}
              onChange={(e) => onSelectLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4e9dd] bg-white text-xs text-[#173324] outline-none focus:border-[#52b788]"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {locations.map((loc) => (
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
      )}
    </div>
  );
}
