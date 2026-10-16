"use client";

import { useState, useEffect } from "react";
import { Tree, TreeCategory } from "@/types";
import { treeVarietyService, BackendTreeVariety } from "@/services/tree-varieties/tree-variety.service";
import { TreeCard } from "./TreeCard";

export interface ExploreTreesProps {
  openPlant: () => void;
}

export function ExploreTrees({ openPlant }: ExploreTreesProps) {
  const [active, setActive] = useState<TreeCategory>("All");
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  const cats: TreeCategory[] = [
    "All",
    "Fruit Trees",
    "Native Trees",
    "Timber Trees",
    "Medicinal",
    "Shade Trees",
    "Occasion",
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadTreeVarieties() {
      try {
        setLoading(true);
        const res = await treeVarietyService.getAll({ limit: 50 });
        if (isMounted && res.data?.items) {
          const mapped: Tree[] = res.data.items.map((v: BackendTreeVariety) => ({
            id: v.id,
            name: v.commonName,
            sci: v.scientificName,
            category: v.category as TreeCategory,
            price: v.price,
            location: v.location || "Western Ghats, Maharashtra",
            growth: v.growthTimeline,
            img:
              v.coverImages?.[0] ||
              "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
            desc: v.description,
            co2AbsorptionRateKgYear: v.co2AbsorptionRateKgYear,
          }));
          setTrees(mapped);
        }
      } catch (err) {
        console.error("Failed to load tree varieties from database:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTreeVarieties();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = active === "All" ? trees : trees.filter((t) => t.category === active);

  return (
    <section id="trees" className="py-28" style={{ background: "var(--color-cream)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[#2d6a4f] text-sm font-semibold tracking-widest uppercase mb-3">
            Choose Your Tree
          </p>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[#173324] text-4xl md:text-5xl mb-4"
          >
            Our Tree Marketplace
          </h2>
          <p className="text-[#4a6557] max-w-lg mx-auto">
            Every tree tells a different story. Direct from certified organic nurseries.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: active === c ? "linear-gradient(135deg,#2d6a4f,#173324)" : "#fff",
                color: active === c ? "#fff" : "#4a6557",
                boxShadow:
                  active === c
                    ? "0 4px 12px rgba(45,106,79,0.3)"
                    : "0 1px 4px rgba(23,51,36,0.1)",
                border: active === c ? "none" : "1px solid #d4e9dd",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl overflow-hidden bg-white p-5 animate-pulse border border-[#e2eae5]"
              >
                <div className="w-full h-48 bg-emerald-50 rounded-xl mb-4"></div>
                <div className="h-5 bg-emerald-50 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-emerald-50 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-emerald-50 rounded w-full mb-2"></div>
                <div className="h-3 bg-emerald-50 rounded w-4/5 mb-6"></div>
                <div className="h-10 bg-emerald-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : trees.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-[#d4e9dd] max-w-md mx-auto px-6">
            <span className="text-4xl">🌱</span>
            <h3 className="text-lg font-bold text-[#173324] mt-3">No Tree Varieties in Catalog Yet</h3>
            <p className="text-xs text-[#4a6557] mt-1 leading-relaxed">
              No botanical species have been registered yet. Add tree species through the Admin Dashboard to start offering trees for adoption.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-xs rounded-3xl border border-[#d4e9dd] max-w-md mx-auto">
            <span className="text-4xl">🌱</span>
            <h3 className="text-lg font-bold text-[#173324] mt-3">No Trees in this Category</h3>
            <p className="text-xs text-[#4a6557] mt-1">Select another category or explore all available species.</p>
            <button
              onClick={() => setActive("All")}
              className="mt-4 px-4 py-2 bg-[#2d6a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#173324] transition-all cursor-pointer"
            >
              Show All Trees
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tree) => (
              <TreeCard key={tree.id} tree={tree} onPlant={openPlant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
