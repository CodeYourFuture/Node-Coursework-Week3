const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");
const validator = require("email-validator");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
// Helper Functions
function isInvalidId(id, index, response) {
  if (index < 0) {
    response.status(400).send("No booking with Id: " + id + " is found");
  }
}
// Get all bookings
app.get("/bookings", (req, res) => {
  if (bookings.length <= 0) {
    res.status(500).send("No Available Data");
  }
  res.json(bookings);
});

// Search bookings
app.get("/bookings/search", (req, res) => {
  let searchDate = req.query.dat;
  let searchTerm = req.query.term;

  let filteredBookings = bookings.filter(
    (e) =>
      (searchDate &&
        moment(e.checkInDate) <= moment(searchDate) &&
        moment(e.checkOutDate) >= moment(searchDate)) ||
      (searchTerm &&
        (e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.email.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (filteredBookings.length <= 0) {
    (searchTerm || searchDate) && res.status(400).send("No results");
  }
  if (!searchTerm && !searchDate) {
    res.status(400).send("Please enter search term");
  }
  res.send(filteredBookings);
});

// Get one booking by id
app.get("/bookings/:id", (req, res) => {
  let bookingIndex = bookings.findIndex((e) => e.id == req.params.id);

  isInvalidId(req.params.id, bookingIndex, res);

  if (bookingIndex >= 0) {
    let booking = bookings[bookingIndex];
    res.json(booking);
  }
});

// Create new booking
app.post("/bookings",   (req, res) => {
  for (const key in bookings[0]) {
    if (!req.body[key] && key !== "id") {
      res.status(400).send("Please enter all fields");
    }
  }
  if (validator.validate(req.body.email) === false) {
    res.status(400).send("Please enter a valid email");
  }
  if (moment(req.body.checkInDate) > moment(req.body.checkOutDate)) {
    res.status(400).send("Please enter a valid dates");
  }

  const newBooking = {
    id: uuid.v4(),
    roomId: req.body.roomId,
    title: req.body.title,
    firstName: req.body.firstName,
    username: req.body.username,
    email: req.body.email,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  bookings.push(newBooking);
  res.json(newBooking);
});

// Delete one booking by id
app.delete("/bookings/:id",   (req, res) => {
  let deleteBooking = bookings.findIndex((e) => e.id == req.params.id);

  isInvalidId(req.params.id, deleteBooking, res);

  bookings.splice(deleteBooking, 1);
  res.send("booking deleted");
});

app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
