"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";

// Tree Variety Interface & Initial Data
export interface TreeVarietyItem {
  id: string;
  name: string;
  sci: string;
  category: "Fruit Trees" | "Timber Trees" | "Medicinal" | "Native Trees" | "Shade Trees" | "Occasion";
  price: number;
  location: string;
  growth: string;
  img: string;
  desc: string;
  co2PerYearKg: number;
}

const INITIAL_TREES: TreeVarietyItem[] = [
  {
    id: "tree-1",
    name: "Indian Mango",
    sci: "Mangifera indica",
    category: "Fruit Trees",
    price: 299,
    location: "Nashik, Maharashtra",
    growth: "10–15 m in 5 years",
    img: "https://images.unsplash.com/photo-1685429631345-3de21cc2eb65?w=600&h=400&fit=crop&auto=format",
    desc: "A beloved tropical tree that bears sweet fruits and provides generous shade.",
    co2PerYearKg: 22,
  },
  {
    id: "tree-2",
    name: "Neem Tree",
    sci: "Azadirachta indica",
    category: "Medicinal",
    price: 199,
    location: "Pune, Maharashtra",
    growth: "8–12 m in 5 years",
    img: "https://images.unsplash.com/photo-1621872111378-4f8340e9cb90?w=600&h=400&fit=crop&auto=format",
    desc: "Sacred to Indian culture, neem purifies air and has centuries of medicinal use.",
    co2PerYearKg: 30,
  },
  {
    id: "tree-3",
    name: "Teakwood",
    sci: "Tectona grandis",
    category: "Timber Trees",
    price: 499,
    location: "Satara, Maharashtra",
    growth: "20–30 m mature height",
    img: "https://images.unsplash.com/photo-1568241640298-1adf2974314c?w=600&h=400&fit=crop&auto=format",
    desc: "India's finest timber tree — a long-term investment in forests and futures.",
    co2PerYearKg: 45,
  },
  {
    id: "tree-4",
    name: "Peepal (Sacred Fig)",
    sci: "Ficus religiosa",
    category: "Native Trees",
    price: 249,
    location: "Aurangabad, Maharashtra",
    growth: "15–25 m mature height",
    img: "https://images.unsplash.com/photo-1693907610163-08bece4af99e?w=600&h=400&fit=crop&auto=format",
    desc: "The sacred fig — one of the world's longest-living trees, revered across cultures.",
    co2PerYearKg: 40,
  },
  {
    id: "tree-5",
    name: "Gulmohar",
    sci: "Delonix regia",
    category: "Shade Trees",
    price: 349,
    location: "Nagpur, Maharashtra",
    growth: "12–18 m in 6 years",
    img: "https://images.unsplash.com/photo-1527701963793-33e969bca5ee?w=600&h=400&fit=crop&auto=format",
    desc: "A flamboyant canopy tree with vivid orange blooms — a gift of colour and shade.",
    co2PerYearKg: 28,
  },
  {
    id: "tree-6",
    name: "Birthday Ashoka",
    sci: "Saraca asoca",
    category: "Occasion",
    price: 599,
    location: "Western Ghats, Maharashtra",
    growth: "6–9 m in 5 years",
    img: "https://images.unsplash.com/photo-1712342109846-a8fcb1c883ba?w=600&h=400&fit=crop&auto=format",
    desc: "Plant a tree on your special day. The Ashoka symbolises joy, prosperity, and love.",
    co2PerYearKg: 18,
  },
  {
    id: "tree-7",
    name: "Red Sandalwood",
    sci: "Pterocarpus santalinus",
    category: "Native Trees",
    price: 699,
    location: "Kolhapur Border, Maharashtra",
    growth: "8–11 m in 10 years",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&auto=format",
    desc: "Endemic to southern India, highly prized for dense heartwood and conservation.",
    co2PerYearKg: 35,
  },
];

// Plan Interface & Initial Data
export interface AdoptionPlanItem {
  id: string;
  label: string;
  icon: string;
  desc: string;
  price: number;
  badge: string;
  activeCount: number;
}

const INITIAL_PLANS: AdoptionPlanItem[] = [
  {
    id: "individual",
    label: "Individual Impact",
    icon: "🌱",
    desc: "Perfect for personal tree adoption and individual carbon footprint offset.",
    price: 0,
    badge: "Most Popular",
    activeCount: 1420,
  },
  {
    id: "student",
    label: "Student Green Pass",
    icon: "📚",
    desc: "Subsidized pricing for learners, university green clubs, and young botanists.",
    price: -50,
    badge: "Discounted",
    activeCount: 680,
  },
  {
    id: "family",
    label: "Family Living Grove",
    icon: "🏡",
    desc: "Plant together, grow together. Shared family dashboard and collective impact tracker.",
    price: 0,
    badge: "Multi-User",
    activeCount: 910,
  },
  {
    id: "birthday",
    label: "Birthday Tree Gift",
    icon: "🎂",
    desc: "Celebrate birthdays with a living gift, customized digital greeting, and GPS tag.",
    price: 100,
    badge: "Occasion",
    activeCount: 520,
  },
  {
    id: "memorial",
    label: "Memorial Tree Tribute",
    icon: "🕊️",
    desc: "Honour the memory of loved ones with a permanent living grove in protected reserves.",
    price: 100,
    badge: "Memorial",
    activeCount: 340,
  },
  {
    id: "anniversary",
    label: "Anniversary Roots",
    icon: "💑",
    desc: "Mark love and partnership milestones with companion trees planted side-by-side.",
    price: 100,
    badge: "Milestone",
    activeCount: 290,
  },
  {
    id: "corporate",
    label: "Corporate CSR ESG",
    icon: "🏢",
    desc: "Bulk agroforestry planting with auditable Polygon carbon credits and ESG reports.",
    price: 0,
    badge: "Enterprise",
    activeCount: 85,
  },
];

