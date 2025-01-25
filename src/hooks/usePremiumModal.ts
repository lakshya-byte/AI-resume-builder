import { create } from "zustand";

interface PremiumModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const usePremiumModal = create<PremiumModalState>(set => ({
  open: false,
  setOpen: (open: boolean) => {
    console.log("Setting open to:", open);
    set({ open });
  }
}));

export default usePremiumModal;

