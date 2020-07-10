const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function(req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});
// TODO add your routes and helper functions here
//create new  booking
app.post("/bookings", (req, res) => {
  let {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate
  } = req.body;

  if (checkInDate => checkOutDate) {
    res.send("Check-Out date should be later than Check-In date");
  } else if (
    title.length > 0 &&
    firstName.length > 0 &&
    surname.length > 0 &&
    email.length > 0 &&
    typeof roomId == "number" &&
    checkInDate.length > 0 &&
    checkOutDate.length > 0
  ) {
    bookings.push(req.body);
    res.send({ booking: "success" });
  } else {
    res.status(404).send("Please complete the booking form");
  }
});

// GET all bookings
app.get("/bookings", function(req, res) {
  res.send(bookings);
});

//GET booking by Id
app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const selectById = bookings.find(item => item.id === bookingId);
  selectById
    ? res.send(selectById)
    : res.status(404).send("Booking can not found");
});

//DELETE booking by Id
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const foundById = bookings.filter(item => item.id !== bookingId);
  if (foundById) {
    bookings = foundById;
    console.log(bookings);
    res.send(bookings);
  } else {
    res.status(404).send("Booking can not found");
  }
});

const port = process.env.PORT || 5000;
app.listen(port);
