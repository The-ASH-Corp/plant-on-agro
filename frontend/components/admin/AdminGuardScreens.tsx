import Link from "next/link";

export function AdminLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1f15] text-white p-6">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl animate-pulse mb-4">
        🌱
      </div>
      <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold mb-2 text-emerald-100">
        PlantOn Agro Operations
      </h2>
      <p className="text-sm text-emerald-300/80">Connecting to secure console...</p>
    </div>
  );
}

export function AdminUnauthorizedScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1f15] text-white p-6">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl mb-4">
        🔒
      </div>
      <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-semibold mb-2 text-emerald-100">
        PlantOn Agro Security Guard
      </h2>
      <p className="text-sm text-emerald-300/80 mb-6">Administrator session required.</p>
      <Link
        href="/login"
        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold tracking-wide text-white transition-all shadow-md"
      >
        Go to Admin Login →
      </Link>
    </div>
  );
}
