// hooks/useAddressBlocks.js
// ── Reusable hook for managing dynamic address arrays ─────────────────────
// Used by: LeadForm, SalesLeadEditModal, AdminAddLead, AdminLeadEditModal

import { useState } from "react";

const emptyAddress = () => ({
  label:      "",
  areaEstate: "",
  address:    "",
  city:       "",
  district:   "",
  state:      "",
  pincode:    "",
});

const useAddressBlocks = (initialOffice = null, initialFactory = null) => {
  const [officeAddresses, setOfficeAddresses] = useState(
    initialOffice?.length ? initialOffice : [emptyAddress()]
  );
  const [factoryAddresses, setFactoryAddresses] = useState(
    initialFactory?.length ? initialFactory : []
  );

  // ── Office handlers ────────────────────────────────────────────────────
  const handleOfficeChange = (index, field, value) => {
    setOfficeAddresses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addOffice = () =>
    setOfficeAddresses((prev) => [...prev, emptyAddress()]);

  const removeOffice = (index) =>
    setOfficeAddresses((prev) => prev.filter((_, i) => i !== index));

  // ── Factory handlers ───────────────────────────────────────────────────
  const handleFactoryChange = (index, field, value) => {
    setFactoryAddresses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addFactory = () =>
    setFactoryAddresses((prev) => [...prev, emptyAddress()]);

  const removeFactory = (index) =>
    setFactoryAddresses((prev) => prev.filter((_, i) => i !== index));

  // ── Reset (used in edit modal when lead prop changes) ──────────────────
  const resetAddresses = (office, factory) => {
    setOfficeAddresses(office?.length ? office : [emptyAddress()]);
    setFactoryAddresses(factory?.length ? factory : []);
  };

  return {
    officeAddresses,
    factoryAddresses,
    handleOfficeChange,
    handleFactoryChange,
    addOffice,
    addFactory,
    removeOffice,
    removeFactory,
    resetAddresses,
  };
};

export default useAddressBlocks;