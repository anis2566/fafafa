import { AdmissionFee } from "@prisma/client";
import { create } from "zustand";

interface AdmissionFeeState {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useAdmissionFee = create<AdmissionFeeState>()((set) => ({
  open: false, 
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));

interface UpdateAdmissionFeeState {
  open: boolean;
  fee: AdmissionFee | null;
  id: string;
  onOpen: (fee: AdmissionFee, id: string) => void;
  onClose: () => void;
}

export const useAdmissionFeeUpdate = create<UpdateAdmissionFeeState>()(
  (set) => ({
    open: false,
    fee: null,
    id: "",
    onOpen: (fee, id) => set({ open: true, fee, id }),
    onClose: () => set({ open: false }),
  })
);

interface DeleteAdmissionFeeState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useAdmissionFeeDelete = create<DeleteAdmissionFeeState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));
