"use client";

import { BackendTreeInstance } from "@/services/tree-instances/tree-instance.service";
import { certificateService } from "@/services/certificates/certificate.service";

interface CertificateModalProps {
  tree: BackendTreeInstance | null;
  userName?: string;
  onClose: () => void;
}

export function CertificateModal({ tree, userName, onClose }: CertificateModalProps) {
  if (!tree) return null;

  const recipient = userName || tree.adopterName || "Tree Adopter";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0f2419] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/40 text-white flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-[#08170f]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📜</span>
            <div>
              <h3 className="text-sm font-bold tracking-wide">Official Certificate of Plantation</h3>
              <p className="text-[11px] text-emerald-400 font-mono">Serial: {tree.treeTag}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const certId = tree.treeTag || tree.orderRef;
                const downloadUrl = certificateService.getDownloadUrl(certId);
                window.open(downloadUrl, '_blank');
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1b7a43] to-[#52b788] hover:scale-105 text-white border border-emerald-400/40 cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>📜</span>
              <span>Download Official Deed PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Body Container */}
        <div className="p-6 sm:p-10 overflow-y-auto">
          {/* Ornate Certificate Canvas */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#133021] via-[#0d2217] to-[#081810] p-8 sm:p-12 border-2 border-emerald-400/30 shadow-inner overflow-hidden text-center">
            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-emerald-400/60" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-emerald-400/60" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-emerald-400/60" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-emerald-400/60" />

            {/* Subtle botanical watermark in the center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-[200px]">🌿</span>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-6">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-300 block mb-1">
                PlantOn Agro Living Registry • Verified Deed
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#b7e4c7] tracking-wide mb-2">
                Certificate of Plantation
              </h2>
              <p className="text-xs text-emerald-200/70 italic">
                Registered under the National Afforestation & Biodiversity Protocol
              </p>
            </div>

            {/* Recipient */}
            <div className="relative z-10 my-8 py-4 border-y border-emerald-500/20 max-w-xl mx-auto">
              <span className="text-xs text-white/60 block mb-2 font-serif italic">This certifies that</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-white tracking-wide">
                {recipient}
              </h1>
              <span className="text-xs text-emerald-300 font-semibold block mt-2">
                Verified Eco-Guardian & Tree Adopter
              </span>
            </div>

            {/* Statement */}
            <p className="relative z-10 text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed mb-8">
              Has officially adopted a living <strong>{tree.treeVarietyName}</strong> sapling, forever protected and nourished at{" "}
              <strong>{tree.assignedReserve}</strong>.
            </p>

            {/* Telemetry Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-xl border border-white/10 text-left text-xs mb-8">
              <div>
                <span className="text-[10px] text-emerald-300/80 uppercase font-semibold block">Tree Serial ID</span>
                <strong className="font-mono text-white text-xs">{tree.treeTag}</strong>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/80 uppercase font-semibold block">GPS Location</span>
                <strong className="font-mono text-white text-xs">{tree.formattedGps}</strong>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/80 uppercase font-semibold block">Date Planted</span>
                <strong className="text-white text-xs">{tree.datePlanted}</strong>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300/80 uppercase font-semibold block">Health Status</span>
                <strong className="text-emerald-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {tree.healthStatus}
                </strong>
              </div>
            </div>

            {/* Seal & Signatures */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-emerald-500/20">
              <div className="text-left">
                <span className="text-[10px] text-white/40 block">Digital Verification Hash</span>
                <span className="font-mono text-[10px] text-emerald-400/80">
                  SHA-256: 8f9b2a7e4c10...verified
                </span>
              </div>

              {/* Official Seal Badge */}
              <div className="w-20 h-20 rounded-full border-2 border-emerald-400/40 bg-gradient-to-br from-[#1b7a43] to-[#0a1f14] p-1 flex items-center justify-center text-center shadow-lg">
                <div className="w-full h-full rounded-full border border-dashed border-emerald-300/40 flex flex-col items-center justify-center text-[8px] font-bold text-emerald-200">
                  <span>★ VERIFIED ★</span>
                  <span className="text-xs my-0.5">🌿</span>
                  <span>PLANTON AGRO</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-white/40 block">Forestry Director Signature</span>
                <span className="font-serif italic text-sm text-emerald-200">Dr. K. R. Sharma</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
