import { useState } from "react";
import { AdminTabType } from "../types";
import { Certificate, certificateService } from "@/services/certificates/certificate.service";
import type { AdminData } from "./useAdminData";
import type { ShowToast } from "./useAdminToast";

interface Params {
  data: AdminData;
  showToast: ShowToast;
  setActiveTab: (tab: AdminTabType) => void;
}

export function useCertificateActions({ data, showToast, setActiveTab }: Params) {
  const { setCertificates, setOrders } = data;
  const [showIssueCertModal, setShowIssueCertModal] = useState(false);
  const [selectedCertForInspect, setSelectedCertForInspect] = useState<Certificate | null>(null);
  const [selectedCertForEdit, setSelectedCertForEdit] = useState<Certificate | null>(null);
  const [isSubmittingCert, setIsSubmittingCert] = useState(false);

  const handleRefreshCertificates = async () => {
    try {
      const res = await certificateService.getCertificates({ limit: 200 });
      if (res?.data?.items) {
        setCertificates(res.data.items);
        showToast("Certificate registry refreshed from ledger.");
      }
    } catch {
      showToast("Failed to refresh certificates.");
    }
  };

  const handleCreateCertificate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingCert(true);
    const fd = new FormData(e.currentTarget);
    const orderRef = (fd.get("orderRef") as string)?.trim();
    const recipientName = (fd.get("recipientName") as string)?.trim();
    const adopterName = (fd.get("adopterName") as string)?.trim() || recipientName;
    const dedicatedMessage = (fd.get("dedicatedMessage") as string)?.trim();
    const treeSpecies = (fd.get("treeSpecies") as string)?.trim() || undefined;
    const treeTag = (fd.get("treeTag") as string)?.trim() || undefined;
    const reserveName = (fd.get("reserveName") as string)?.trim() || undefined;
    const status = (fd.get("status") as any) || "Issued";
    const certificateNumber = (fd.get("certificateNumber") as string)?.trim() || undefined;

    try {
      const res = await certificateService.createCertificate({
        orderRef,
        recipientName,
        adopterName,
        dedicatedMessage,
        treeSpecies,
        treeTag,
        reserveName,
        status,
        certificateNumber,
      });

      if (res.data) {
        const newCert = res.data;
        setCertificates((prev) => [newCert, ...prev.filter((c) => c.id !== newCert.id)]);
        if (orderRef) {
          setOrders((prev) =>
            prev.map((o) =>
              o.orderNumber === orderRef ? { ...o, certificateId: newCert.certificateNumber } : o
            )
          );
        }
      }
      setShowIssueCertModal(false);
      showToast(`✓ Certificate Deed issued successfully for "${recipientName}"!`);
      setActiveTab("certificates");
    } catch (err: any) {
      console.warn("Certificate creation error:", err);
      showToast(err.message || "Failed to issue certificate deed.");
    } finally {
      setIsSubmittingCert(false);
    }
  };

  const handleUpdateCertificate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCertForEdit) return;
    setIsSubmittingCert(true);
    const fd = new FormData(e.currentTarget);
    const id = (fd.get("id") as string) || selectedCertForEdit.id;
    const recipientName = (fd.get("recipientName") as string)?.trim() || selectedCertForEdit.recipientName;
    const adopterName = (fd.get("adopterName") as string)?.trim() || selectedCertForEdit.adopterName;
    const treeSpecies = (fd.get("treeSpecies") as string)?.trim() || selectedCertForEdit.treeSpecies;
    const treeTag = (fd.get("treeTag") as string)?.trim() || selectedCertForEdit.treeTag;
    const reserveName = (fd.get("reserveName") as string)?.trim() || selectedCertForEdit.reserveName;
    const dedicatedMessage = (fd.get("dedicatedMessage") as string)?.trim() || selectedCertForEdit.dedicatedMessage;
    const status = (fd.get("status") as any) || selectedCertForEdit.status;
    const certificateNumber = (fd.get("certificateNumber") as string)?.trim() || selectedCertForEdit.certificateNumber;

    try {
      const res = await certificateService.updateCertificate(id, {
        recipientName,
        adopterName,
        treeSpecies,
        treeTag,
        reserveName,
        dedicatedMessage,
        status,
        certificateNumber,
      });

      const updated = res.data || {
        ...selectedCertForEdit,
        recipientName,
        adopterName,
        treeSpecies,
        treeTag,
        reserveName,
        dedicatedMessage,
        status,
        certificateNumber,
      };

      setCertificates((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedCertForInspect?.id === id) {
        setSelectedCertForInspect(updated);
      }
      setSelectedCertForEdit(null);
      showToast(`✓ Certificate deed ${certificateNumber} updated.`);
    } catch (err: any) {
      console.warn("Certificate update error:", err);
      showToast(err.message || "Failed to update certificate deed.");
    } finally {
      setIsSubmittingCert(false);
    }
  };

  const handleRevokeCertificate = async (id: string, certNumber?: string) => {
    try {
      const res = await certificateService.revokeCertificate(id);
      const updated = res.data;
      setCertificates((prev) =>
        prev.map((c) => (c.id === id ? (updated ? updated : { ...c, status: "Revoked" }) : c))
      );
      if (selectedCertForInspect?.id === id) {
        setSelectedCertForInspect((prev) => (prev ? (updated ? updated : { ...prev, status: "Revoked" }) : null));
      }
      showToast(`🚫 Deed ${certNumber || id} has been officially revoked.`);
    } catch (err: any) {
      console.warn("Certificate revocation error:", err);
      showToast(err.message || "Failed to revoke certificate.");
    }
  };

  const handleRegenerateCertificate = async (id: string, certNumber?: string) => {
    try {
      const res = await certificateService.regenerateCertificate(id);
      if (res.data) {
        const regenCert = res.data;
        setCertificates((prev) => prev.map((c) => (c.id === id ? regenCert : c)));
        if (selectedCertForInspect?.id === id) {
          setSelectedCertForInspect(regenCert);
        }
      }
      showToast(`⚡ Certificate ${certNumber || id} regenerated with fresh cryptographic hash!`);
    } catch (err: any) {
      console.warn("Certificate regeneration error:", err);
      showToast(err.message || "Failed to regenerate certificate.");
    }
  };

  return {
    showIssueCertModal,
    setShowIssueCertModal,
    selectedCertForInspect,
    setSelectedCertForInspect,
    selectedCertForEdit,
    setSelectedCertForEdit,
    isSubmittingCert,
    handleRefreshCertificates,
    handleCreateCertificate,
    handleUpdateCertificate,
    handleRevokeCertificate,
    handleRegenerateCertificate,
  };
}

export type CertificateActions = ReturnType<typeof useCertificateActions>;
