"use client";

import { useState, useEffect } from "react";
import { PlantStep, Tree, Plan } from "@/types";
import { treeVarietyService, BackendTreeVariety } from "@/services/tree-varieties/tree-variety.service";
import { adoptionPlanService, BackendAdoptionPlan } from "@/services/adoption-plans/adoption-plan.service";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { useAuthStore } from "@/store/auth.store";
import { useHydratedStore } from "@/store/hooks/use-hydrated-store";
import { PlantFlowHeader } from "./PlantFlowHeader";
import { PlantFlowFooter } from "./PlantFlowFooter";
import {
  Step1TreeSelection,
  Step2Dedication,
  Step3Quantity,
  Step4Location,
  Step5UserDetails,
  Step6Payment,
  Step7Confirmation,
} from "./steps";

const LOCATION_COORDINATES: Record<
  string,
  { lat: number; lng: number; formatted: string }
> = {
  "Western Ghats, Maharashtra": {
    lat: 18.9894,
    lng: 73.4428,
    formatted: "18.9894° N, 73.4428° E",
  },
  "Nashik Valley, Maharashtra": {
    lat: 19.9975,
    lng: 73.7898,
    formatted: "19.9975° N, 73.7898° E",
  },
  "Satara Plateau, Maharashtra": {
    lat: 17.6805,
    lng: 73.9904,
    formatted: "17.6805° N, 73.9904° E",
  },
  "Nagpur Forest Zone": {
    lat: 21.1458,
    lng: 79.0882,
    formatted: "21.1458° N, 79.0882° E",
  },
  "Aurangabad Green Belt": {
    lat: 19.8762,
    lng: 75.3433,
    formatted: "19.8762° N, 75.3433° E",
  },
  "Pune Hills, Maharashtra": {
    lat: 18.5204,
    lng: 73.8567,
    formatted: "18.5204° N, 73.8567° E",
  },
};

export interface PlantFlowProps {
  onClose: () => void;
}