// Location Interface & Initial Data
export interface PlantationLocationItem {
  id: string;
  name: string;
  region: string;
  gps: string;
  areaHectares: number;
  capacity: number;
  treesPlanted: number;
  survivalRate: string;
  ndviScore: number;
  soilHealth: string;
  image: string;
  status: "Active" | "Expanding" | "Survey Phase";
}

const INITIAL_LOCATIONS: PlantationLocationItem[] = [
  {
    id: "loc-1",
    name: "Western Ghats Bio-Sanctuary",
    region: "Kolhapur Border, Maharashtra",
    gps: "15.3173° N, 74.1240° E",
    areaHectares: 24,
    capacity: 10000,
    treesPlanted: 8420,
    survivalRate: "99.1%",
    ndviScore: 0.88,
    soilHealth: "Laterite Red Soil (pH 6.4, Moisture 38%)",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
    status: "Active",
  },
  {
    id: "loc-2",
    name: "Nashik Agro-Forestry Valley",
    region: "Godavari River Basin, Nashik",
    gps: "19.9975° N, 73.7898° E",
    areaHectares: 18,
    capacity: 7500,
    treesPlanted: 6150,
    survivalRate: "98.7%",
    ndviScore: 0.84,
    soilHealth: "Volcanic Loam (pH 6.8, Moisture 34%)",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop&auto=format",
    status: "Active",
  },
  {
    id: "loc-3",
    name: "Satara High-Timber Plateau",
    region: "Koyna Valley Ridge, Satara",
    gps: "17.6805° N, 74.0183° E",
    areaHectares: 35,
    capacity: 12000,
    treesPlanted: 9210,
    survivalRate: "97.9%",
    ndviScore: 0.91,
    soilHealth: "Laterite Clay Loam (pH 6.2, Moisture 42%)",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=400&fit=crop&auto=format",
    status: "Active",
  },
  {
    id: "loc-4",
    name: "Nagpur Agro-Canopy Corridor",
    region: "Pench Tiger Buffer Zone, Nagpur",
    gps: "21.1458° N, 79.0882° E",
    areaHectares: 15,
    capacity: 6000,
    treesPlanted: 4712,
    survivalRate: "98.4%",
    ndviScore: 0.81,
    soilHealth: "Deep Black Cotton Soil (pH 7.1, Moisture 31%)",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&h=400&fit=crop&auto=format",
    status: "Expanding",
  },
  {
    id: "loc-5",
    name: "Pune Eco-Hills Sanctuary",
    region: "Sinhagad Foothills, Pune",
    gps: "18.5204° N, 73.8567° E",
    areaHectares: 12,
    capacity: 5000,
    treesPlanted: 3120,
    survivalRate: "98.9%",
    ndviScore: 0.85,
    soilHealth: "Rocky Mountain Loam (pH 6.5, Moisture 35%)",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop&auto=format",
    status: "Active",
  },
  {
    id: "loc-6",
    name: "Aurangabad Green Belt",
    region: "Ellora Foothills, Chhatrapati Sambhajinagar",
    gps: "19.8762° N, 75.3433° E",
    areaHectares: 20,
    capacity: 8000,
    treesPlanted: 4200,
    survivalRate: "97.5%",
    ndviScore: 0.79,
    soilHealth: "Semi-Arid Loam (pH 7.3, Moisture 28%)",
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&h=400&fit=crop&auto=format",
    status: "Active",
  },
];

// Adoption Order Interface & Data
interface AdoptionOrder {
  id: string;
  orderNumber: string;
  adopterName: string;
  adopterEmail: string;
  treeSpecies: string;
  scientificName: string;
  category: string;
  reserveName: string;
  gpsCoords: string;
  planType: string;
  quantity: number;
  totalAmount: number;
  datePlanted: string;
  status: "Verified & Tagged" | "Planted" | "Pending Drone Scan" | "Certificate Issued";
  certificateId: string;
  ndviScore: number;
}

