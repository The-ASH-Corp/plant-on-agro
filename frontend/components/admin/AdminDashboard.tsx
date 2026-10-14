"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "../../public/Screenshot_From_2026-09-17_15-39-39-removebg-preview.png";
import { useAuthStore } from "@/store/auth.store";

// ==========================================
// DATA INTERFACES & INITIAL SEED DATA
// ==========================================

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

export interface AdoptionOrder {
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
    planType: "Birthday Tree Gift",
    quantity: 2,
    totalAmount: 798,
    datePlanted: "2026-10-12",
    status: "Certificate Issued",
    certificateId: "CERT-NSK-09821",
    ndviScore: 0.88,
  },
  {
    id: "ord-2",
    orderNumber: "POA-9820",
    adopterName: "Aarav Deshmukh",
    adopterEmail: "aarav.d@example.com",
    treeSpecies: "Teakwood",
    scientificName: "Tectona grandis",
    category: "Timber Trees",
    reserveName: "Satara High-Timber Plateau",
    gpsCoords: "17.6805° N, 74.0183° E",
    planType: "Individual Impact",
    quantity: 5,
    totalAmount: 2495,
    datePlanted: "2026-10-11",
    status: "Verified & Tagged",
    certificateId: "CERT-SAT-09820",
    ndviScore: 0.91,
  },
  {
    id: "ord-3",
    orderNumber: "POA-9819",
    adopterName: "Infosys ESG Taskforce",
    adopterEmail: "esg.procure@infosys.com",
    treeSpecies: "Neem Tree",
    scientificName: "Azadirachta indica",
    category: "Medicinal",
    reserveName: "Western Ghats Bio-Sanctuary",
    gpsCoords: "15.3173° N, 74.1240° E",
    planType: "Corporate CSR ESG",
    quantity: 150,
    totalAmount: 29850,
    datePlanted: "2026-10-09",
    status: "Certificate Issued",
    certificateId: "CERT-WGH-09819",
    ndviScore: 0.89,
  },
  {
    id: "ord-4",
    orderNumber: "POA-9818",
    adopterName: "Kavita & Rahul Verma",
    adopterEmail: "kavita.verma@example.com",
    treeSpecies: "Peepal (Sacred Fig)",
    scientificName: "Ficus religiosa",
    category: "Native Trees",
    reserveName: "Aurangabad Green Belt",
    gpsCoords: "19.8762° N, 75.3433° E",
    planType: "Anniversary Roots",
    quantity: 2,
    totalAmount: 698,
    datePlanted: "2026-10-08",
    status: "Certificate Issued",
    certificateId: "CERT-AUR-09818",
    ndviScore: 0.91,
  },
];

