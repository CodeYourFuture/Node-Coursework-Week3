const express = require("express");
const bookings = require("./bookings.json");
const fs = require("fs").promises;

const bookingsRouter = express.Router();


// ----------- Getting All -----------
const getAllBookings = (req, res) => {
  fs.readFile("./bookings.json", "utf8")
    .then(bookings => {
      bookings = JSON.parse(bookings);
      res.status(200).json({ data: bookings });
    });
};


// ----------- Posting -----------
const postBooking = (req, res) => {
  const { title, firstName, surname, email, roomId, checkInDate, checkOutDate } = req.body;
  const id = bookings[bookings.length - 1].id + 1;
  const newBooking = {
    id, title, firstName, surname, email, roomId, checkInDate, checkOutDate
  };

  bookings.push(newBooking);

  fs.writeFile("./bookings.json", JSON.stringify(bookings));
  res.status(200).json("Your booking added");
}


// ----------- Getting One -----------
const getOneBooking = (req, res) => {

  const { id } = req.params;

  const bookingFiltered = bookings.find(eachBook => eachBook.id === parseInt(id));

  fs.readFile("./bookings.json", "utf8")
    .then(bookings => res.status(200).json({ data: bookingFiltered }));
};


// ----------- Delete -----------
const deleteBooking = (req, res) => {
  const { id } = req.params;

  const bookingIndex = bookings.findIndex(eachBooking => eachBooking.id === parseInt(id));
  bookings.splice(bookingIndex, 1);

  fs.writeFile("./bookings.json", JSON.stringify(bookings));
  res.status(200).json("Booking deleted");
};


// ----------- Update -----------
const updateBooking = (req, res) => {
  const { id } = req.params;
  const destructuredBody = {
    id, title, firstName, surname, email, roomId, checkInDate, checkOutDate
  } = req.body;
  const newBooking = { id, destructuredBody };

  const bookingIndex = bookings.findIndex(eachBooking => eachBooking.id === parseInt(id));
  bookings.splice(bookingIndex, 1, newBooking);

  fs.writeFile("./bookings.json", JSON.stringify(bookings));
  res.status(200).json("message updated");
};


bookingsRouter.route("/")
  .get(getAllBookings)
  .post(postBooking);

bookingsRouter.route("/:id")
  .get(getOneBooking)
  .delete(deleteBooking)
  .put(updateBooking);

module.exports = bookingsRouter;