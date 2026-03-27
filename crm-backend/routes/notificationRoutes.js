// routes/notificationRoutes.js  ← REPLACE existing file
const express = require("express");
const router  = express.Router();
const {
  getNotifications,
  toggleDone,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth.middleware");

router.get(  "/",     protect, getNotifications);
router.post( "/done", protect, toggleDone);

module.exports = router;