"use client";

import { useState } from "react";
import { TreeCategory } from "@/types";
import { TREES } from "@/data/mockData";
import { TreeCard } from "@/components/TreeCard";

interface ExploreTreesProps {
  openPlant: () => void;
}

export function ExploreTrees({ openPlant }: ExploreTreesProps) {
  const [active, setActive] = useState<TreeCategory>("All");
  const cats: TreeCategory[] = [
    "All",
    "Fruit Trees",
    "Native Trees",
    "Timber Trees",
    "Medicinal",
    "Shade Trees",
    "Occasion",
  ];
  const filtered = active === "All" ? TREES : TREES.filter((t) => t.category === active);

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
            Every tree tells a different story. Find yours.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tree) => (
            <TreeCard key={tree.id} tree={tree} onPlant={openPlant} />
          ))}
        </div>
      </div>
    </section>
  );
}