// ==========================================
// NEW MODEL ADMIN DASHBOARD COMPONENT
// ==========================================

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "trees" | "plans" | "locations" | "orders" | "telemetry">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Store & Access Guard
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logout = useAuthStore((s) => s.logout);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!hasHydrated && useAuthStore.persist?.hasHydrated?.()) {
      useAuthStore.getState().setHasHydrated(true);
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (!mounted) return;
    const storeHydrated = hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false);
    if (!storeHydrated) return;

    // Only redirect if rehydration has finished and the user is verified not to be admin
    if (!isAuthenticated || user?.role !== "admin") {
      router.replace("/login");
    }
  }, [mounted, hasHydrated, isAuthenticated, user, router]);

  // Filtered Trees
  const filteredTrees = useMemo(() => {
    return trees.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.sci.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [trees, searchQuery, selectedCategory]);

  // Filtered Plans
  const filteredPlans = useMemo(() => {
    return plans.filter(
      (p) =>
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [plans, searchQuery]);

  // Filtered Locations
  const filteredLocations = useMemo(() => {
    return locations.filter(
      (l) =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.gps.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.adopterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.adopterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.treeSpecies.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.reserveName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  // Create Handlers
  const handleCreateTree = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newTree: TreeVarietyItem = {
      id: "tree-" + (trees.length + 1),
      name: (fd.get("name") as string).trim(),
      sci: (fd.get("sci") as string).trim(),
      category: fd.get("category") as TreeVarietyItem["category"],
      price: Number(fd.get("price")) || 299,
      location: (fd.get("location") as string).trim() || "Western Ghats, Maharashtra",
      growth: (fd.get("growth") as string).trim() || "10–12 m in 5 years",
      img: (fd.get("img") as string).trim() || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
      desc: (fd.get("desc") as string).trim() || "Newly catalogued botanical variety for agroforestry.",
      co2PerYearKg: Number(fd.get("co2")) || 25,
    };
    setTrees((prev) => [newTree, ...prev]);
    setShowAddTreeModal(false);
    showToast(`Added "${newTree.name}" to tree catalog!`);
    setActiveTab("trees");
  };

  const handleCreatePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPlan: AdoptionPlanItem = {
      id: "plan-" + (plans.length + 1),
      label: (fd.get("label") as string).trim(),
      icon: (fd.get("icon") as string).trim() || "🌱",
      desc: (fd.get("desc") as string).trim(),
      price: Number(fd.get("price")) || 0,
      badge: (fd.get("badge") as string).trim() || "New Tier",
      activeCount: 0,
    };
    setPlans((prev) => [...prev, newPlan]);
    setShowAddPlanModal(false);
    showToast(`Added plan "${newPlan.label}"!`);
    setActiveTab("plans");
  };

  const handleCreateLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newLoc: PlantationLocationItem = {
      id: "loc-" + (locations.length + 1),
      name: (fd.get("name") as string).trim(),
      region: (fd.get("region") as string).trim(),
      gps: (fd.get("gps") as string).trim() || "18.5204° N, 73.8567° E",
      areaHectares: Number(fd.get("areaHectares")) || 10,
      capacity: Number(fd.get("capacity")) || 5000,
      treesPlanted: 0,
      survivalRate: "99.0%",
      ndviScore: 0.85,
      soilHealth: (fd.get("soilHealth") as string).trim() || "Rich Red Soil (pH 6.5, Moisture 35%)",
      image: (fd.get("image") as string).trim() || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
      status: "Active",
    };
    setLocations((prev) => [...prev, newLoc]);
    setShowAddLocationModal(false);
    showToast(`Added reserve location "${newLoc.name}"!`);
    setActiveTab("locations");
  };

  const handleDeleteTree = (id: string) => {
    if (confirm("Remove this tree variety from adoption catalog?")) {
      setTrees((prev) => prev.filter((t) => t.id !== id));
      showToast("Tree variety removed from catalog.");
    }
  };

  // Wait until client has mounted and store has rehydrated
  const isReady = mounted && (hasHydrated || (useAuthStore.persist?.hasHydrated?.() ?? false));

  if (!isReady) {
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

  // Guard screen if unauthorized
  if (!isAuthenticated || user?.role !== "admin") {
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

  const navItems = [
    { id: "overview", label: "Overview", icon: "📊", badge: "Live" },
    { id: "trees", label: "Tree Varieties", icon: "🌳", count: trees.length },
    { id: "plans", label: "Adoption Plans", icon: "🌱", count: plans.length },
    { id: "locations", label: "Reserves & GPS", icon: "📍", count: locations.length },
    { id: "orders", label: "Adoption Orders", icon: "📦", count: orders.length },
    { id: "telemetry", label: "Drone Telemetry", icon: "🛰️", badge: "AI Sentinel" },
  ] as const;

  return (
    <div className="min-h-screen flex bg-[#f8faf8] text-[#1c2e24] font-sans antialiased overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. LEFT EXECUTIVE SIDEBAR (New Model Dark Emerald Theme) */}
      {/* ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0a1c12] via-[#0f291a] to-[#07140c] text-white flex flex-col justify-between border-r border-emerald-900/40 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#52b788] to-[#1b7a43] p-1 flex items-center justify-center shadow-md border border-emerald-300/30">
                <Image
                  src={Logo}
                  alt="PlantOn Agro Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  PlantOn Agro
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Admin OS
                  </span>
                </span>
                <span className="text-[11px] text-emerald-400/80 font-medium">Operations Center v2.4</span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Real-time Sentinel Beacon */}
          <div className="mx-4 my-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white/70 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#52b788] animate-ping"></span>
                <span>Drone Link Active</span>
              </span>
              <span className="text-emerald-400 font-mono text-[10px] font-bold">100% ONLINE</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-gradient-to-r from-emerald-400 to-[#52b788] h-full w-[96%] rounded-full"></div>
            </div>
            <span className="text-[10px] text-white/50 block mt-1.5">6 Geotagged Bio-Sanctuaries Polled</span>
          </div>

          {/* Navigation Section */}
          <div className="px-3 py-2 flex-1 space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 block mb-2">
                Operations Management
              </span>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as typeof activeTab);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                        isActive
                          ? "bg-gradient-to-r from-[#1b7a43] to-[#2d6a4f] text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/40 font-bold"
                          : "text-white/75 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {"count" in item && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                            isActive ? "bg-white/20 text-white font-bold" : "bg-white/10 text-white/70"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {"badge" in item && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Actions in Sidebar */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60 px-3 block mb-2">
                Fast Configuration
              </span>
              <div className="space-y-1 px-1">
                <button
                  onClick={() => setShowAddTreeModal(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="text-emerald-400">+</span> Add Tree Species
                </button>
                <button
                  onClick={() => setShowAddPlanModal(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="text-emerald-400">+</span> Add Adoption Plan
                </button>
                <button
                  onClick={() => setShowAddLocationModal(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="text-emerald-400">+</span> Geotag Reserve
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Footer Card */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b7a43] to-[#52b788] text-white flex items-center justify-center font-bold text-xs shadow-inner border border-emerald-300/40">
                  AD
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white truncate max-w-[120px]">{user.name}</span>
                  <span className="text-[10px] text-emerald-300/80 uppercase font-semibold">Super Administrator</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  title="View Storefront"
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs"
                >
                  🏪
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-red-300 hover:text-red-200 hover:bg-white/10 transition-colors text-xs cursor-pointer"
                >
                  ⎋
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ======================================================== */}
      {/* 2. MAIN APPLICATION CONTENT AREA                         */}
      {/* ======================================================== */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Command Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#e5ebe7] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[#e5ebe7] text-[#1c2e24] text-lg hover:bg-[#f4f7f5]"
            >
              ☰
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-[#73877b] font-medium hidden sm:inline">PlantOn Agro</span>
              <span className="text-[#cbd5ce] hidden sm:inline">/</span>
              <span className="font-bold text-[#173324] capitalize flex items-center gap-1.5">
                <span>{navItems.find((n) => n.id === activeTab)?.icon}</span>
                <span>{navItems.find((n) => n.id === activeTab)?.label}</span>
              </span>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog, orders, reserves..."
                className="w-64 lg:w-80 pl-9 pr-10 py-1.5 text-xs rounded-xl border border-[#e2eae5] bg-[#f9faf8] text-[#173324] placeholder-[#8a9990] outline-none focus:border-[#1b7a43] focus:ring-1 focus:ring-[#1b7a43] transition-all"
              />
              <span className="absolute left-3 top-2 text-xs text-[#8a9990]">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1.5 text-xs text-[#8a9990] hover:text-[#173324]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* New Quick Action Dropdown/Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddTreeModal(true)}
                className="flex items-center gap-1.5 bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>+</span>
                <span className="hidden sm:inline">New Species</span>
              </button>

              <Link
                href="/"
                className="hidden sm:flex items-center gap-1 text-xs font-medium text-[#1b7a43] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
              >
                <span>🏪</span>
                <span>Live Storefront</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed top-18 right-6 z-50 bg-[#173324] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-2 animate-bounce">
            <span>✅</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Body Content by Tab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW & ANALYTICS (New Model Executive Matrix) */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Welcome Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173324] via-[#1c402d] to-[#0f241a] text-white p-6 sm:p-8 shadow-lg border border-emerald-900/30">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Autonomous Drone Sentinel Telemetry Active</span>
                  </div>
                  <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl sm:text-4xl font-normal leading-tight">
                    Plantation Operations Matrix
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
                    Live satellite telemetry, real-time tree adoption audits, automated Polygon carbon verification, and botanical nursery stock.
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
                    <button onClick={() => setActiveTab("trees")} className="text-[#1b7a43] font-semibold hover:underline">
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
                    <button onClick={() => setActiveTab("locations")} className="text-[#1b7a43] font-semibold hover:underline">
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
                    <button onClick={() => setActiveTab("telemetry")} className="text-[#1b7a43] font-semibold hover:underline">
                      Telemetry →
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
                    <button onClick={() => setActiveTab("orders")} className="text-[#1b7a43] font-semibold hover:underline">
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
                      Living Bio-Reserve Telemetry Health
                    </h2>
                    <p className="text-xs text-[#73877b]">Automated multispectral satellite & drone canopy metrics</p>
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
                    <span className="text-[11px] text-[#73877b] font-bold uppercase tracking-wider block">Sentinel Battery</span>
                    <span className="text-2xl font-bold text-[#1b7a43] mt-1 block">94%</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Solar Base Recharging</span>
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
                      className="text-xs font-semibold text-[#1b7a43] hover:underline"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
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
                    Manage All 6 Reserves →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: TREE CATALOG (New Model Cards & Table Grid)       */}
          {/* ======================================================== */}
          {activeTab === "trees" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
                    Botanical Tree Varieties Catalog ({filteredTrees.length})
                  </h2>
                  <p className="text-xs text-[#73877b]">Manage species, pricing, CO2 absorption rate, and nursery stock</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* View Mode Switcher */}
                  <div className="flex items-center p-1 rounded-xl bg-[#f2f6f3] border border-[#e2eae5]">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        viewMode === "grid" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b]"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        viewMode === "table" ? "bg-white text-[#173324] shadow-xs" : "text-[#73877b]"
                      }`}
                    >
                      Table
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAddTreeModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>+</span>
                    <span>Add Tree Species</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {["All", "Fruit Trees", "Medicinal", "Timber Trees", "Native Trees", "Shade Trees", "Occasion"].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#173324] text-white shadow-xs"
                          : "bg-white text-[#55695d] border border-[#e2eae5] hover:bg-[#f7faf8]"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {/* Grid View */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTrees.map((tree) => (
                    <div
                      key={tree.id}
                      className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Header with Badge */}
                        <div className="relative h-48 w-full overflow-hidden bg-[#eaf1ec]">
                          <img
                            src={tree.img}
                            alt={tree.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#173324] shadow-xs">
                            {tree.category}
                          </span>
                          <span className="absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[#173324]/90 backdrop-blur-md text-emerald-300 shadow-xs">
                            ₹{tree.price}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-2">
                          <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-semibold text-[#173324]">
                            {tree.name}
                          </h3>
                          <span className="text-xs text-[#73877b] italic block -mt-1">{tree.sci}</span>
                          <p className="text-xs text-[#55695d] line-clamp-2 leading-relaxed">{tree.desc}</p>

                          <div className="pt-3 border-t border-[#f0f4f1] grid grid-cols-2 gap-2 text-[11px] text-[#73877b]">
                            <div>
                              <span className="block text-[#a0b0a6] text-[10px] uppercase font-bold">Region</span>
                              <span className="font-semibold text-[#173324] truncate block">{tree.location}</span>
                            </div>
                            <div>
                              <span className="block text-[#a0b0a6] text-[10px] uppercase font-bold">CO2 Sequestration</span>
                              <span className="font-semibold text-[#1b7a43]">{tree.co2PerYearKg} kg/year</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 bg-[#f9faf8] border-t border-[#f0f4f1] flex items-center justify-between">
                        <span className="text-[11px] text-[#73877b] font-medium">{tree.growth}</span>
                        <button
                          onClick={() => handleDeleteTree(tree.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Compact Table View */
                <div className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f7faf8] border-b border-[#e2eae5] text-[#7a8a80] uppercase tracking-wider font-bold">
                        <tr>
                          <th className="py-3.5 px-4">Tree Variety</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Price</th>
                          <th className="py-3.5 px-4">Location</th>
                          <th className="py-3.5 px-4">CO2 / Year</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f4f1]">
                        {filteredTrees.map((tree) => (
                          <tr key={tree.id} className="hover:bg-[#fcfdfc] transition-colors">
                            <td className="py-3 px-4 flex items-center gap-3">
                              <img src={tree.img} alt={tree.name} className="w-9 h-9 rounded-xl object-cover" />
                              <div>
                                <span className="font-bold text-[#173324] block">{tree.name}</span>
                                <span className="text-[11px] text-[#73877b] italic">{tree.sci}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#55695d]">{tree.category}</td>
                            <td className="py-3 px-4 font-bold text-[#173324]">₹{tree.price}</td>
                            <td className="py-3 px-4 text-[#73877b]">{tree.location}</td>
                            <td className="py-3 px-4 font-semibold text-[#1b7a43]">{tree.co2PerYearKg} kg</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteTree(tree.id)}
                                className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ADOPTION PLANS                                    */}
          {/* ======================================================== */}
          {activeTab === "plans" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
                    Adoption Packages & Occasion Programs ({filteredPlans.length})
                  </h2>
                  <p className="text-xs text-[#73877b]">Configure personal, memorial, occasion, and enterprise CSR packages</p>
                </div>
                <button
                  onClick={() => setShowAddPlanModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span>+</span>
                  <span>Add Adoption Plan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-6 rounded-3xl bg-white border border-[#e2eae5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{plan.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#1b7a43] border border-emerald-200">
                          {plan.badge}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-[#173324]">
                        {plan.label}
                      </h3>
                      <p className="text-xs text-[#55695d] mt-2 leading-relaxed">{plan.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#f0f4f1] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#a0b0a6] uppercase font-bold block">Price Modifier</span>
                        <span className="font-bold text-[#173324]">
                          {plan.price === 0 ? "Standard Tree Rate" : plan.price > 0 ? `+₹${plan.price} Extra` : `₹${plan.price} Subsidy`}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#f0f5f2] text-[#1b7a43]">
                        {plan.activeCount.toLocaleString()} Adopters
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: PLANTATION RESERVES & GPS                         */}
          {/* ======================================================== */}
          {activeTab === "locations" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
                    Protected Bio-Sanctuaries & Reserves ({filteredLocations.length})
                  </h2>
                  <p className="text-xs text-[#73877b]">Geotagged forest sectors with live GPS telemetry, hectare metrics, and soil health</p>
                </div>
                <button
                  onClick={() => setShowAddLocationModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span>+</span>
                  <span>Geotag Reserve</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((loc) => {
                  const pct = Math.round((loc.treesPlanted / loc.capacity) * 100);
                  return (
                    <div
                      key={loc.id}
                      className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 w-full bg-[#eaf1ec] overflow-hidden">
                          <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-400/30">
                            NDVI {loc.ndviScore}
                          </span>
                          <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/95 text-[#173324]">
                            {loc.gps}
                          </span>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <h3 style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-[#173324]">
                              {loc.name}
                            </h3>
                            <span className="text-xs text-[#73877b] block">{loc.region}</span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-[#73877b]">Capacity</span>
                              <span className="font-bold text-[#173324]">
                                {loc.treesPlanted.toLocaleString()} / {loc.capacity.toLocaleString()} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-[#eef3f0] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#2d6a4f] to-[#52b788] h-full rounded-full"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] text-[11px] text-[#55695d] space-y-1">
                            <div>
                              <span className="font-bold text-[#173324]">Area:</span> {loc.areaHectares} Hectares
                            </div>
                            <div>
                              <span className="font-bold text-[#173324]">Soil:</span> {loc.soilHealth}
                            </div>
                            <div>
                              <span className="font-bold text-[#173324]">Survival:</span> {loc.survivalRate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: ADOPTION ORDERS & AUDIT LEDGER                    */}
          {/* ======================================================== */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
                    Adoption Orders & Certificate Register ({filteredOrders.length})
                  </h2>
                  <p className="text-xs text-[#73877b]">Verified blockchain timestamped adoptions with digital certificate downloads</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast("Exporting order ledger CSV...")}
                    className="px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-[#1b7a43] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Orders Data Table */}
              <div className="bg-white rounded-3xl border border-[#e2eae5] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f7faf8] border-b border-[#e2eae5] text-[#7a8a80] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="py-4 px-4">Order / Adopter</th>
                        <th className="py-4 px-4">Species & Plan</th>
                        <th className="py-4 px-4">Reserve Geotag</th>
                        <th className="py-4 px-4">Total Amount</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f4f1]">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#fbfcfb] transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[11px] font-bold text-[#1b7a43] block">
                              {order.orderNumber}
                            </span>
                            <span className="font-semibold text-[#173324] block">{order.adopterName}</span>
                            <span className="text-[11px] text-[#73877b]">{order.adopterEmail}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#173324] block">{order.treeSpecies}</span>
                            <span className="text-[11px] text-[#55695d]">{order.planType}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[#173324] font-medium block">{order.reserveName}</span>
                            <span className="font-mono text-[10px] text-[#73877b]">{order.gpsCoords}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#173324]">
                            ₹{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 rounded-xl bg-[#173324] text-white text-xs font-semibold hover:bg-[#1f4230] transition-colors cursor-pointer"
                            >
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: DRONE & SATELLITE TELEMETRY                       */}
          {/* ======================================================== */}
          {activeTab === "telemetry" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e2eae5] shadow-xs">
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-[#173324]">
                    Drone & Satellite Forest Radar Surveillance
                  </h2>
                  <p className="text-xs text-[#73877b]">Autonomous multispectral Sentinel-2 scans and Polygon on-chain offset ledger</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#173324] text-emerald-300 border border-emerald-500/30">
                    🟢 Sentinel-01: Armed
                  </span>
                </div>
              </div>

              {/* Radar Simulation Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0b1f13] to-[#040e08] text-white border border-emerald-900/50 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Circular Radar Graphic */}
                  <div className="relative w-64 h-64 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                    <div className="absolute inset-4 rounded-full border border-emerald-500/20"></div>
                    <div className="absolute inset-12 rounded-full border border-emerald-500/20"></div>
                    <div className="absolute inset-20 rounded-full border border-emerald-500/20"></div>

                    {/* Rotating Scanner Radar Hand */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-emerald-400 animate-spin opacity-75"></div>

                    {/* Glowing Radar Center */}
                    <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping"></div>

                    {/* Coordinates Overlay */}
                    <span className="absolute top-2 text-[10px] font-mono text-emerald-400">15.3173° N</span>
                    <span className="absolute bottom-2 text-[10px] font-mono text-emerald-400">74.1240° E</span>
                  </div>

                  {/* Telemetry Data Stream */}
                  <div className="flex-1 space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                      Live Telemetry Log Stream
                    </span>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-emerald-300 space-y-2">
                      <p className="text-white/80">[11:58:02] SENTINEL-01: GPS Lock Western Ghats (15.3173°N, 74.1240°E)</p>
                      <p className="text-emerald-400">[11:58:09] NDVI SCAN: 0.88 confirmed. Zero canopy blight detected.</p>
                      <p className="text-white/80">[11:58:14] SOIL SENSOR 04: Moisture 38%, pH 6.4 (Laterite red layer).</p>
                      <p className="text-emerald-300">[11:58:21] POLYGON SYNC: Carbon block #68,912,104 minted successfully.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-white/60 block text-[10px] uppercase font-bold">Drone Range</span>
                        <span className="text-emerald-400 font-bold text-sm">4.2 km Radius</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-white/60 block text-[10px] uppercase font-bold">Solar Base</span>
                        <span className="text-emerald-400 font-bold text-sm">Online (32.4 kWh)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. MODALS (Create Tree, Plan, Location, Inspect Order)    */}
      {/* ======================================================== */}

      {/* MODAL 1: ADD TREE */}
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
            <p className="text-xs text-[#55695d] mb-4">Add a new botanical tree species to the adoption catalog.</p>

            <form onSubmit={handleCreateTree} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Common Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Malabar Neem"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Scientific Name</label>
                  <input
                    name="sci"
                    type="text"
                    required
                    placeholder="e.g. Melia dubia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Category</label>
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
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={349}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">CO2 (kg/yr)</label>
                  <input
                    name="co2"
                    type="number"
                    required
                    defaultValue={25}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Region</label>
                  <input
                    name="location"
                    type="text"
                    required
                    placeholder="e.g. Western Ghats, Maharashtra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Growth Metric</label>
                  <input
                    name="growth"
                    type="text"
                    required
                    placeholder="e.g. 10–14 m in 5 years"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Cover Photo URL</label>
                <input
                  name="img"
                  type="url"
                  defaultValue="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7]"
                />
              </div>

              <div>
                <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  name="desc"
                  rows={2}
                  required
                  placeholder="Thrives in diverse forest ecosystems and produces dense foliage..."
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
            <p className="text-xs text-[#55695d] mb-4">Create a new adoption tier or occasion dedication plan.</p>

            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
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
            <p className="text-xs text-[#55695d] mb-4">Register a new geotagged agroforestry reserve or farmer partner parcel.</p>

            <form onSubmit={handleCreateLocation} className="space-y-3.5 text-xs">
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
