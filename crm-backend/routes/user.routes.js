const express     = require("express");
const router      = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { role }    = require("../middleware/role.middleware");
const {
  getSalespersons,
  addSalesperson,
  updateSalesperson,
  deleteSalesperson,
} = require("../controllers/user.controller");

router.get("/",      protect, role("admin"), getSalespersons);
router.post("/",     protect, role("admin"), addSalesperson);
router.patch("/:id", protect, role("admin"), updateSalesperson);
router.delete("/:id",protect, role("admin"), deleteSalesperson);

module.exports = router;
