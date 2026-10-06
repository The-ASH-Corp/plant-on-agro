import { Tree } from "@/types";

interface TreeCardProps {
  tree: Tree;
  onPlant: () => void;
}

export function TreeCard({ tree, onPlant }: TreeCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
      style={{ background: "#fff", boxShadow: "0 2px 20px rgba(23,51,36,0.08)" }}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={tree.img}
          alt={tree.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(23,51,36,0.75)", color: "#95d5b2", backdropFilter: "blur(6px)" }}
          >
            {tree.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#173324] text-base">{tree.name}</h3>
          <span className="text-[#2d6a4f] font-bold text-sm whitespace-nowrap">₹{tree.price}</span>
        </div>
        <p className="text-[#4a6557] text-xs italic mb-3">{tree.sci}</p>
        <p className="text-[#5a6b62] text-sm leading-relaxed mb-4 line-clamp-2">{tree.desc}</p>
        <div className="flex items-center gap-1 text-xs text-[#6b8070] mb-4">
          <span>📍</span> {tree.location}
          <span className="ml-auto">📈 {tree.growth}</span>
        </div>
        <button
          onClick={onPlant}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg,#2d6a4f,#173324)", color: "#fff" }}
        >
          Plant This Tree
        </button>
      </div>
    </div>
  );
}
