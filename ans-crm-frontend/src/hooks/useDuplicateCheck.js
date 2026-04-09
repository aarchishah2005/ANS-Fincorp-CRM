// hooks/useDuplicateCheck.js
// ── Reusable hook — drop into any form that has a mobile field ────────────
// Usage:
//   const { duplicates, checkMobile, clearDuplicates } = useDuplicateCheck(excludeLeadId)
//   <input onBlur={(e) => checkMobile(e.target.value)} />

import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkDuplicateMobile, addCoAssigneeToLead } from "../api/leads";

// Normalise mobile locally (mirrors backend logic) — skips very short strings
const normaliseMobile = (mobile) => {
  if (!mobile) return "";
  let m = String(mobile).replace(/[\s\-\.]/g, "");
  if (m.startsWith("+91")) m = m.slice(3);
  if (m.startsWith("91") && m.length === 12) m = m.slice(2);
  if (m.startsWith("0"))  m = m.slice(1);
  return m;
};

const useDuplicateCheck = (excludeLeadId = "") => {
  // duplicateMap: { [normalisedMobile]: { isChecking, leads } }
  const [duplicateMap, setDuplicateMap] = useState({});
  const queryClient = useQueryClient();

  // Check a single mobile on blur
  const checkMobile = useCallback(async (rawMobile) => {
    const norm = normaliseMobile(rawMobile);
    if (!norm || norm.length < 7) return;

    // Mark as checking
    setDuplicateMap((prev) => ({
      ...prev,
      [norm]: { isChecking: true, leads: [] },
    }));

    try {
      const result = await checkDuplicateMobile(rawMobile, excludeLeadId);
      setDuplicateMap((prev) => ({
        ...prev,
        [norm]: { isChecking: false, leads: result.found ? result.leads : [] },
      }));
    } catch {
      setDuplicateMap((prev) => ({
        ...prev,
        [norm]: { isChecking: false, leads: [] },
      }));
    }
  }, [excludeLeadId]);

  // Clear warning for a specific mobile (user clicked "Create New Lead")
  const clearDuplicates = useCallback((rawMobile) => {
    const norm = normaliseMobile(rawMobile);
    setDuplicateMap((prev) => {
      const next = { ...prev };
      delete next[norm];
      return next;
    });
  }, []);

  // Clear ALL warnings (e.g. on form reset)
  const clearAllDuplicates = useCallback(() => setDuplicateMap({}), []);

  // Get duplicates for a specific mobile value
  const getDuplicates = useCallback((rawMobile) => {
    const norm = normaliseMobile(rawMobile);
    return duplicateMap[norm] || { isChecking: false, leads: [] };
  }, [duplicateMap]);

  // Add co-assignee mutation (called when user picks "Edit Existing Lead")
  const { mutateAsync: addCoAssignee, isPending: isAddingCoAssignee } = useMutation({
    mutationFn: addCoAssigneeToLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    checkMobile,
    clearDuplicates,
    clearAllDuplicates,
    getDuplicates,
    addCoAssignee,
    isAddingCoAssignee,
  };
};

export default useDuplicateCheck;