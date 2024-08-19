import { MonthlyFee } from "@prisma/client";
import { create } from "zustand";

interface MonthlyFeeState {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useMonthlyFee = create<MonthlyFeeState>()((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));

interface UpdateMonthlyFeeState {
  open: boolean;
  fee: MonthlyFee | null;
  id: string;
  onOpen: (fee: MonthlyFee, id: string) => void;
  onClose: () => void;
}

export const useMonthlyFeeUpdate = create<UpdateMonthlyFeeState>()((set) => ({
  open: false,
  fee: null,
  id: "",
  onOpen: (fee, id) => set({ open: true, fee, id }),
  onClose: () => set({ open: false }),
}));

interface DeleteMonthlyFeeState {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useMonthlyFeeDelete = create<DeleteMonthlyFeeState>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));
