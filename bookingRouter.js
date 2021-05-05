const express = require("express");
const bookingController = require("./bookingController");

const router = express.Router();

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
