"use client";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AddPlanModal({ isOpen, onClose, onSubmit }: AddPlanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>
        <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mb-1">
          Add Adoption Plan
        </h3>
        <p className="text-xs text-[#55695d] mb-4">Create a new adoption tier or occasion dedication plan.</p>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Plan Label</label>
              <input
                name="label"
                type="text"
                required
                placeholder="e.g. Wedding Roots Plan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Icon Emoji</label>
              <input
                name="icon"
                type="text"
                required
                defaultValue="💍"
                className="w-full px-3 py-2.5 text-center text-base rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Price Modifier (₹)</label>
              <input
                name="price"
                type="number"
                required
                defaultValue={150}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Badge Title</label>
              <input
                name="badge"
                type="text"
                required
                defaultValue="Occasion"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Description</label>
            <textarea
              name="desc"
              rows={2}
              required
              placeholder="Commemorate milestones with companion saplings..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] transition-all cursor-pointer"
            >
              Save Adoption Plan
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
