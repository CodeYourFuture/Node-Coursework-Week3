const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
let bookingNum = bookings.length + 1;

// root
app.get("/", (req, res) => {
  res.json("Hotel booking server.  Ask for /bookings, etc.");
});

// get all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// adds a new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: bookingNum,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: parseInt(req.body.roomId),
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  const validEmail = validator.validate(req.body.email);
  bookingNum++;
  !newBooking.title ||
  !newBooking.firstName ||
  !newBooking.surname ||
  !newBooking.roomId ||
  !newBooking.checkInDate ||
  !newBooking.checkOutDate ||
  !validEmail ||
  moment(newBooking.checkInDate).isAfter(moment(newBooking.checkOutDate))
    ? res.status(400).json({ msg: "Booking information incomplete" })
    : bookings.push(newBooking);
  res.status(200).json({
    msg: `Booking made on ${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
  });
});

// search for a booking within a given time period
app.get("/bookings/search", (req, res) => {
  const startDate = req.query.start;
  const endDate = req.query.end;
  const filteredBookings = bookings.filter(
    (booking) =>
      moment(booking.checkInDate).isAfter(startDate) &&
      moment(booking.checkInDate).isBefore(endDate)
  );
  res.json(filteredBookings);
});

// app.get()

// get a booking by its id
app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookingId = bookings.find((booking) => booking.id === id);
  bookingId !== undefined
    ? res.status(200).json(bookingId)
    : res.status(404).json({ msg: "Booking not found" });
});

// deletes a booking
app.delete("/bookings/:id", (req, res) => {
  const deletedId = req.params.id;
  console.log(deletedId);
  const deletedBooking = bookings.filter((booking) => {
    return booking.id === parseInt(deletedId);
  });
  console.log(deletedBooking);
  deletedBooking.length === 0
    ? res.status(404).json({ msg: "Booking not found" })
    : bookings.splice(bookings.indexOf(deletedBooking[0]), 1);
  res.json({ msg: `Booking ${deletedId} deleted.` });
});

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
