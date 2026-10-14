"use client";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AddLocationModal({
  isOpen,
  onClose,
  onSubmit,
}: AddLocationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mb-1">
          Add Plantation Location
        </h3>
        <p className="text-xs text-[#55695d] mb-4">Register a new geotagged agroforestry reserve or farmer partner parcel.</p>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Reserve Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="e.g. Wayanad Rain Bio-Reserve"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Region / State</label>
              <input
                name="region"
                type="text"
                required
                placeholder="e.g. Wayanad, Kerala"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">GPS Coordinates</label>
              <input
                name="gps"
                type="text"
                required
                placeholder="e.g. 11.6854° N, 76.1320° E"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Area (Hectares)</label>
              <input
                name="areaHectares"
                type="number"
                required
                defaultValue={20}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Sapling Capacity</label>
              <input
                name="capacity"
                type="number"
                required
                defaultValue={8000}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Soil Profile & pH</label>
              <input
                name="soilHealth"
                type="text"
                required
                placeholder="e.g. Humus Loam (pH 6.5, Moisture 40%)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Cover Photo URL</label>
            <input
              name="image"
              type="url"
              defaultValue="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] transition-all cursor-pointer"
            >
              Save & Geotag Location
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
