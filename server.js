const express = require("express");
const cors = require("cors");
const moment = require("moment");
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

// Route to create a new booking
app.post("/bookings", function (req, res) {
  const newBooking = req.body;
  if (
    !newBooking ||
    !newBooking.roomId ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res.status(400).send("Missing or empty booking property.");
  } else {
    newBooking.id = generateBookingId();
    bookings.push(newBooking);
    res.status(201).json(newBooking);
  }
});

// Route to read all bookings
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

// Route to search bookings by date
app.get("/bookings/search", function (req, res) {
  const date = moment(req.query.date, "YYYY-MM-DD");
  if (!date.isValid()) {
    res.status(400).send("Invalid date.");
  } else {
    const matchingBookings = bookings.filter((booking) => {
      const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
      const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
      return date.isBetween(checkInDate, checkOutDate, null, "[]");
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
