const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Create new booking
app.post("/booking", (req, res) => {
  let { title, firstName, surname, email, roomId, checkInDate, checkOutDate } =
    req.body;
  req.body.id = bookings.length + 1;
  bookings.push(req.body);
  res.send({ booking: "Booking is recorded successfully!" });
});

//Read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

//Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const findById = bookings.find((booking) => booking.id === bookingId);
  findById
    ? res.send(findById)
    : res.status(404).send("Booking can not found!");
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const checkIfBookingExist = bookings.find(
    (booking) => booking.id === bookingId
  );
  if (checkIfBookingExist) {
    bookings = bookings.filter((booking) => booking.id !== bookingId);
    res.send(bookings);
  } else {
    res.status(404).send("Booking can not found!");
  }
});

app.listen(3001, () => {console.log("app now listening on port 3001"), 3001});
