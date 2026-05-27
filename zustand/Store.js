import { create } from "zustand";

export const useAppStore = create((set) => ({
  scratchCards: [],

  setScratchCards: (updatedCards) => set({ scratchCards: updatedCards }),
  updateScratchStatus: (id) =>
    set((state) => ({
      scratchCards: state.scratchCards.map((card) =>
        card.id === id ? { ...card, IsScratched: true } : card
      ),
    })),

  AllBankData: [],
  setAllBankData: (data) => set({ AllBankData: data }),

  // selectedState: '',
  // selectedCity: '',
  // selecedBranch: '',
  // setSelectedState: (data) => set({ selectedState: data }),
  // setselectedCity: (data) => set({ selectedCity: data }),
  // setselecedBranch: (data) => set({ selecedBranch: data }),

  selecedIFSC: "",
  setSelectedIFSC: (data) => set({ selecedIFSC: data }),

  operatorCircle: "",
  setSelectedOperator: (data) => set({ operatorCircle: data }),
}));

export const useUserStore = create((set) => ({
  mobileNumber: "9935078066", // Default empty string
  balance: 0, // Default wallet balance

  setMobileNumber: (number) => set({ mobileNumber: number }),
  setBalance: (balance) => set({ balance: balance }),
}));
