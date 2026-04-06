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
  addNote,        // ← NEW
} = require("../controllers/lead.controller");

// ── Static routes FIRST (before /:id) ────────────────────────────────────
router.get("/groups", protect, role("admin", "sales"), getGroups);

// ── Collection routes ─────────────────────────────────────────────────────
router.get("/",    protect, role("admin", "sales"), getLeads);
router.post("/",   protect, role("admin", "sales"), createLead);

// ── Single lead routes ────────────────────────────────────────────────────
router.get("/:id",    protect, role("admin", "sales"), getLeadById);
router.patch("/:id",  protect, role("admin", "sales"), updateLead);
router.delete("/:id", protect, role("admin"),          deleteLead);

// ── Notes (NEW) ───────────────────────────────────────────────────────────
// POST /api/leads/:id/notes  → add a reminder note (tick + message)
// Both admin and sales can add notes (sales only to their own leads)
router.post("/:id/notes", protect, role("admin", "sales"), addNote);

module.exports = router;