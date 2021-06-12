const express = require("express");
const router = express.Router();
const mainRoutes = require("./main.routes");
const bookingsRoutes = require("./bookings.routes");

router.use("/", mainRoutes);
router.use("/bookings", bookingsRoutes);

module.exports = router;
