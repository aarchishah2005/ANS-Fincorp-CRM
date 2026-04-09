const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { role }    = require("../middleware/role.middleware");
const {
  getLeads,
  getGroups,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addNote,
  checkDuplicate,   // NEW
  addCoAssignee,    // NEW
} = require("../controllers/lead.controller");

// ── Static routes MUST come before /:id ──────────────────────────────────
router.get("/groups",           protect, role("admin", "sales"), getGroups);
router.get("/check-duplicate",  protect, role("admin", "sales"), checkDuplicate);  // NEW

// ── Collection ────────────────────────────────────────────────────────────
router.get("/",   protect, role("admin", "sales"), getLeads);
router.post("/",  protect, role("admin", "sales"), createLead);

// ── Single lead ───────────────────────────────────────────────────────────
router.get("/:id",    protect, role("admin", "sales"), getLeadById);
router.patch("/:id",  protect, role("admin", "sales"), updateLead);
router.delete("/:id", protect, role("admin"),           deleteLead);

// ── Sub-resources ─────────────────────────────────────────────────────────
router.post("/:id/notes",       protect, role("admin", "sales"), addNote);
router.patch("/:id/co-assignee",protect, role("admin", "sales"), addCoAssignee);  // NEW

module.exports = router;