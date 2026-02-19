import { create } from "zustand";

const useUIStore = create((set) => ({
  toast: null,
  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  confirmModal: null,
  showConfirm: (message, onConfirm) =>
    set({ confirmModal: { message, onConfirm } }),
  hideConfirm: () => set({ confirmModal: null }),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  clearSelectedLead: () => set({ selectedLead: null }),

  leadFilters: {
    search: "",
    projectType: "",
    ansClientType: "",
    visitType: "",
    sanction: "",
    industry: "",
    district: "",
    bankName: "", // ADDED FOR BANK FILTER
  },
  setLeadFilters: (filters) =>
    set((state) => ({ leadFilters: { ...state.leadFilters, ...filters } })),
  resetLeadFilters: () =>
    set({
      leadFilters: {
        search: "",
        projectType: "",
        ansClientType: "",
        visitType: "",
        sanction: "",
        industry: "",
        district: "",
        bankName: "",
      },
    }),
}));

export default useUIStore;