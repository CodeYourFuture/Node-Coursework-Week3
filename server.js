const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// post method, adding new element
app.post("/bookings", function (request, response) {
  let newBooking = request.body;

  // checks if one of the booking details is empty
  if (
    !newBooking.id ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    response.status(400);
    response.send("Some of the booking Details are missing");

    // checks is booking id already exists
  } else if (bookings.find((booking) => booking.id === newBooking.id)) {
    response.status(400);
    response.send("booking already exists");

    // checks email is a valid one
  } else if (validator.validate(newBooking.email) === false) {
    response.send("Please Enter a valid email");

    // checks checkIn date is before checkOut
  } else if (
    moment(newBooking.checkInDate).isBefore(newBooking.checkOutDate) === false
  ) {
    response.send("Check in should be before check out date");

    // if all conditions passed it will add th new booking to bookings
  } else {
    bookings.push(newBooking);
    response.status(201);
    console.log(newBooking);
    response.send(newBooking);
  }
});

// Reading all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

// Reading a booking by ID
app.get("/bookings/:id", function (request, response) {
  // type conversion to int from string
  let id = parseInt(request.params.id);

  let filteredBooking = bookings.find((booking) => booking.id === id);

  // if no booking found
  if (!filteredBooking) {
    response.sendStatus(404);
  }
  response.send(filteredBooking);
});

// Deleting booking by Id

app.delete("/bookings/:id", (request, response) => {
  let id = parseInt(request.params.id);
  let deletedBookingIndex = bookings.findIndex((booking) => booking.id === id);
  if (deletedBookingIndex > -1) {
    bookings.splice(deletedBookingIndex, 1);
    // response.status(204);
    response.send("Booking Successfully deleted");
  } else {
    response.sendStatus(404);
  }
});

app.get("/search", (req, res) => {
  let date = req.query.date;
  let term = req.query.term;
  let filteredBookings = [];

  // no query given
  if (date === undefined && term === undefined) {
    res.send("Enter search query ");
    //query for date is given
  } else if (term === undefined) {
    filteredBookings = bookings.filter(
      (booking) =>
        moment(booking.checkInDate).isSame(date) ||
        moment(booking.checkOutDate).isSame(date)
    );

    //query for term is given
  } else if (date === undefined) {
    term = term.toLowerCase();
    filteredBookings = bookings.filter(
      (booking) =>
        booking.firstName.toLowerCase().includes(term) ||
        booking.surname.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term)
    );
  } else {
    return;
  }

  if (filteredBookings.length > 0) {
    res.send(filteredBookings);

    // Nothing found in the bookings
  } else {
    res.sendStatus(404);
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
