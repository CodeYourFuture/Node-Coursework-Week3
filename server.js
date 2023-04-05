const express = require("express");
const cors = require("cors");
const validator = require("email-validator");
const moment = require("moment");

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// const allBookings = [bookings];

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// READ ALL BOOKINGS
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// CREATE NEW BOOKINGS
app.post("/bookings", function (request, response) {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = request.body;

  const newBooking = {
    id: bookings.length + 1,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };

  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response.status(400).json({
      message: "Please fill in all required sections and enter valid email",
    });
  }

  if (!validator.validate(newBooking.email)) {
    return response.status(400).json({ message: "Please enter valid email" });
  }

  if (moment(newBooking.checkOutDate).isBefore(newBooking.checkInDate)) {
    return response
      .status(400)
      .json({ message: "Check Out Date has to be after Check In Date" });
  }

  bookings.push(newBooking);
  response.status(201).json({ message: "New Booking added", bookings });
});

// GET BOOKINGS BY SEARCH TERM
app.get("/bookings/search", function (request, response) {
  // const searchDate = request.query.date;
  const searchTerm = request.query.term;

  const filteredResults = bookings.filter(
    (eachBooking) =>
      eachBooking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eachBooking.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eachBooking.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  response.json(filteredResults);
});

// FIND BOOKING BY ID
app.get("/bookings/:id", function (request, response) {
  const foundBooking = bookings.find(
    (eachBooking) => eachBooking.id === parseInt(request.params.id)
  );
  foundBooking
    ? response.json(foundBooking)
    : response
        .status(404)
        .json({ message: `Customer ${request.params.id} not found` });
});

// DELETE BOOKINGS
app.delete("/bookings/:id", function (request, response) {
  const foundBooking = bookings.find(
    (eachBooking) => eachBooking.id === parseInt(request.params.id)
  );
  if (foundBooking) {
    response.json({
      message: `Customer ${request.params.id} deleted`,
      customersRemaining: bookings.filter(
        (eachBooking) => eachBooking.id !== parseInt(request.params.id)
      ),
    });
  } else {
    response
      .status(404)
      .json({ message: `Customer ${request.params.id} not found` });
  }
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
