const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { role }    = require("../middleware/role.middleware");
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require("../controllers/lead.controller");

router.get("/",     protect, role("admin", "sales"), getLeads);
router.post("/",    protect, role("admin", "sales"), createLead);
router.get("/:id",  protect, role("admin", "sales"), getLeadById);
router.patch("/:id",protect, role("admin", "sales"), updateLead);
router.delete("/:id", protect, role("admin"), deleteLead);

module.exports = router;
