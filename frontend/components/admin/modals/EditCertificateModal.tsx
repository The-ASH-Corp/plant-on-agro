"use client";

import { Certificate } from "@/services/certificates/certificate.service";

import { Select } from "@/components/ui";
interface EditCertificateModalProps {
  isOpen: boolean;
  certificate: Certificate | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
}

export function EditCertificateModal({
  isOpen,
  certificate,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EditCertificateModalProps) {
  if (!isOpen || !certificate) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#e2eae5] relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-[#7a8a80] hover:text-[#173324] text-lg font-bold cursor-pointer disabled:opacity-50"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Deed Maintenance
          </span>
        </div>

        <h3
          style={{ fontFamily: "var(--font-display)" }}
          className="text-2xl text-[#173324] mb-1 font-bold"
        >
          Edit Certificate Deed
        </h3>
        <p className="text-xs text-[#55695d] mb-4">
          Update deed metadata, dedication message, or adjust status for serial{" "}
          <strong className="font-mono text-[#1b7a43]">{certificate.certificateNumber}</strong>.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <input type="hidden" name="id" value={certificate.id} />

          {/* Certificate Number & Order Ref (Read-only / verified reference) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Certificate Serial
              </label>
              <input
                name="certificateNumber"
                type="text"
                defaultValue={certificate.certificateNumber}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#f4f7f5] font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Order Reference
              </label>
              <input
                name="orderRef"
                type="text"
                readOnly
                defaultValue={certificate.orderRef}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#55695d] bg-[#f4f7f5] font-mono text-[11px] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Recipient Name & Adopter Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Recipient / Honoree Name *
              </label>
              <input
                name="recipientName"
                type="text"
                required
                defaultValue={certificate.recipientName}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Adopter / Sponsor Name
              </label>
              <input
                name="adopterName"
                type="text"
                defaultValue={certificate.adopterName}
                placeholder="e.g. Eco Hero Foundation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>
          </div>

          {/* Tree Species & Tree Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Tree Species
              </label>
              <input
                name="treeSpecies"
                type="text"
                defaultValue={certificate.treeSpecies}
                placeholder="e.g. Sacred Banyan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Physical Tree Tag
              </label>
              <input
                name="treeTag"
                type="text"
                defaultValue={certificate.treeTag}
                placeholder="e.g. POA-BA-9102"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] font-mono"
              />
            </div>
          </div>

          {/* Reserve Name & Deed Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Reserve Location
              </label>
              <input
                name="reserveName"
                type="text"
                defaultValue={certificate.reserveName}
                placeholder="e.g. Satara Plateau, Maharashtra"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324]"
              />
            </div>

            <div>
              <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
                Deed Status
              </label>
              <Select
                name="status"
                defaultValue={certificate.status}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] cursor-pointer"
              >
                <option value="Issued">Issued (Active & Verified)</option>
                <option value="Pending Generation">Pending Generation</option>
                <option value="Revoked">Revoked (Void / Canceled)</option>
              </Select>
            </div>
          </div>

          {/* Dedicated Message */}
          <div>
            <label className="font-bold text-[#3d4f45] uppercase tracking-wider block mb-1">
              Dedication Citation *
            </label>
            <textarea
              name="dedicatedMessage"
              rows={3}
              required
              defaultValue={certificate.dedicatedMessage}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2eae5] outline-none text-[#173324] bg-[#fcfaf7] focus:border-[#173324] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2eae5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#e2eae5] text-[#55695d] hover:bg-[#f4f7f5] font-semibold cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#173324] hover:bg-[#1f4230] text-white font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Modifications</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
