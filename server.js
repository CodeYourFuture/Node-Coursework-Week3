const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 9090 || process.env.PORT;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//Creating new booking
app.post("/bookings", (req, res) => {
  const newBookings = req.body;

  if (newBookings) {
    bookings.push(newBookings);
    res.status(201).json({ message: "Booking created successfully" });
  } else {
    res.status(400).json({ message: "Invalid booking data" });
  }
});

// Reeding all Bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Read one Bookings by an ID
app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookingByID = bookings.find((booking) => booking.id === id);
  if (bookingByID) {
    res.send(bookingByID);
  } else {
    res.status(404).json(`Booking not found`);
  }
});

// Delete one Bookings by an ID
app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookingIndex = bookings.findIndex((booking) => booking.id === id);
  if (bookingIndex >= 0) {
    bookings.splice(bookingIndex, 1);
    res.json({ message: "Booking delete successfully" });
  } else {
    res.status(404).json(`Booking not found`);
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
