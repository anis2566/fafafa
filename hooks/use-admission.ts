import { AdmissionPayment } from "@prisma/client";
import { create } from "zustand";

interface AdmissionState {
  open: boolean;
  id: string;
  admission: AdmissionPayment | null;
  onOpen: (id: string, admission: AdmissionPayment) => void;
  onClose: () => void;
}

export const useAddmission = create<AdmissionState>()((set) => ({
  open: false,
  id: "",
  admission: null,
  onOpen: (id, admission) => set({ open: true, id, admission }),
  onClose: () => set({ open: false, id: "", admission: null }),
}));
