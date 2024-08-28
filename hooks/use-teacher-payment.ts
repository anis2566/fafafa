import { AdmissionFee, TeacherFee } from "@prisma/client";
import { create } from "zustand";

interface TeacherPaymentStat {
  open: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useTeacherPayment = create<TeacherPaymentStat>()((set) => ({
  open: false,
  id: "",
  onOpen: (id) => set({ open: true, id }),
  onClose: () => set({ open: false, id: "" }),
}));

interface UpdateState {
  open: boolean;
  fee: TeacherFee | null;
  id: string;
  onOpen: (fee: TeacherFee, id: string) => void;
  onClose: () => void;
}

export const useTeacherPaymentUpdate = create<UpdateState>()((set) => ({
  open: false,
  fee: null,
  id: "",
  onOpen: (fee, id) => set({ open: true, fee, id }),
  onClose: () => set({ open: false }),
}));

// interface DeleteAdmissionFeeState {
//   open: boolean;
//   id: string;
//   onOpen: (id: string) => void;
//   onClose: () => void;
// }

// export const useAdmissionFeeDelete = create<DeleteAdmissionFeeState>()((set) => ({
//   open: false,
//   id: "",
//   onOpen: (id) => set({ open: true, id }),
//   onClose: () => set({ open: false, id: "" }),
// }));
