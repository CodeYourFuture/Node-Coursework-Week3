const express = require("express");
const cors = require("cors");

// Import uuid library
const { v4: uuidv4 } = require("uuid");

// Import moment library
const moment = require("moment");

// Import email verification library
const emailVerifier = require("email-verifier-node");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// app root
app.get("/", (req, res) => {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Get all bookings
app.get("/bookings", (req, res) => {
  bookings.length > 0 ? res.status(200).json(bookings) : res.status(404);
});

// http://localhost:4002/bookings/search?date=2018-02-15
// Search by date
app.get("/bookings/search", (req, res) => {
  const matchingBookings = bookings.filter((booking) => {
    const checkIn = moment(booking.checkInDate);
    const checkOut = moment(booking.checkOutDate);
    const date = moment(req.query.date);

    return date.isAfter(checkIn) && date.isBefore(checkOut);
  });

  matchingBookings.length > 0
    ? res.status(200).json(matchingBookings)
    : res.status(204).json({ Success: true });
});

// Get booking by id
app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const booking = bookings.find((booking) => booking.id === id);

  booking === undefined
    ? res.status(404).json({ Success: false })
    : res.status(200).json(booking);
});

// Create new booking
app.post("/bookings/", (req, res) => {
  const newBooking = {
    id: uuidv4(),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  // Check a value is present, as the `newBooking` object is hard coded
  // properties will always be present so I dont believe a properties check in necessary???.
  const checkNewBookingValues = Object.values(newBooking).filter(
    (info) => info.toString().length > 0
  );

  // Check for a valid email
  const verifyEmailIsValid = emailVerifier.validate_email(req.body.email);

  // Check if `checkOutDate` is after `checkInDate`
  const verifyCheckOutDate = moment(req.body.checkInDate).isBefore(
    moment(req.body.checkOutDate)
  );

  if (
    checkNewBookingValues.length < 8 ||
    !verifyEmailIsValid ||
    !verifyCheckOutDate
  ) {
    res.status(400).json({ Success: false });
  } else {
    bookings.push(newBooking);
    res.status(201).json({ Success: true });
  }
});

// Delete booking
app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const bookingIndex = bookings.findIndex((booking) => booking.id === id);

  if (bookingIndex >= 0) {
    bookings.splice(bookingIndex, 1), res.status(200).json({ Success: true });
  } else {
    res.status(404).json({ Success: false });
  }
});

const listener = app.listen(process.env.PORT || 4002, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
