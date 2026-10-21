import { useCallback, useState } from "react";

export type ShowToast = (msg: string) => void;

export function useAdminToast() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback<ShowToast>((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);
  return { toastMessage, showToast };
}
