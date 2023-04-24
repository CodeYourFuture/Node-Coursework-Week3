const express = require("express");
const bookingRouter = express.Router();
const fs = require("fs").promises;
const bookings = require("./bookings.json");

const getAllBookings = (req, res) => {
  fs.readFile("./bookings.json", "utf8").then(
    (bookings) => (bookings = JSON.parse(bookings))
  );
  res.status(200).json({ data: bookings });
};

const postBooking = (req, res) => {
  const id = bookings.length + 1;
  const newBooking = { id, ...req.body };
  bookings.push(newBooking);
  fs.writeFile("./bookings.json", JSON.stringify(bookings), (err) =>
    res.status(500).json({ message: err })
  );
  res.status(200).json({ data: newBooking });
};

const getBooking = (req, res) => {
  const id = parseInt(req.params.id);
  const booking = bookings.find((eachBooking) => eachBooking.id === id);
  fs.readFile("./bookings.json", "utf8").then(
    (booking) => (booking = JSON.parse(booking))
  );
  res.status(200).json({ data: booking });
};

const deleteBooking = (req, res) => {
  const id = parseInt(req.params.id);
  const bookingIndex = bookings.findIndex(
    (eachBooking) => eachBooking.id === id
  );
  bookings.splice(bookingIndex, 1);
  res.status(200).json({ message: "Your booking deleted!" });
};

bookingRouter.route("/").get(getAllBookings).post(postBooking);

bookingRouter.route("/:id").get(getBooking).delete(deleteBooking);

module.exports = bookingRouter;
