const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { role }    = require("../middleware/role.middleware");
const {
  getReportSummary,
  getReportBySales,
  getReportByDate,
} = require("../controllers/report.controller");

router.get("/summary",  protect, role("admin"), getReportSummary);
router.get("/by-sales", protect, role("admin"), getReportBySales);
router.get("/by-date",  protect, role("admin"), getReportByDate);

module.exports = router;
