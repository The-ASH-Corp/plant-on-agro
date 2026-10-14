"use client";

import { AdminTabType, AdoptionOrder, PlantationLocationItem } from "../types";

interface OverviewTabProps {
  locations: PlantationLocationItem[];
  orders: AdoptionOrder[];
  setActiveTab: (tab: AdminTabType) => void;
  onSelectOrder: (order: AdoptionOrder) => void;
}

export function OverviewTab({
  locations,
  orders,
  setActiveTab,
  onSelectOrder,
}: OverviewTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Executive Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173324] via-[#1c402d] to-[#0f241a] text-white p-6 sm:p-8 shadow-lg border border-emerald-900/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Plantation Operations Active</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-4xl font-normal leading-tight">
            Plantation Operations Matrix
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
            Real-time tree adoption audits, certified carbon offset verification, reserve monitoring, and botanical nursery stock.
          </p>
        </div>

        {/* Decorative Glowing Circles in Hero */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                Total Trees Planted
              </span>
              <h3 className="text-3xl font-extrabold text-[#173324] mt-1 tracking-tight">35,822</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-xl border border-emerald-100">
              🌳
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span>↑ 18.4%</span>
              <span className="text-[#7a8a80] font-normal">vs last month</span>
            </span>
            <button onClick={() => setActiveTab("trees")} className="text-[#1b7a43] font-semibold hover:underline cursor-pointer">
              Catalog →
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                Active Bio-Reserves
              </span>
              <h3 className="text-3xl font-extrabold text-[#173324] mt-1 tracking-tight">
                {locations.length} <span className="text-base font-medium text-[#7a8a80]">Zones</span>
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-xl border border-emerald-100">
              📍
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">121 Hectares Polled</span>
            <button onClick={() => setActiveTab("locations")} className="text-[#1b7a43] font-semibold hover:underline cursor-pointer">
              Reserves →
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                CO2 Offset Ledger
              </span>
              <h3 className="text-3xl font-extrabold text-[#173324] mt-1 tracking-tight">
                924.6 <span className="text-base font-medium text-[#7a8a80]">Tons</span>
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-xl border border-emerald-100">
              ☁️
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">Polygon Verified</span>
            <button onClick={() => setActiveTab("orders")} className="text-[#1b7a43] font-semibold hover:underline cursor-pointer">
              Orders →
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                Gross Adoptions
              </span>
              <h3 className="text-3xl font-extrabold text-[#173324] mt-1 tracking-tight">₹1.84M</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-xl border border-emerald-100">
              💼
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">98.8% Survival</span>
            <button onClick={() => setActiveTab("orders")} className="text-[#1b7a43] font-semibold hover:underline cursor-pointer">
              Orders →
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Environmental Telemetry Grid */}
      <div className="p-6 rounded-3xl bg-white border border-[#e2eae5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-semibold text-[#173324]">
              Living Bio-Reserve Environmental Health
            </h2>
            <p className="text-xs text-[#73877b]">Automated multispectral reserve canopy and soil metrics</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            🟢 Optimal Growing Conditions
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e5ebe7]">
            <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">NDVI Canopy Index</span>
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">0.86 / 1.0</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Dense Chlorophyll Canopy</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e5ebe7]">
            <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">Soil Moisture Avg</span>
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">36.4%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Ideal Root Hydration</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e5ebe7]">
            <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">Mean Soil pH</span>
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">6.8</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Neutral Volcanic Loam</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e5ebe7]">
            <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">Sunlight Exposure</span>
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">8.4 hrs</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Healthy Photoperiod</span>
          </div>
        </div>
      </div>

      {/* Split Content: Recent Verified Orders & Reserve Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#e2eae5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-base font-semibold text-[#173324]">
                Recent Adoption Audits
              </h3>
              <p className="text-xs text-[#73877b]">Live buyer orders tagged with coordinates</p>
            </div>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-xs font-semibold text-[#1b7a43] hover:underline cursor-pointer"
            >
              View All Orders ({orders.length}) →
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="p-3.5 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] flex items-center justify-between hover:bg-[#f0f5f2] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/60 text-[#1b7a43] flex items-center justify-center font-bold text-base">
                    🌳
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#173324]">{order.treeSpecies}</span>
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.orderNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#73877b]">
                      Adopted by {order.adopterName} • {order.reserveName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#173324] block">₹{order.totalAmount}</span>
                  <span className="text-[10px] font-semibold text-emerald-600">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1 Col: Reserve Capacity Allocation */}
        <div className="p-6 rounded-3xl bg-white border border-[#e2eae5] shadow-xs space-y-4">
          <div>
            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-base font-semibold text-[#173324]">
              Sanctuary Fill Status
            </h3>
            <p className="text-xs text-[#73877b]">Trees planted vs capacity</p>
          </div>

          <div className="space-y-4">
            {locations.slice(0, 4).map((loc) => {
              const pct = Math.round((loc.treesPlanted / loc.capacity) * 100);
              return (
                <div key={loc.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#173324] truncate max-w-[150px]">{loc.name}</span>
                    <span className="text-[#73877b] font-mono text-[11px]">
                      {loc.treesPlanted.toLocaleString()} / {loc.capacity.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#eef3f0] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#2d6a4f] to-[#52b788] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab("locations")}
            className="w-full mt-2 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-[#1b7a43] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer text-center block"
          >
            Manage All {locations.length} Reserves →
          </button>
        </div>
      </div>
    </div>
  );
}
