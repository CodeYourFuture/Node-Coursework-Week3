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

router.delete("/bookings/:pid", (req, res, next) => {
  const bookingId = req.params.pid;
  const index = bookings.findIndex((booking) => booking.id === +bookingId);
  if (index !== -1) {
    bookings.splice(index, 1);
    res.sendStatus(200); // Send a 200 OK status code
  } else {
    res.sendStatus(404); // Send a 404 Not Found status code if booking not found
  }
});

module.exports = router;
