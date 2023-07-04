const express = require("express");
const router = express.Router();

const bookings = require("../bookings.json");

router.get("/bookings", (req, res, next) => {
  res.json(bookings);
});

router.post("/bookings", (req, res, next) => {
  const booking = req.body;
  bookings.push(booking);
  res.json({ message: "Data received successfully" });
});

module.exports = router;
