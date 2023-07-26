const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();
const PORT = 3000; 

app.use(express.json());
app.use(cors());

// Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

// Counter to keep track of the last assigned ID
let lastBookingId = bookings.length > 0 ? bookings[bookings.length - 1].id : 0;

app.get("/", function (request, response) {
  response.send("Hotel booking server. Ask for /bookings, etc.");
});

// Create a new booking with a generated ID
app.post("/bookings", (request, response) => {
  let newBooking = request.body;
  // Check if any property is missing or empty
  if (!isBookingValid(newBooking)) {
    console.log("Invalid booking", newBooking);
    response.status(400).send("Bad request");
  } else {
    // Generate a new ID by incrementing the counter
    lastBookingId++;
    newBooking.id = lastBookingId;
    bookings.push(newBooking);
    response.send("New booking is created");
  }
});

// Get all bookings
app.get("/bookings", (request, response) => {
  response.send({ bookings });
});

// Get booking by ID
app.get("/bookings/:id", (request, response) => {
  let bookingId = parseInt(request.params.id);
  const booking = bookings.find((booking) => booking.id === bookingId);
  if (booking) {
    response.send(booking);
  } else {
    response.status(404).send("Booking not found");
  }
});

// Delete booking by ID
app.delete("/bookings/:id", (request, response) => {
  let bookingId = parseInt(request.params.id);
  const initialLength = bookings.length;
  bookings = bookings.filter((booking) => booking.id !== bookingId);
  if (bookings.length < initialLength) {
    response.send("Booking with ID " + bookingId + " is deleted");
  } else {
    response.status(404).send("Booking not found");
  }
});

// Search bookings by date
app.get("/bookings/search", (request, response) => {
  const searchDate = request.query.date;
  if (!searchDate || !isValidDate(searchDate)) {
    response.status(400).send("Invalid date format");
  } else {
    const filteredBookings = bookings.filter((booking) =>
      moment(searchDate).isBetween(
        booking.checkInDate,
        booking.checkOutDate,
        null,
        "[]"
      )
    );
    response.send({ bookings: filteredBookings });
  }
});

// Helper function
const isBookingValid = (booking) => {
  return (
    booking.id !== undefined &&
    booking.firstName &&
    booking.surName &&
    booking.email &&
    booking.roomId &&
    booking.checkInDate &&
    booking.checkOutDate
  );
};

const isValidDate = (date) => {
  return moment(date, "YYYY-MM-DD", true).isValid();
};

app.listen(PORT, function () {
  console.log("port : " + PORT);
});