const INITIAL_ORDERS: AdoptionOrder[] = [
  {
    id: "ord-1",
    orderNumber: "POA-9821",
    adopterName: "Priya Sharma",
    adopterEmail: "priya.sharma@example.com",
    treeSpecies: "Indian Mango",
    scientificName: "Mangifera indica",
    category: "Fruit Trees",
    reserveName: "Nashik Agro-Forestry Valley",
    gpsCoords: "19.9975° N, 73.7898° E",
    planType: "Family Living Grove (3x)",
    quantity: 3,
    totalAmount: 897,
    datePlanted: "Today, 11:42 AM",
    status: "Verified & Tagged",
    certificateId: "CERT-NSH-09821",
    ndviScore: 0.86,
  },
  {
    id: "ord-2",
    orderNumber: "POA-9820",
    adopterName: "Aarav Patel",
    adopterEmail: "aarav.patel.1791886589@example.com",
    treeSpecies: "Teakwood",
    scientificName: "Tectona grandis",
    category: "Timber Trees",
    reserveName: "Satara High-Timber Plateau",
    gpsCoords: "17.6805° N, 74.0183° E",
    planType: "Individual Impact",
    quantity: 2,
    totalAmount: 998,
    datePlanted: "Today, 09:15 AM",
    status: "Certificate Issued",
    certificateId: "CERT-STR-09820",
    ndviScore: 0.89,
  },
  {
    id: "ord-3",
    orderNumber: "POA-9819",
    adopterName: "Diya Sharma",
    adopterEmail: "diya.sharma.1791886678@example.com",
    treeSpecies: "Neem Tree",
    scientificName: "Azadirachta indica",
    category: "Medicinal",
    reserveName: "Western Ghats Bio-Sanctuary",
    gpsCoords: "15.3173° N, 74.1240° E",
    planType: "Birthday Tree Gift",
    quantity: 1,
    totalAmount: 299,
    datePlanted: "Yesterday, 04:30 PM",
    status: "Verified & Tagged",
    certificateId: "CERT-WGH-09819",
    ndviScore: 0.82,
  },
  {
    id: "ord-4",
    orderNumber: "POA-9818",
    adopterName: "Vikram Malhotra",
    adopterEmail: "v.malhotra@techcorp.in",
    treeSpecies: "Peepal (Sacred Fig)",
    scientificName: "Ficus religiosa",
    category: "Native Trees",
    reserveName: "Aurangabad Green Belt",
    gpsCoords: "19.8762° N, 75.3433° E",
    planType: "Corporate CSR ESG",
    quantity: 25,
    totalAmount: 6225,
    datePlanted: "Yesterday, 02:10 PM",
    status: "Certificate Issued",
    certificateId: "CERT-AUR-09818",
    ndviScore: 0.91,
  },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "trees" | "plans" | "locations" | "orders" | "telemetry">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("30D");

  // Dynamic Lists State
  const [trees, setTrees] = useState<TreeVarietyItem[]>(INITIAL_TREES);
  const [plans, setPlans] = useState<AdoptionPlanItem[]>(INITIAL_PLANS);
  const [locations, setLocations] = useState<PlantationLocationItem[]>(INITIAL_LOCATIONS);
  const [orders] = useState<AdoptionOrder[]>(INITIAL_ORDERS);

  // Modals State
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdoptionOrder | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Store
  const user = useHydratedStore(useAuthStore, (s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Filtered Trees
  const filteredTrees = useMemo(() => {
    return trees.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sci.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trees, searchQuery]);

  // Filtered Plans
  const filteredPlans = useMemo(() => {
    return plans.filter((p) =>
      p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [plans, searchQuery]);

  // Filtered Locations
  const filteredLocations = useMemo(() => {
    return locations.filter((l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.gps.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  // Add Tree Handler
  const handleCreateTree = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newTree: TreeVarietyItem = {
      id: "tree-" + (trees.length + 1),
      name: (fd.get("name") as string).trim(),
      sci: (fd.get("sci") as string).trim(),
      category: fd.get("category") as TreeVarietyItem["category"],
      price: Number(fd.get("price")),
      location: (fd.get("location") as string).trim(),
      growth: (fd.get("growth") as string).trim(),
      img: (fd.get("img") as string).trim() || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
      desc: (fd.get("desc") as string).trim(),
      co2PerYearKg: Number(fd.get("co2PerYearKg")) || 25,
    };

    setTrees([newTree, ...trees]);
    setShowAddTreeModal(false);
    showToast(`Added tree variety: "${newTree.name}" successfully!`);
    setActiveTab("trees");
  };

  // Add Plan Handler
  const handleCreatePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPlan: AdoptionPlanItem = {
      id: "plan-" + (plans.length + 1),
      label: (fd.get("label") as string).trim(),
      icon: (fd.get("icon") as string).trim() || "🌱",
      desc: (fd.get("desc") as string).trim(),
      price: Number(fd.get("price")),
      badge: (fd.get("badge") as string).trim() || "New Plan",
      activeCount: 0,
    };

    setPlans([...plans, newPlan]);
    setShowAddPlanModal(false);
    showToast(`Added adoption plan: "${newPlan.label}" successfully!`);
    setActiveTab("plans");
  };

  // Add Location Handler
  const handleCreateLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newLoc: PlantationLocationItem = {
      id: "loc-" + (locations.length + 1),
      name: (fd.get("name") as string).trim(),
      region: (fd.get("region") as string).trim(),
      gps: (fd.get("gps") as string).trim(),
      areaHectares: Number(fd.get("areaHectares")),
      capacity: Number(fd.get("capacity")),
      treesPlanted: 0,
      survivalRate: "100%",
      ndviScore: 0.85,
      soilHealth: (fd.get("soilHealth") as string).trim(),
      image: (fd.get("image") as string).trim() || "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop&auto=format",
      status: "Active",
    };

    setLocations([newLoc, ...locations]);
    setShowAddLocationModal(false);
    showToast(`Registered new location: "${newLoc.name}" with telemetry!`);
    setActiveTab("locations");
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1c1c1c] flex flex-col antialiased">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#173324] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#52b788] flex items-center gap-3 animate-fadeIn">
          <span className="text-xl">🌿</span>
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Brand Bar */}
      <header className="sticky top-0 z-40 bg-[#173324] text-white border-b border-[#2d6a4f]/40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Console Tag */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src={Logo}
                alt="PlantOnAgro Logo"
                width={140}
                height={40}
                priority
                className="h-9 w-auto object-contain brightness-110"
              />
            </Link>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/20">
              <span className="text-xs font-bold uppercase tracking-widest text-[#95d5b2] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                Admin Console
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#52b788] font-medium bg-[#1e4433] px-2 py-0.5 rounded-full border border-[#2d6a4f]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse" />
                Live Telemetry
              </span>
            </div>
          </div>

          {/* Center: Search Box */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-2">
            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trees, plans, locations, orders..."
                className="w-full bg-[#102619] text-white placeholder-white/40 pl-9 pr-4 py-1.5 rounded-xl text-xs border border-white/10 focus:outline-none focus:border-[#52b788] transition-all"
              />
            </div>
          </div>

          {/* Right: Quick Action Buttons & Profile */}
          <div className="flex items-center gap-2">
            {/* Quick Action: Add Tree */}
            <button
              id="admin-quick-add-tree"
              onClick={() => setShowAddTreeModal(true)}
              className="hidden lg:flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#357c5d] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs border border-[#52b788]/30 transition-all cursor-pointer"
            >
              <span>🌳</span>
              <span>+ Tree</span>
            </button>

            {/* Quick Action: Add Plan */}
            <button
              id="admin-quick-add-plan"
              onClick={() => setShowAddPlanModal(true)}
              className="hidden lg:flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#357c5d] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs border border-[#52b788]/30 transition-all cursor-pointer"
            >
              <span>🌱</span>
              <span>+ Plan</span>
            </button>

            {/* Quick Action: Add Location */}
            <button
              id="admin-quick-add-location"
              onClick={() => setShowAddLocationModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#2d6a4f] to-[#1b7a43] hover:from-[#357c5d] hover:to-[#218e4f] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs border border-[#52b788]/40 transition-all cursor-pointer"
            >
              <span>📍</span>
              <span>+ Location</span>
            </button>

            {/* Storefront Link */}
            <Link
              href="/"
              className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/10 ml-1"
            >
              <span>←</span>
              <span className="hidden sm:inline">Store</span>
            </Link>

            {/* Profile Avatar & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <div className="w-8 h-8 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center font-bold text-xs border border-[#52b788]/40">
                AD
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">
                  {user?.name || "Admin User"}
                </span>
                <span className="text-[10px] text-[#95d5b2]">System Supervisor</span>
              </div>
              <button
                onClick={() => logout()}
                title="Sign out of Admin Console"
                className="text-xs text-red-300 hover:text-red-200 transition-colors p-1.5 rounded hover:bg-white/10 cursor-pointer"
              >
                ⎋
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Welcome & Management Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl sm:text-3xl text-[#173324] font-normal"
              >
                Plantation Operations Center
              </h1>
              <span className="bg-emerald-50 text-[#1b7a43] text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Admin Controls
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#55695d] mt-1">
              Configure tree varieties catalog, adoption plans, GPS forest locations, and real-time orders.
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="admin-btn-add-tree"
              onClick={() => setShowAddTreeModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#173324] text-white hover:bg-[#1e4433] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>🌳</span>
              <span>Add Tree Variety</span>
            </button>

            <button
              id="admin-btn-add-plan"
              onClick={() => setShowAddPlanModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#173324] text-white hover:bg-[#1e4433] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>🌱</span>
              <span>Add Plan</span>
            </button>

            <button
              id="admin-btn-add-loc"
              onClick={() => setShowAddLocationModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[#173324] text-white hover:bg-[#1e4433] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>📍</span>
              <span>Add Location</span>
            </button>
          </div>
        </div>

        {/* 4 Primary KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                  Tree Varieties
                </span>
                <h3 className="text-3xl font-bold text-[#173324] mt-1">
                  {trees.length} <span className="text-sm font-normal text-[#55695d]">Species</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-lg border border-emerald-100">
                🌳
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#f0f4f1] text-xs text-[#10b981] font-semibold flex justify-between">
              <span>Catalog Active</span>
              <button onClick={() => setActiveTab("trees")} className="hover:underline text-[#1b7a43]">
                Manage →
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                  Adoption Plans
                </span>
                <h3 className="text-3xl font-bold text-[#173324] mt-1">
                  {plans.length} <span className="text-sm font-normal text-[#55695d]">Tiers</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg border border-teal-100">
                🌱
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#f0f4f1] text-xs text-[#10b981] font-semibold flex justify-between">
              <span>All Plans Active</span>
              <button onClick={() => setActiveTab("plans")} className="hover:underline text-[#1b7a43]">
                Manage →
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                  Plantation Locations
                </span>
                <h3 className="text-3xl font-bold text-[#173324] mt-1">
                  {locations.length} <span className="text-sm font-normal text-[#55695d]">Reserves</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg border border-amber-100">
                📍
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#f0f4f1] text-xs text-[#10b981] font-semibold flex justify-between">
              <span>100% Geotagged</span>
              <button onClick={() => setActiveTab("locations")} className="hover:underline text-[#1b7a43]">
                Manage →
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7a8a80]">
                  Total Trees Planted
                </span>
                <h3 className="text-3xl font-bold text-[#173324] mt-1">
                  28,492
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1b7a43] flex items-center justify-center text-lg border border-emerald-100">
                🛰️
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#f0f4f1] text-xs text-[#10b981] font-semibold flex justify-between">
              <span>99.1% Survival</span>
              <button onClick={() => setActiveTab("telemetry")} className="hover:underline text-[#1b7a43]">
                Telemetry →
              </button>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#e2eae5] pb-2 text-sm font-semibold overflow-x-auto">
          <button
            id="tab-overview"
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#173324] text-white shadow-xs"
                : "text-[#55695d] hover:text-[#173324] hover:bg-white"
            }`}
          >
            <span>📊</span>
            <span>Live Overview</span>
          </button>

          <button
            id="tab-trees"
            onClick={() => setActiveTab("trees")}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "trees"
                ? "bg-[#173324] text-white shadow-xs"
                : "text-[#55695d] hover:text-[#173324] hover:bg-white"
            }`}
          >
            <span>🌳</span>
            <span>Tree Varieties</span>
            <span className="bg-emerald-100 text-[#1b7a43] text-[11px] px-2 py-0.2 rounded-full font-bold ml-1">
              {trees.length}
            </span>
          </button>

          <button
            id="tab-plans"
            onClick={() => setActiveTab("plans")}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "plans"
                ? "bg-[#173324] text-white shadow-xs"
                : "text-[#55695d] hover:text-[#173324] hover:bg-white"
            }`}
          >
            <span>🌱</span>
            <span>Adoption Plans</span>
            <span className="bg-emerald-100 text-[#1b7a43] text-[11px] px-2 py-0.2 rounded-full font-bold ml-1">
              {plans.length}
            </span>
          </button>

          <button
            id="tab-locations"
            onClick={() => setActiveTab("locations")}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "locations"
                ? "bg-[#173324] text-white shadow-xs"
                : "text-[#55695d] hover:text-[#173324] hover:bg-white"
            }`}
          >
            <span>📍</span>
            <span>Plantation Locations</span>
            <span className="bg-emerald-100 text-[#1b7a43] text-[11px] px-2 py-0.2 rounded-full font-bold ml-1">
              {locations.length}
            </span>
          </button>

          <button
            id="tab-orders"
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-[#173324] text-white shadow-xs"
                : "text-[#55695d] hover:text-[#173324] hover:bg-white"
            }`}
          >
            <span>🛒</span>
            <span>Orders Ledger</span>
            <span className="bg-emerald-100 text-[#1b7a43] text-[11px] px-2 py-0.2 rounded-full font-bold ml-1">
              {orders.length}
            </span>
          </button>

          <button
            id="tab-telemetry"
            onClick={() => setActiveTab("telemetry")}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "telemetry"
                ? "bg-[#173324] text-white shadow-xs"
                : "text-[#55695d] hover:text-[#173324] hover:bg-white"
            }`}
          >
            <span>📡</span>
            <span>Drone Telemetry</span>
          </button>
        </div>

        {/* TAB 1: LIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Preview */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2eae5] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-[#173324] font-semibold text-lg">Recent Tree Adoptions</h2>
                    <p className="text-xs text-[#55695d]">Live buyer orders and CSR partner dedications</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-[#1b7a43] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all orders</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#eef3f0] text-[#7a8a80] font-semibold uppercase tracking-wider text-[10px]">
                        <th className="pb-2.5">Order</th>
                        <th className="pb-2.5">Adopter</th>
                        <th className="pb-2.5">Species</th>
                        <th className="pb-2.5">Reserve</th>
                        <th className="pb-2.5 text-right">Amount</th>
                        <th className="pb-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f7f5]">
                      {orders.slice(0, 4).map((ord) => (
                        <tr
                          key={ord.id}
                          onClick={() => setSelectedOrder(ord)}
                          className="hover:bg-[#fbfdfc] transition-colors cursor-pointer group"
                        >
                          <td className="py-3 font-mono font-bold text-[#173324] group-hover:text-[#1b7a43]">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3">
                            <span className="font-semibold text-[#173324] block">{ord.adopterName}</span>
                            <span className="text-[10px] text-[#7a8a80] truncate block max-w-[130px]">
                              {ord.adopterEmail}
                            </span>
                          </td>
                          <td className="py-3 text-[#2d3a33]">
                            <span className="font-medium">{ord.treeSpecies}</span>
                            <span className="text-[10px] text-[#7a8a80] block italic">{ord.scientificName}</span>
                          </td>
                          <td className="py-3 text-[#55695d] text-[11px]">{ord.reserveName}</td>
                          <td className="py-3 text-right font-semibold text-[#173324]">
                            ₹{ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3 text-center">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-emerald-50 text-[#1b7a43] border-emerald-200">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Drone & Sensor Widget */}
              <div className="bg-white rounded-2xl border border-[#e2eae5] p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[#173324] font-semibold text-base">Drone Health Sweep</h2>
                    <span className="text-[10px] bg-emerald-100 text-[#1b7a43] px-2 py-0.5 rounded-full font-bold">
                      Sweep #412 Active
                    </span>
                  </div>
                  <p className="text-xs text-[#55695d] mb-4">
                    Autonomous multi-spectral DJI RTK scanning canopy NDVI vigour across Maharashtra plots.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#55695d] font-medium">NDVI Canopy Health</span>
                        <span className="text-[#1b7a43] font-bold">0.86 (High Vigour)</span>
                      </div>
                      <div className="w-full bg-[#e2eae5] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#10b981] h-full rounded-full w-[86%]" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#55695d] font-medium">Soil Moisture (Depth 30cm)</span>
                        <span className="text-[#2d6a4f] font-bold">34% (Optimal)</span>
                      </div>
                      <div className="w-full bg-[#e2eae5] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#2d6a4f] h-full rounded-full w-[68%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs text-[#55695d]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                    Field sensors online
                  </span>
                  <button
                    onClick={() => setActiveTab("telemetry")}
                    className="text-[#1b7a43] font-semibold hover:underline cursor-pointer"
                  >
                    Telemetry Feed →
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Catalog Spotlight */}
            <div className="bg-white rounded-2xl border border-[#e2eae5] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[#173324] font-semibold text-lg">Active Tree Varieties Catalog</h2>
                  <p className="text-xs text-[#55695d]">Available saplings ready for buyer adoption</p>
                </div>
                <button
                  onClick={() => setShowAddTreeModal(true)}
                  className="text-xs bg-[#173324] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1e4433] transition-all cursor-pointer"
                >
                  + Add Tree
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {trees.slice(0, 6).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTab("trees")}
                    className="p-3 rounded-xl bg-[#f7faf8] border border-[#e2eae5] hover:border-[#1b7a43] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border border-[#e2eae5]">
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-bold text-[#173324] line-clamp-1">{t.name}</span>
                    <span className="text-[10px] text-[#1b7a43] font-semibold">₹{t.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TREE VARIETIES MANAGEMENT */}
        {activeTab === "trees" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs">
              <div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324]">
                  Tree Varieties Catalog
                </h2>
                <p className="text-xs sm:text-sm text-[#55695d]">
                  Manage botanical species, adoption pricing, growth metrics, and descriptions
                </p>
              </div>
              <button
                id="btn-add-tree-modal-open"
                onClick={() => setShowAddTreeModal(true)}
                className="bg-[#173324] hover:bg-[#1e4433] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <span>🌳</span>
                <span>+ Add Tree Variety</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrees.map((tree) => (
                <div
                  key={tree.id}
                  className="bg-white rounded-2xl border border-[#e2eae5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={tree.img}
                      alt={tree.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[#95d5b2] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                      {tree.category}
                    </div>
                    <div className="absolute bottom-2.5 left-3 text-white drop-shadow-md">
                      <span className="text-lg font-bold">₹{tree.price}</span>
                      <span className="text-xs text-white/80 ml-1">/ tree</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#173324]">{tree.name}</h3>
                      <p className="text-xs italic text-[#55695d] mb-2">{tree.sci}</p>
                      <p className="text-xs text-[#55695d] leading-relaxed line-clamp-2 mb-3">
                        {tree.desc}
                      </p>

                      <div className="space-y-1.5 text-xs text-[#2d3a33] bg-[#f7faf8] p-3 rounded-xl border border-[#e2eae5]">
                        <div className="flex justify-between">
                          <span className="text-[#7a8a80]">Location:</span>
                          <span className="font-medium text-[#173324]">{tree.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#7a8a80]">Growth Rate:</span>
                          <span className="font-medium text-[#173324]">{tree.growth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#7a8a80]">CO₂ Absorption:</span>
                          <span className="font-bold text-[#10b981]">~{tree.co2PerYearKg} kg/year</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between">
                      <span className="text-[11px] text-[#7a8a80] font-mono">ID: {tree.id}</span>
                      <button
                        onClick={() => showToast(`Tree details for "${tree.name}" are active in catalog!`)}
                        className="text-xs font-semibold text-[#1b7a43] hover:underline cursor-pointer"
                      >
                        Active in Catalog ✓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADOPTION PLANS MANAGEMENT */}
        {activeTab === "plans" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs">
              <div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324]">
                  Adoption Plans & Dedications
                </h2>
                <p className="text-xs sm:text-sm text-[#55695d]">
                  Manage individual, family, birthday, memorial, and CSR enterprise subscription plans
                </p>
              </div>
              <button
                id="btn-add-plan-modal-open"
                onClick={() => setShowAddPlanModal(true)}
                className="bg-[#173324] hover:bg-[#1e4433] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <span>🌱</span>
                <span>+ Add Plan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-[#e2eae5] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center border border-emerald-100">
                        {plan.icon}
                      </div>
                      <span className="text-[11px] font-bold text-[#1b7a43] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {plan.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#173324]">{plan.label}</h3>
                    <p className="text-xs text-[#55695d] mt-1 leading-relaxed mb-4">
                      {plan.desc}
                    </p>

                    <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e2eae5] space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#7a8a80]">Price Modifier:</span>
                        <span className="font-bold text-[#173324]">
                          {plan.price > 0 ? `+₹${plan.price}` : plan.price < 0 ? `-₹${Math.abs(plan.price)} (Discount)` : "Standard (₹0)"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7a8a80]">Active Adopters:</span>
                        <span className="font-semibold text-[#10b981]">{plan.activeCount} Planters</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#7a8a80] font-mono">Plan Key: {plan.id}</span>
                    <span className="text-[#10b981] font-semibold">Active Tier ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PLANTATION LOCATIONS MANAGEMENT */}
        {activeTab === "locations" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#e2eae5] shadow-xs">
              <div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324]">
                  Plantation Locations & Reserves
                </h2>
                <p className="text-xs sm:text-sm text-[#55695d]">
                  Geotagged land parcels with multi-spectral satellite imagery and farmer host partnerships
                </p>
              </div>
              <button
                id="btn-add-loc-modal-open"
                onClick={() => setShowAddLocationModal(true)}
                className="bg-[#173324] hover:bg-[#1e4433] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <span>📍</span>
                <span>+ Add Location</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-2xl border border-[#e2eae5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[#95d5b2] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                      {loc.status}
                    </div>
                    <div className="absolute bottom-2.5 left-3 text-white">
                      <span className="text-xs font-mono font-semibold block drop-shadow-md">
                        📍 {loc.gps}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#173324]">{loc.name}</h3>
                      <p className="text-xs text-[#55695d] mb-3">{loc.region}</p>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                        <div className="p-2 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                          <span className="text-[10px] text-[#7a8a80] block font-bold">Planted</span>
                          <span className="font-bold text-[#173324]">{loc.treesPlanted.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                          <span className="text-[10px] text-[#7a8a80] block font-bold">Capacity</span>
                          <span className="font-bold text-[#173324]">{loc.capacity.toLocaleString()}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                          <span className="text-[10px] text-[#7a8a80] block font-bold">Survival</span>
                          <span className="font-bold text-[#10b981]">{loc.survivalRate}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#f7faf8] border border-[#e2eae5] text-xs text-[#55695d] space-y-1">
                        <div><span className="text-[#7a8a80]">Land Area:</span> <span className="font-semibold text-[#173324]">{loc.areaHectares} Hectares</span></div>
                        <div><span className="text-[#7a8a80]">Soil Profile:</span> <span className="font-semibold text-[#173324]">{loc.soilHealth}</span></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#7a8a80] font-mono">NDVI: {loc.ndviScore}</span>
                      <button
                        onClick={() => showToast(`GIS telemetry sweep active for ${loc.name}`)}
                        className="text-xs font-semibold text-[#1b7a43] hover:underline cursor-pointer"
                      >
                        View Telemetry →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS LEDGER */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-[#e2eae5] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324]">
                  Adoption Orders Ledger
                </h2>
                <p className="text-xs text-[#55695d]">
                  Showing {orders.length} registered adoption transactions
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#eef3f0] text-[#7a8a80] font-semibold uppercase tracking-wider text-[10px] bg-[#fbfdfc]">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Adopter</th>
                    <th className="py-3 px-3">Tree Species</th>
                    <th className="py-3 px-3">Reserve Location</th>
                    <th className="py-3 px-3">Plan Type</th>
                    <th className="py-3 px-3 text-right">Qty</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f7f5]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#fbfdfc] transition-colors group">
                      <td className="py-3 px-3 font-mono font-bold text-[#173324]">{ord.orderNumber}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-[#173324] block">{ord.adopterName}</span>
                        <span className="text-[10px] text-[#7a8a80] truncate block max-w-[140px]">{ord.adopterEmail}</span>
                      </td>
                      <td className="py-3 px-3 text-[#2d3a33]">
                        <span className="font-medium text-[#173324] block">{ord.treeSpecies}</span>
                        <span className="text-[10px] text-[#7a8a80] italic">{ord.scientificName}</span>
                      </td>
                      <td className="py-3 px-3 text-[#55695d]">
                        <span className="font-medium block">{ord.reserveName}</span>
                        <span className="text-[10px] text-[#7a8a80] font-mono">{ord.gpsCoords}</span>
                      </td>
                      <td className="py-3 px-3 text-[#55695d] font-medium">{ord.planType}</td>
                      <td className="py-3 px-3 text-right font-semibold text-[#173324]">{ord.quantity}x</td>
                      <td className="py-3 px-3 text-right font-bold text-[#1b7a43]">₹{ord.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold border bg-emerald-50 text-[#1b7a43] border-emerald-200">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-[#f4f7f5] hover:bg-[#173324] hover:text-white text-[#173324] font-semibold text-[11px] transition-all cursor-pointer border border-[#e2eae5]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: TELEMETRY FEED */}
        {activeTab === "telemetry" && (
          <div className="bg-white rounded-2xl border border-[#e2eae5] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324]">
                  Drone Telemetry & Sensor Mesh
                </h2>
                <p className="text-xs sm:text-sm text-[#55695d]">
                  Automated telemetry sweeps streamed from multi-spectral drone sensors and in-situ IoT probes
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-[#10b981] font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                Live Feed (30s interval)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                <span className="text-[11px] font-bold text-[#7a8a80] uppercase tracking-wider block">Ground IoT Probes</span>
                <span className="text-2xl font-bold text-[#173324] mt-1 block">48 / 48 Online</span>
                <p className="text-xs text-[#55695d] mt-1">100% telemetry transmission with LoraWAN mesh across all reserves.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                <span className="text-[11px] font-bold text-[#7a8a80] uppercase tracking-wider block">Canopy Density Average</span>
                <span className="text-2xl font-bold text-[#10b981] mt-1 block">84.2% Foliage</span>
                <p className="text-xs text-[#55695d] mt-1">Healthy leaf chlorophyll concentration conforming to carbon offset standards.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#f7faf8] border border-[#e2eae5]">
                <span className="text-[11px] font-bold text-[#7a8a80] uppercase tracking-wider block">Polygon Blockchain Sync</span>
                <span className="text-2xl font-bold text-[#2d6a4f] mt-1 block">Block #68,912,104</span>
                <p className="text-xs text-[#55695d] mt-1">Every adopted tree hash is cryptographically timestamped on-chain.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD TREE VARIETY */}
      {showAddTreeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddTreeModal(false)}
              className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mb-1">
              Add New Tree Variety
            </h3>
            <p className="text-xs text-[#55695d] mb-4">
              Add a new botanical tree species to the adoption catalog.
            </p>

            <form onSubmit={handleCreateTree} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Common Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Malabar Neem"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Scientific Name
                  </label>
                  <input
                    name="sci"
                    type="text"
                    required
                    placeholder="e.g. Melia dubia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  >
                    <option value="Fruit Trees">Fruit Trees</option>
                    <option value="Native Trees">Native Trees</option>
                    <option value="Timber Trees">Timber Trees</option>
                    <option value="Medicinal">Medicinal</option>
                    <option value="Shade Trees">Shade Trees</option>
                    <option value="Occasion">Occasion</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Adoption Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={399}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Preferred Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    required
                    placeholder="e.g. Western Ghats, Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Growth Metric
                  </label>
                  <input
                    name="growth"
                    type="text"
                    required
                    placeholder="e.g. 12–15 m in 6 years"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                  Image URL
                </label>
                <input
                  name="img"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  defaultValue="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                  Description & Impact
                </label>
                <textarea
                  name="desc"
                  rows={2}
                  required
                  placeholder="Fast-growing native tree prized for pulpwood, carbon biomass, and shade..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#173324] text-white font-semibold hover:bg-[#1e4433] transition-all cursor-pointer"
                >
                  Save Tree Variety
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTreeModal(false)}
                  className="py-3 px-4 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PLAN */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn">
            <button
              onClick={() => setShowAddPlanModal(false)}
              className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mb-1">
              Add Adoption Plan
            </h3>
            <p className="text-xs text-[#55695d] mb-4">
              Create a new adoption tier or occasion dedication plan.
            </p>

            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Plan Label
                  </label>
                  <input
                    name="label"
                    type="text"
                    required
                    placeholder="e.g. Wedding Roots Plan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Icon Emoji
                  </label>
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
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Price Modifier (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={150}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Badge Title
                  </label>
                  <input
                    name="badge"
                    type="text"
                    required
                    defaultValue="Wedding Gift"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                  Plan Description & Perks
                </label>
                <textarea
                  name="desc"
                  rows={2}
                  required
                  placeholder="Commemorate marriage milestones with companion saplings and guest GPS links..."
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
                  onClick={() => setShowAddPlanModal(false)}
                  className="py-3 px-4 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD LOCATION */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddLocationModal(false)}
              className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mb-1">
              Add Plantation Location
            </h3>
            <p className="text-xs text-[#55695d] mb-4">
              Register a new geotagged agroforestry reserve or farmer partner parcel.
            </p>

            <form onSubmit={handleCreateLocation} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Reserve / Parcel Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Wayanad Rain Bio-Reserve"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Region / State
                  </label>
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
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    GPS Coordinates
                  </label>
                  <input
                    name="gps"
                    type="text"
                    required
                    placeholder="e.g. 11.6854° N, 76.1320° E"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Land Area (Hectares)
                  </label>
                  <input
                    name="areaHectares"
                    type="number"
                    required
                    defaultValue={25}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Sapling Capacity
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    required
                    defaultValue={8000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                    Soil Profile & pH
                  </label>
                  <input
                    name="soilHealth"
                    type="text"
                    required
                    placeholder="e.g. Humus Loam (pH 6.3, Moisture 40%)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                  Cover Photo URL
                </label>
                <input
                  name="image"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
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
                  onClick={() => setShowAddLocationModal(false)}
                  className="py-3 px-4 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: INSPECT ADOPTION ORDER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#1b7a43] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {selectedOrder.orderNumber}
              </span>
              <span className="text-xs text-[#7a8a80]">{selectedOrder.datePlanted}</span>
            </div>

            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#173324] mt-1 mb-4">
              {selectedOrder.treeSpecies} Adoption Details
            </h3>

            <div className="p-4 rounded-2xl bg-[#f7faf8] border border-[#e2eae5] space-y-2.5 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">Adopter Name:</span>
                <span className="font-semibold text-[#173324]">{selectedOrder.adopterName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">Adopter Email:</span>
                <span className="font-semibold text-[#173324]">{selectedOrder.adopterEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">Botanical Name:</span>
                <span className="font-semibold italic text-[#173324]">{selectedOrder.scientificName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">Reserve Parcel:</span>
                <span className="font-semibold text-[#173324]">{selectedOrder.reserveName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">GPS Coordinates:</span>
                <span className="font-mono font-semibold text-[#1b7a43]">{selectedOrder.gpsCoords}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">Plan Type:</span>
                <span className="font-semibold text-[#173324]">{selectedOrder.planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">Quantity & Total:</span>
                <span className="font-bold text-[#173324]">
                  {selectedOrder.quantity}x • ₹{selectedOrder.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">Certificate Serial:</span>
                <span className="font-mono font-semibold text-[#2d6a4f]">{selectedOrder.certificateId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8a80]">NDVI Vigour Score:</span>
                <span className="font-bold text-[#10b981]">{selectedOrder.ndviScore} (High Quality)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  showToast(`Digital Certificate ${selectedOrder.certificateId} downloaded!`);
                  setSelectedOrder(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#173324] text-white font-semibold text-xs hover:bg-[#1e4433] transition-all cursor-pointer shadow-sm text-center"
              >
                Download Certificate
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-3 px-5 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
