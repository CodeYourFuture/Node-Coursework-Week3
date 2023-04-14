const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
// Helper function to find a booking by ID
function findBookingById(id) {
  return bookings.find((booking) => booking.id == id);
}

// Helper function to generate a new booking ID
function generateBookingId() {
  return Math.max(...bookings.map((booking) => booking.id), 0) + 1;
}

function generateBookingroomId() {
  return Math.max(...bookings.map((booking) => booking.roomId), 0) + 1;
}

// Route to create a new booking
app.post("/bookings", function (req, res) {
  const newBooking = req.body;
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res.status(400).send("Missing or empty booking property.");
  } else if (!validator.isEmail(newBooking.email)) {
    res.status(400).send("Invalid email address.");
  } else {
    const checkInDate = moment(newBooking.checkInDate, "YYYY-MM-DD");
    const checkOutDate = moment(newBooking.checkOutDate, "YYYY-MM-DD");
    if (
      !checkInDate.isValid() ||
      !checkOutDate.isValid() ||
      !checkOutDate.isAfter(checkInDate)
    ) {
      res.status(400).send("Invalid date(s).");
    } else {
      newBooking.id = generateBookingId();
      newBooking.roomId = generateBookingroomId();
      bookings.push(newBooking);
      res.status(201).send("you added new booking");
    }
  }
});
// Route to read all bookings
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

// Route to search bookings by date
app.get("/bookings/search", function (req, res) {
  const date = moment(req.query.date, "YYYY-MM-DD");
  const term = req.query.term;
  if (!date.isValid()) {
    res.status(400).send("Invalid date.");
  } else {
    let matchingBookings = bookings.filter((booking) => {
      const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
      const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
      const isDateMatch = date.isBetween(checkInDate, checkOutDate, null, "[]");
      const isTermMatch = term
        ? booking.email.includes(term) ||
          booking.firstName.includes(term) ||
          booking.surname.includes(term)
        : true;
      return isDateMatch && isTermMatch;
    });
    res.json(matchingBookings);
  }
});

// Route to read one booking by ID
app.get("/bookings/:id", function (req, res) {
  const bookingId = parseInt(req.params.id);
  const booking = findBookingById(bookingId);
  if (booking) {
    res.json(booking);
  } else {
    res.status(404).send("Booking not found.");
  }
});

// Route to delete a booking by ID
app.delete("/bookings/:id", function (req, res) {
  const bookingId = parseInt(req.params.id);
  const bookingIndex = bookings.findIndex((booking) => booking.id == bookingId);
  if (bookingIndex !== -1) {
    bookings.splice(bookingIndex, 1);
    res.sendStatus(204).json(bookings);
  } else {
    res.status(404).send("Booking not found.");
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