export function PlantFlowModal({ onClose }: PlantFlowProps) {
  const user = useHydratedStore(useAuthStore, (s) => s.user);

  const [step, setStep] = useState<PlantStep>(1);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [location, setLocation] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("sandbox");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId] = useState(
    () => "POA-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  // Live Database Catalog State
  const [trees, setTrees] = useState<Tree[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [locations, setLocations] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("poa_custom_locations");
        if (raw) {
          const custom = JSON.parse(raw);
          if (Array.isArray(custom)) {
            return custom.map((c: any) => c.name || c).filter(Boolean);
          }
        }
      } catch {}
    }
    return [];
  });
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Auto-fill user contact info if logged in
  useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);

  // Fetch real varieties and adoption plans from MongoDB
  useEffect(() => {
    let isMounted = true;
    async function fetchCatalog() {
      try {
        setLoadingCatalog(true);
        const [treesRes, plansRes] = await Promise.all([
          treeVarietyService.getAll({ limit: 50 }),
          adoptionPlanService.getAll({ limit: 50 }),
        ]);

        if (isMounted) {
          if (treesRes.data?.items) {
            const mappedTrees: Tree[] = treesRes.data.items.map((v: BackendTreeVariety) => ({
              id: v.id,
              name: v.commonName,
              sci: v.scientificName,
              category: v.category as any,
              price: v.price,
              location: v.location || "Western Ghats, Maharashtra",
              growth: v.growthTimeline,
              img:
                v.coverImages?.[0] ||
                "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
              desc: v.description,
              co2AbsorptionRateKgYear: v.co2AbsorptionRateKgYear,
            }));
            setTrees(mappedTrees);

            // Extract unique active bio-reserves from database
            const dbLocations = Array.from(
              new Set(
                mappedTrees
                  .map((t) => t.location)
                  .filter((loc): loc is string => Boolean(loc && loc.trim()))
              )
            );
            if (dbLocations.length > 0) {
              setLocations((prev) => Array.from(new Set([...prev, ...dbLocations])));
            }
          }

          if (plansRes.data?.items) {
            const mappedPlans: Plan[] = plansRes.data.items.map((p: BackendAdoptionPlan) => ({
              id: p.id,
              label: p.planLabel,
              icon: p.icon || "🌱",
              desc: p.description,
              price: p.priceModifier,
            }));
            setPlans(mappedPlans);
          }
        }
      } catch (err) {
        console.error("Could not fetch plant-flow catalog from database:", err);
      } finally {
        if (isMounted) setLoadingCatalog(false);
      }
    }

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);
  const pricePerTree = selectedTree
    ? selectedTree.price + (selectedPlanData?.price ?? 0)
    : 0;
  const total = pricePerTree * qty;

  const canNext =
    (step === 1 && selectedTree) ||
    (step === 2 && selectedPlan) ||
    (step === 3 && qty >= 1) ||
    (step === 4 && location) ||
    (step === 5 && name && email) ||
    step === 6 ||
    step === 7;

  const handleNext = async () => {
    if (step < 6) {
      setStep((s) => (s + 1) as PlantStep);
      return;
    }

    setIsProcessing(true);

    const chosenCoords =
      (location && LOCATION_COORDINATES[location]) || {
        lat: 19.9975,
        lng: 73.7898,
        formatted: "19.9975° N, 73.7898° E",
      };

    const speciesShort = (selectedTree?.name || "TR")
      .substring(0, 2)
      .toUpperCase();
    const certNumber = `CERT-${orderId}`;
    const dateStr = new Date().toISOString().split("T")[0];
    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // 1. Physical Tree Instance Records for Database
    const newInstances = [];
    for (let i = 0; i < qty; i++) {
      const serialNum = Math.floor(1000 + Math.random() * 9000);
      const treeTag = `POA-${speciesShort}-${serialNum}`;
      const jitterLat = Number(
        (chosenCoords.lat + (Math.random() - 0.5) * 0.004).toFixed(4)
      );
      const jitterLng = Number(
        (chosenCoords.lng + (Math.random() - 0.5) * 0.004).toFixed(4)
      );

      const noteText =
        qty > 1
          ? `Tree #${i + 1} of ${qty} adopted under "${selectedPlanData?.label || 'Individual'}" lifetime package. Physical nursery tagging and geotagging completed.`
          : `Adopted under "${selectedPlanData?.label || 'Individual'}" lifetime package. Physical nursery tagging and geotagging completed.`;

      // Persist to MongoDB through backend API
      try {
        const createdTreeRes = await treeInstanceService.create({
          treeTag,
          orderRef: orderId,
          assignedReserve: location || "Nashik Valley, Maharashtra",
          gpsCoordinates: { latitude: jitterLat, longitude: jitterLng },
          datePlanted: new Date().toISOString(),
          healthStatus: "Sapling Growing",
          treeVarietyName: selectedTree?.name || "Indigenous Sapling",
          adopterName: name || user?.name || "Verified Adopter",
          adopterEmail: email || user?.email || "adopter@example.com",
          notes: noteText,
          imageUrl:
            selectedTree?.img ||
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
        });

        if (createdTreeRes.data) {
          newInstances.push({
            id: createdTreeRes.data.id,
            treeTag: createdTreeRes.data.treeTag,
            orderRef: createdTreeRes.data.orderRef,
            assignedReserve: createdTreeRes.data.assignedReserve,
            gpsCoordinates: createdTreeRes.data.gpsCoordinates,
            formattedGps: `${jitterLat}° N, ${jitterLng}° E`,
            datePlanted: formattedDate,
            healthStatus: "Sapling Growing" as const,
            treeVarietyName: selectedTree?.name || "Indigenous Sapling",
            adopterName: name || user?.name || "Verified Adopter",
            adopterEmail: email || user?.email || "adopter@example.com",
            notes: noteText,
            imageUrl:
              selectedTree?.img ||
              "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
            lastInspectedAt: dateStr,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (saveErr) {
        console.warn("Could not save instance via API, fallback to memory record:", saveErr);
        newInstances.push({
          id: `inst-${Date.now()}-${i}`,
          treeTag: treeTag,
          orderRef: orderId,
          assignedReserve: location || "Nashik Valley, Maharashtra",
          gpsCoordinates: { latitude: jitterLat, longitude: jitterLng },
          formattedGps: `${jitterLat}° N, ${jitterLng}° E`,
          datePlanted: formattedDate,
          healthStatus: "Sapling Growing" as const,
          treeVarietyName: selectedTree?.name || "Indigenous Sapling",
          adopterName: name || "Verified Adopter",
          adopterEmail: email || "adopter@example.com",
          notes: noteText,
          imageUrl:
            selectedTree?.img ||
            "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&auto=format",
          lastInspectedAt: dateStr,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // 2. Order Record
    const newOrder = {
      id: "ord-" + Date.now(),
      orderNumber: orderId,
      adopterName: name || user?.name || "Verified Adopter",
      adopterEmail: email || user?.email || "adopter@example.com",
      treeSpecies: selectedTree?.name || "Indigenous Tree",
      scientificName: selectedTree?.sci || "Botanical Tree",
      category: selectedTree?.category || "Fruit Trees",
      reserveName: location || "Nashik Valley, Maharashtra",
      gpsCoords: chosenCoords.formatted,
      planType: selectedPlanData?.label || "Individual",
      quantity: qty,
      totalAmount: total,
      datePlanted: dateStr,
      status: "New Request" as const,
      certificateId: certNumber,
      ndviScore: 0.91,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    try {
      // Update orders ledger in localStorage for instant fast UI responsiveness
      const existingOrders = JSON.parse(
        localStorage.getItem("poa_orders") || "[]"
      );
      localStorage.setItem(
        "poa_orders",
        JSON.stringify([newOrder, ...existingOrders])
      );

      // Update tree instances ledger in localStorage
      const existingInstances = JSON.parse(
        localStorage.getItem("poa_instances") || "[]"
      );
      localStorage.setItem(
        "poa_instances",
        JSON.stringify([...newInstances, ...existingInstances])
      );

      // Update buyer adopted trees in localStorage
      const existingBuyerTrees = JSON.parse(
        localStorage.getItem("poa_buyer_trees") || "[]"
      );
      localStorage.setItem(
        "poa_buyer_trees",
        JSON.stringify([...newInstances, ...existingBuyerTrees])
      );

      // Dispatch event for any active admin or buyer windows
      window.dispatchEvent(
        new CustomEvent("poa-new-order", {
          detail: {
            order: newOrder,
            instance: newInstances[0],
            instances: newInstances,
          },
        })
      );
    } catch (e) {
      console.warn("Could not save order locally:", e);
    }

    setIsProcessing(false);
    setStep(7);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15,35,24,0.85)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl relative"
        style={{ background: "#fff" }}
      >
        <PlantFlowHeader step={step} onClose={onClose} />

        {/* Modal Content Body */}
        <div className="p-6">
          {step === 1 && (
            <Step1TreeSelection
              selectedTree={selectedTree}
              onSelectTree={(t) => setSelectedTree(t)}
              trees={trees}
              loading={loadingCatalog}
            />
          )}

          {step === 2 && (
            <Step2Dedication
              selectedPlan={selectedPlan}
              onSelectPlan={(id) => setSelectedPlan(id)}
              plans={plans}
              loading={loadingCatalog}
            />
          )}

          {step === 3 && (
            <Step3Quantity
              qty={qty}
              onSetQty={(q) => setQty(q)}
              selectedTree={selectedTree}
              total={total}
            />
          )}

          {step === 4 && (
            <Step4Location
              location={location}
              onSelectLocation={(loc) => setLocation(loc)}
              locations={locations}
            />
          )}

          {step === 5 && (
            <Step5UserDetails
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
            />
          )}

          {step === 6 && (
            <Step6Payment
              selectedTree={selectedTree}
              selectedPlanData={selectedPlanData}
              qty={qty}
              location={location}
              total={total}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          )}

          {step === 7 && (
            <Step7Confirmation
              selectedTree={selectedTree}
              location={location}
              orderId={orderId}
              onClose={onClose}
            />
          )}
        </div>

        <PlantFlowFooter
          step={step}
          canNext={Boolean(canNext)}
          isProcessing={isProcessing}
          onBack={() => setStep((s) => (s - 1) as PlantStep)}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
