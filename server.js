const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Import uuid library
const { v4: uuidv4 } = require("uuid"); //uuidv4()

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
// const { application } = require("express");

// app root
app.get("/", (req, res) => {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Get all bookings
app.get("/bookings", (req, res) => {
  bookings.length > 0 ? res.status(200).json(bookings) : res.status(404);
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

  // Check a value is present, as the `newBooking` object is using a
  // predefined template the properties will always be present so I
  // dont believe a properties check in necessary???.
  const checkNewBookingValues = Object.values(newBooking).filter(
    (info) => info.toString().length > 0
  );

  if (checkNewBooking.length < 8) {
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
