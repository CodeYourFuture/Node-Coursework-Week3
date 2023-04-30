const express = require("express");
const cors = require("cors");
const moment = require("moment");
const emailValidator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//Create a new booking
app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  //check all field been filled up
  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    res.json({ msg: "newBooking has empty field" });
  } //validate email
  else if (!emailValidator.validate(email)) {
    res.status(400).json({ msg: "please enter the valid email" });
  } else if (!moment(checkOutDate).isAfter(checkInDate)) {
    res.status(400).json({ msg: "checkOutDate is after checkInDate" });
  } else {
    const newBooking = req.body;
    //creating id for the new booking
    newBooking.id = Math.max(...bookings.map((booking) => booking.id), 0) + 1;
    bookings.push(newBooking);
    res.json(bookings);
  }
});
//search by date and term
app.get("/bookings/search", (req, res) => {
  if (!req.query.term && !req.query.date)
    return res.status(422).json({ msg: "no date no term" });
  if (req.query.date) {
    const date = moment(req.query.date, "YYYY-MM-DD");
    if (date.isValid()) {
      const filteredBooking = bookings.filter((booking) => {
        return date.isBetween(
          booking.checkInDate,
          booking.checkOutDate,
          null,
          "[]"
        );
      });
      res.json(filteredBooking);
    } else {
      res
        .status(400)
        .json({ msg: "please enter the date format correctly YYYY-MM-DD" });
    }
  } else {
    const term = req.query.term;
    filteredBooking = bookings.filter(
      (booking) =>
        booking.firstName.toLowerCase().includes(term.toLowerCase()) ||
        booking.surname.toLowerCase().includes(term.toLowerCase()) ||
        booking.email.toLowerCase().includes(term.toLowerCase())
    );
    res.json(filteredBooking);
  }
});

//read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});
// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  let booking = bookings.find((booking) => booking.id === bookingId);
  if (booking) {
    res.json(booking);
  } else {
    res
      .status(404)
      .json({ msg: "the booking to be read cannot be found by id" });
  }
});
//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );
  if (bookingIndex === -1) {
    res
      .status(404)
      .json({ msg: "the booking to be delete cannot be found by id" });
  } else {
    bookings.splice(bookingIndex, 1);
    res.json(bookings);
  }
});

const listener = app.listen(43201, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
