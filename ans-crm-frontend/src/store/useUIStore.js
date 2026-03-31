// store/useUIStore.js  ← REPLACE your existing file with this
import { create } from "zustand";

// ── Default lead filters ──────────────────────────────────────────────────
// Used by both admin (AllLeads) and sales (MyLeads) pages
const defaultLeadFilters = {
  search:      "",
  projectType: "",
  sanction:    "",
  bankName:    "",
  // Enhancement 1: location filters
  state:       "",
  district:    "",
  city:        "",
  areaEstate:  "",
  // Enhancement 5: business group filter
  groupName:   "",
};

const useUIStore = create((set) => ({

  // ── Toast notifications ────────────────────────────────────────────────
  toast: null,
  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  clearToast: () => set({ toast: null }),

  // ── Confirm dialog ─────────────────────────────────────────────────────
  confirm: null,
  showConfirm: (message, onConfirm) => {
    set({ confirm: { message, onConfirm } });
  },
  clearConfirm: () => set({ confirm: null }),

  // ── Lead filters (shared between admin AllLeads & sales MyLeads) ───────
  leadFilters: { ...defaultLeadFilters },

  setLeadFilters: (partial) =>
    set((state) => ({
      leadFilters: { ...state.leadFilters, ...partial },
    })),

  resetLeadFilters: () =>
    set({ leadFilters: { ...defaultLeadFilters } }),

}));

export default useUIStore;