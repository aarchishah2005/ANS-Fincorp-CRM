const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { role }    = require("../middleware/role.middleware");
const {
  getLeads,
  getGroups,       // ← FIX: was missing, caused /groups to crash as invalid ObjectId
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require("../controllers/lead.controller");

// ⚠️  IMPORTANT: /groups MUST be registered BEFORE /:id
// otherwise Express treats "groups" as an :id param → CastError → delete breaks
router.get("/groups", protect, role("admin", "sales"), getGroups);

router.get("/",          protect, role("admin", "sales"), getLeads);
router.post("/",         protect, role("admin", "sales"), createLead);
router.get("/:id",       protect, role("admin", "sales"), getLeadById);
router.patch("/:id",     protect, role("admin", "sales"), updateLead);
router.delete("/:id",    protect, role("admin"),          deleteLead);

module.exports = router;