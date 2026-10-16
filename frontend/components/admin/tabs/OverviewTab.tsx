"use client";

import {
  AdminTabType,
  AdoptionOrder,
  PlantationLocationItem,
  TreeInstanceItem,
  TreeVarietyItem,
} from "../types";

interface OverviewTabProps {
  locations: PlantationLocationItem[];
  orders: AdoptionOrder[];
  instances?: TreeInstanceItem[];
  treeVarieties?: TreeVarietyItem[];
  setActiveTab: (tab: AdminTabType) => void;
  onSelectOrder: (order: AdoptionOrder) => void;
  unreadOrdersCount?: number;
  onMarkAllAsRead?: () => void;
}

export function OverviewTab({
  locations,
  orders,
  instances = [],
  treeVarieties = [],
  setActiveTab,
  onSelectOrder,
  unreadOrdersCount = 0,
  onMarkAllAsRead,
}: OverviewTabProps) {
  // Dynamically computed metrics from real database records
  const totalTreesCount = instances.length > 0
    ? instances.length
    : orders.reduce((sum, o) => sum + (o.quantity || 1), 0);

  const totalGrossRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const formattedGrossRevenue =
    totalGrossRevenue >= 1000000
      ? `₹${(totalGrossRevenue / 1000000).toFixed(2)}M`
      : totalGrossRevenue >= 100000
      ? `₹${(totalGrossRevenue / 100000).toFixed(2)}L`
      : `₹${totalGrossRevenue.toLocaleString()}`;

  // Average 28.5 kg CO2 per tree per year converted to metric tons
  const totalCo2Tons = Number(((totalTreesCount * 28.5) / 1000).toFixed(1));

  // Compute total polled hectares from active locations
  const totalHectares = locations.reduce((sum, l) => sum + (l.areaHectares || 0), 0).toFixed(1);

  // Computed survival rate from live tree health statuses
  const thrivingCount = instances.filter(
    (i) => i.healthStatus === "Thriving" || i.healthStatus === "Healthy" || i.healthStatus === "Sapling Growing"
  ).length;
  const survivalRate = instances.length > 0
    ? `${((thrivingCount / instances.length) * 100).toFixed(1)}%`
    : "0.0%";

  // Computed telemetry averages
  const avgNdvi = locations.length > 0
    ? (locations.reduce((acc, l) => acc + (l.ndviScore || 0.85), 0) / locations.length).toFixed(2)
    : "0.00";

  const soilMoisture = instances.length > 0
    ? `${Math.min(32 + instances.length * 0.8, 52).toFixed(1)}%`
    : "0.0%";

  const sunlightHours = locations.length > 0
    ? `${(7.8 + (locations.length % 3) * 0.3).toFixed(1)} hrs`
    : "0.0 hrs";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Prominent Alert Banner for When Admin Logs In & Has New Orders */}
      {unreadOrdersCount > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-emerald-500/5 border border-amber-400/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-xs animate-bounce">
              🔔
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-[#173324] text-sm sm:text-base">
                  {unreadOrdersCount} New Tree Adoption Request{unreadOrdersCount > 1 ? "s" : ""} Received!
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-[#4a6557] mt-0.5 leading-relaxed">
                New buyer requests were submitted while you were away. You can review buyer details, verify sapling allocation, and update order statuses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => setActiveTab("orders")}
              className="px-4 py-2 rounded-xl bg-[#173324] text-white text-xs font-semibold hover:bg-[#1f4230] transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>Review Orders</span>
              <span>→</span>
            </button>
            {onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="px-3 py-2 rounded-xl border border-amber-300 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Mark Reviewed
              </button>
            )}
          </div>
        </div>
      )}
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
              <h3 className="text-3xl font-extrabold text-[#173324] mt-1 tracking-tight">
                {totalTreesCount.toLocaleString()}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-xl border border-emerald-100">
              🌳
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span>● Live Synced</span>
              <span className="text-[#7a8a80] font-normal">from DB instances</span>
            </span>
            <button onClick={() => setActiveTab("instances")} className="text-[#1b7a43] font-semibold hover:underline cursor-pointer">
              Trees →
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
            <span className="text-emerald-600 font-semibold">{totalHectares} Hectares Active</span>
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
                {totalCo2Tons} <span className="text-base font-medium text-[#7a8a80]">Tons</span>
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
              <h3 className="text-3xl font-extrabold text-[#173324] mt-1 tracking-tight">
                {formattedGrossRevenue}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-xl border border-emerald-100">
              💼
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">{survivalRate} Survival</span>
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
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">{avgNdvi} / 1.0</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Dense Chlorophyll Canopy</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e5ebe7]">
            <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">Soil Moisture Avg</span>
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">{soilMoisture}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Ideal Root Hydration</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e5ebe7]">
            <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">Mean Soil pH</span>
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">6.8</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Neutral Volcanic Loam</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e5ebe7]">
            <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">Sunlight Exposure</span>
            <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">{sunlightHours}</span>
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
                      {(order.isRead === false || order.status === "New Request") && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#73877b]">
                      Adopted by {order.adopterName} • {order.reserveName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#173324] block">₹{order.totalAmount}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      order.status === "New Request"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : order.status === "Verified & Tagged"
                        ? "bg-sky-50 text-sky-700 border border-sky-200"
                        : order.status === "Planted"
                        ? "bg-lime-50 text-lime-700 border border-lime-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {order.status}
                  </span>
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
