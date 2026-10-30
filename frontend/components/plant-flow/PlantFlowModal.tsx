"use client";

import { useState, useEffect } from "react";
import { PlantStep, Tree, Plan } from "@/types";
import { validatePhoneNumber } from "@/components/ui";
import { treeVarietyService, BackendTreeVariety } from "@/services/tree-varieties/tree-variety.service";
import { adoptionPlanService, BackendAdoptionPlan } from "@/services/adoption-plans/adoption-plan.service";
import { treeInstanceService } from "@/services/tree-instances/tree-instance.service";
import { orderService } from "@/services/orders/order.service";
import { locationService } from "@/services/locations/location.service";
import { paymentService, loadRazorpayCheckoutScript } from "@/services/payment/payment.service";
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
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
        const [treesRes, plansRes, locationsRes] = await Promise.all([
          treeVarietyService.getAll({ limit: 50 }),
          adoptionPlanService.getAll({ limit: 50 }),
          locationService.getAll({ limit: 100 }).catch(() => null),
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

            // Extract unique active bio-reserves from database trees
            const treeLocations = mappedTrees
              .map((t) => t.location)
              .filter((loc): loc is string => Boolean(loc && loc.trim()));

            // Extract bio-reserves from locations API
            const apiLocations =
              locationsRes?.data?.items?.map((l) => l.name).filter(Boolean) || [];

            const combinedLocations = Array.from(
              new Set([...treeLocations, ...apiLocations])
            );

            if (combinedLocations.length > 0) {
              setLocations((prev) =>
                Array.from(new Set([...prev, ...combinedLocations]))
              );
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

  const isPhoneValid = validatePhoneNumber(phone, false).isValid;

  const canNext =
    (step === 1 && selectedTree) ||
    (step === 2 && selectedPlan) ||
    (step === 3 && qty >= 1) ||
    (step === 4 && location) ||
    (step === 5 && name.trim() && email.trim() && isPhoneValid) ||
    step === 6 ||
    step === 7;

  const completeOrderAndAdoption = async (
    txRef: string,
    methodUsed: string,
    serverData?: any
  ) => {
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
    const newInstances: any[] = [];
    if (serverData?.treeInstances && Array.isArray(serverData.treeInstances) && serverData.treeInstances.length > 0) {
      newInstances.push(...serverData.treeInstances);
    } else {
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
            ? `Tree #${i + 1} of ${qty} adopted under "${selectedPlanData?.label || "Individual"}" lifetime package. Physical nursery tagging and geotagging completed.`
            : `Adopted under "${selectedPlanData?.label || "Individual"}" lifetime package. Physical nursery tagging and geotagging completed.`;

        // Persist to MongoDB through backend API
        try {
          const createdTreeRes = await treeInstanceService.create({
            treeTag,
            orderRef: orderId,
            assignedReserve: location || "Flagship Living Forest — Wayanad, Kerala",
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
            assignedReserve: location || "Flagship Living Forest — Wayanad, Kerala",
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
    }

    // 2. Order Record - Use server-verified order directly
    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderNotes = `Adoption contract for ${qty}x ${selectedTree?.name || "tree"} planted at ${location || "Flagship Living Forest — Wayanad, Kerala"}. Geotagged and physically nurtured. Paid via ${methodUsed}.`;

    let finalOrderRecord: any = serverData?.order ? orderService.mapToUiItem(serverData.order) : null;

    if (!finalOrderRecord) {
      try {
        const orderRes = await orderService.create({
          orderNumber: orderId,
          invoiceNumber: invNumber,
          adopterName: name || user?.name || "Verified Adopter",
          adopterEmail: email || user?.email || "adopter@example.com",
          adopterPhone: phone || "",
          items: [
            {
              treeVarietyId: selectedTree?.id ? String(selectedTree.id) : undefined,
              treeSpecies: selectedTree?.name || "Indigenous Tree",
              scientificName: selectedTree?.sci || "Botanical Tree",
              category: selectedTree?.category || "Fruit Trees",
              planType: selectedPlanData?.label || "Individual",
              reserveName: location || "Flagship Living Forest — Wayanad, Kerala",
              gpsCoords: chosenCoords.formatted,
              quantity: qty,
              unitPrice: pricePerTree,
              subtotal: total,
            },
          ],
          treeSpecies: selectedTree?.name || "Indigenous Tree",
          scientificName: selectedTree?.sci || "Botanical Tree",
          category: selectedTree?.category || "Fruit Trees",
          reserveName: location || "Flagship Living Forest — Wayanad, Kerala",
          gpsCoords: chosenCoords.formatted,
          planType: selectedPlanData?.label || "Individual",
          dedicationMessage: "",
          quantity: qty,
          totalAmount: total,
          paymentMethod: methodUsed,
          paymentStatus: "Paid",
          transactionRef: txRef,
          status: "New Request",
          certificateId: certNumber,
          ndviScore: 0.91,
          isRead: false,
          notes: orderNotes,
          datePlanted: dateStr,
        });

        if (orderRes.data) {
          finalOrderRecord = orderService.mapToUiItem(orderRes.data);
        }
      } catch (orderApiErr) {
        console.warn("Could not save order directly to backend API, using local fallback:", orderApiErr);
      }

      if (!finalOrderRecord) {
        finalOrderRecord = {
          id: "ord-" + Date.now(),
          orderNumber: orderId,
          invoiceNumber: invNumber,
          adopterName: name || user?.name || "Verified Adopter",
          adopterEmail: email || user?.email || "adopter@example.com",
          adopterPhone: phone || "",
          treeSpecies: selectedTree?.name || "Indigenous Tree",
          scientificName: selectedTree?.sci || "Botanical Tree",
          category: selectedTree?.category || "Fruit Trees",
          reserveName: location || "Flagship Living Forest — Wayanad, Kerala",
          gpsCoords: chosenCoords.formatted,
          planType: selectedPlanData?.label || "Individual",
          dedicationMessage: "",
          quantity: qty,
          totalAmount: total,
          paymentMethod: methodUsed,
          paymentStatus: "Paid" as const,
          transactionRef: txRef,
          datePlanted: dateStr,
          status: "New Request" as const,
          certificateId: certNumber,
          ndviScore: 0.91,
          isRead: false,
          notes: orderNotes,
          createdAt: new Date().toISOString(),
        };
      }
    }

    try {
      // Update orders ledger in localStorage for instant fast UI responsiveness
      const existingOrders = JSON.parse(
        localStorage.getItem("poa_orders") || "[]"
      );
      localStorage.setItem(
        "poa_orders",
        JSON.stringify([finalOrderRecord, ...existingOrders])
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
            order: finalOrderRecord,
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

  const handleNext = async () => {
    if (step < 6) {
      setStep((s) => (s + 1) as PlantStep);
      return;
    }

    setPaymentError(null);
    setIsProcessing(true);

    // Razorpay Flow with Server-Side Authoritative Pricing
    try {
      const orderRes = await paymentService.createOrder({
        treeVarietyId: selectedTree?.id ? String(selectedTree.id) : undefined,
        treeSpecies: selectedTree?.name,
        planId: selectedPlan || undefined,
        planLabel: selectedPlanData?.label,
        quantity: qty,
        reserveLocation: location || undefined,
        receipt: orderId,
        adopterName: name || user?.name || "Verified Adopter",
        adopterEmail: email || user?.email || "adopter@example.com",
        adopterPhone: phone || undefined,
      });

      if (!orderRes.data) {
        throw new Error(orderRes.message || "Failed to initialize Razorpay checkout");
      }

      // Check if sandbox simulator mode
      if (orderRes.data.isMock) {
        const mockPaymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const verifyRes = await paymentService.verifyPayment({
          razorpayOrderId: orderRes.data.orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: "mock_signature_valid",
        });
        await completeOrderAndAdoption(mockPaymentId, "razorpay", verifyRes.data);
        return;
      }

      // Live / Test mode with valid Razorpay credentials
      const scriptLoaded = await loadRazorpayCheckoutScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout SDK. Please check your internet connection.");
      }

      const rzpOptions = {
        key: orderRes.data.keyId,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency || "INR",
        name: "PlantOn Agro",
        description: `${qty}x ${selectedTree?.name || "Tree"} Adoption (${selectedPlanData?.label || "Lifetime"})`,
        image:
          selectedTree?.img ||
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop",
        order_id: orderRes.data.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            await completeOrderAndAdoption(response.razorpay_payment_id, "razorpay", verifyRes.data);
          } catch (verifyErr: any) {
            console.error("Razorpay verification failed:", verifyErr);
            setPaymentError(
              verifyErr?.message || "Payment verification failed. Please contact support."
            );
            setIsProcessing(false);
          }
        },
        prefill: {
          name: name || user?.name || "",
          email: email || user?.email || "",
          contact: phone || "",
        },
        notes: {
          orderNumber: orderId,
          treeSpecies: selectedTree?.name || "Tree",
          quantity: String(qty),
          location: location || "Flagship Living Forest — Wayanad, Kerala",
        },
        theme: {
          color: "#2d6a4f",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on("payment.failed", (resp: any) => {
        console.error("Razorpay payment failed:", resp.error);
        setPaymentError(resp.error?.description || "Payment was declined or failed.");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Failed to process Razorpay checkout:", err);
      setPaymentError(
        err?.message || "Failed to start Razorpay payment. Please try again or use sandbox mode."
      );
      setIsProcessing(false);
    }
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
            <>
              {paymentError && (
                <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between shadow-2xs">
                  <span className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{paymentError}</span>
                  </span>
                  <button
                    onClick={() => setPaymentError(null)}
                    className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}
              <Step6Payment
                selectedTree={selectedTree}
                selectedPlanData={selectedPlanData}
                qty={qty}
                location={location}
                total={total}
              />
            </>
          )}

          {step === 7 && (
            <Step7Confirmation
              selectedTree={selectedTree}
              location={location}
              orderId={orderId}
              buyerEmail={email}
              buyerName={name}
              onClose={onClose}
            />
          )}
        </div>

        <PlantFlowFooter
          step={step}
          canNext={Boolean(canNext)}
          isProcessing={isProcessing}
          total={total}
          onBack={() => setStep((s) => (s - 1) as PlantStep)}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
