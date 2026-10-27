"use client";

import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { certificateService } from "@/services/certificates/certificate.service";

interface BuyerCertificatesTabProps {
  trees: BackendTreeInstance[];
  userName?: string;
  onOpenModal: (tree: BackendTreeInstance) => void;
}

export function BuyerCertificatesTab({
  trees,
  userName,
  onOpenModal,
}: BuyerCertificatesTabProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-3 sm:p-3.5 border border-[#e2eae5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#173324] flex items-center gap-1.5">
            <span>📜</span> Verified Digital Certificates & Living Deeds
          </h2>
          <p className="text-[11px] text-[#52796f]">
            Legally valid proof of afforestation, permanent GPS coordinates, and cryptographic verification stamps.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 self-start sm:self-auto">
          {trees.length} Deeds Issued
        </span>
      </div>

      {trees.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#e2eae5] space-y-3 max-w-md mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
            📜
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#173324]">No Deeds Issued Yet</h3>
            <p className="text-xs text-[#52796f] mt-0.5 leading-relaxed">
              When you adopt a tree, your official cryptographic certificate of adoption and permanent GPS registry deed will be generated here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {trees.map((tree) => {
            const recipient = userName || tree.adopterName || "Tree Planter";
            return (
              <div
                key={tree.id}
                className="bg-gradient-to-br from-[#0c2417] via-[#133825] to-[#081810] rounded-2xl p-5 sm:p-6 text-white shadow-xl border-2 border-emerald-500/30 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-400/50 transition-all duration-300"
              >
              {/* Ornate corner lines */}
              <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-emerald-400/40" />
              <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-emerald-400/40" />
              <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-emerald-400/40" />
              <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-emerald-400/40" />

              {/* Watermark circle */}
              <div className="absolute top-0 right-0 w-44 h-44 opacity-10 bg-[radial-gradient(circle_at_100%_0%,_#52b788,_transparent)] pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Header Band */}
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs border border-emerald-400/30">
                      🌿
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-emerald-300">
                        PlantOn Agro Verified Registry
                      </h4>
                      <p className="text-[9px] text-white/50">Official Certificate of Plantation</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {tree.treeTag}
                  </span>
                </div>

                {/* Recipient Certificate Body */}
                <div className="text-center py-2">
                  <span className="text-[10px] font-serif uppercase tracking-widest text-emerald-200/70 block mb-1">
                    Conferred upon
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2 tracking-wide">
                    {recipient}
                  </h3>
                  <p className="text-xs text-white/80 max-w-md mx-auto leading-relaxed">
                    In recognition of adopting and sponsoring a living <strong>{tree.treeVarietyName}</strong> sapling, contributing to native biodiversity in India.
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 bg-white/[0.05] p-4 rounded-2xl border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-300 block font-semibold">Reserve Location</span>
                    <span className="text-white font-medium truncate block">{tree.assignedReserve}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block font-semibold">GPS Coordinates</span>
                    <span className="text-white font-mono">{tree.formattedGps}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block font-semibold">Planting Date</span>
                    <span className="text-white font-medium">{tree.datePlanted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300 block font-semibold">Verification Seal</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>✓</span> Cryptographically Valid
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
                <span className="text-[11px] text-white/60 font-mono">
                  Deed ID: {tree.orderRef}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenModal(tree)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-colors border border-white/15"
                  >
                    🔍 Inspect Full Deed
                  </button>
                  <button
                    onClick={() => {
                      const certId = tree.treeTag || tree.orderRef;
                      const downloadUrl = certificateService.getDownloadUrl(certId);
                      window.open(downloadUrl, '_blank');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b7a43] to-[#52b788] text-white font-bold cursor-pointer hover:scale-105 transition-transform shadow-md flex items-center gap-1.5"
                  >
                    <span>📜</span>
                    <span>Download Deed PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
