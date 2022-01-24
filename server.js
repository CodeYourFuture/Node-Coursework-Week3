const express = require("express");
const moment = require("moment");
const validator = require("email-validator");
// const cors = require("cors");

const app = express();

app.use(express.json());
// app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// See All Bookings
app.get("/bookings", function (request, response) {
  response.status(200).json(bookings);
});

// Search for booking with Date
// Method: /bookings/search?date=2019-05-20
// Run this command to use moment (npm install moment --save)
// https://momentjscom.readthedocs.io/en/latest/moment/05-query/06-is-between/
app.get("/bookings/search", function (request, response) {
  const searchedDate = new Date(request.query.date);

  const filteredBookings = bookings.filter((booking) => {
    return moment(`${searchedDate}`).isBetween(
      `${booking.checkInDate}`,
      `${booking.checkOutDate}`
    );
  });

  if (filteredBookings.length === 0) {
    response
      .status(400)
      .json({ msg: `No booking related to date:${searchedDate} found ` });
  }
  response.status(200).json(filteredBookings);
});

// Search for booking with Name or Email
// Method: /bookings/search?term=jones
app.get("/bookings/search", function (request, response) {
  const searchTerm = request.query.term;
  const filteredBookings = bookings.filter((booking) => {
    return (
      booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  if (filteredBookings.length === 0) {
    response
      .status(400)
      .json({ msg: `No booking found related to term ${searchTerm}` });
  }
  return response.json(filteredBookings);
});

// Create A booking
app.post("/bookings", function (request, response) {
  const newBooking = {
    id: 0,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: 0,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };
  // Simple Validation
  if (
    !request.body.title ||
    !request.body.firstName ||
    !request.body.surname ||
    !request.body.email ||
    !request.body.checkInDate ||
    !request.body.checkOutDate
  ) {
    response
      .status(400)
      .json({ msg: "Please fill in all the required fields!" });
  }
  //npm install email-validator
  if (!validator.validate(`${request.body.email}`)) {
    response.status(400).json({
      msg: `Invalid email address:${request.body.email}`,
    });
  }
  if (
    new Date(`${request.body.checkOutDate}`) <=
    new Date(`${request.body.checkInDate}`)
  ) {
    response.status(400).json({
      msg: "Check In Date can not be same or greater than Check Out Date",
    });
  }
  bookings.push(newBooking);
  newBooking.id = bookings.indexOf(newBooking) + 1;
  newBooking.roomId = newBooking.id + 5;
  return response.json(bookings);
});

// Get a booking with a specific ID
app.get("/bookings/:id", function (request, response) {
  const requestedBooking = bookings.filter(
    (booking) => booking.id == request.params.id
  );
  if (requestedBooking.length <= 0) {
    response.status(404).json({
      msg: `You have searched for an invalid id:${request.params.id}`,
    });
  } else {
    response.status(200).json(requestedBooking);
  }
});

// Delete a booking
app.delete("/bookings/:id", function (request, response) {
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id == request.params.id
  );
  if (bookingIndex < 0) {
    response.status(404).json({
      msg: `You have searched for an invalid Booking id:${request.params.id}`,
    });
  } else {
    bookings.splice(bookingIndex, 1);
    response.status(200).json({
      msg: `Booking with id:${request.params.id} has been deleted`,
    });
  }
});

// TODO add your routes and helper functions here
const PORT = process.env.PORT;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
