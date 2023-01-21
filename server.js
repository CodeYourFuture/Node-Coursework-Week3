const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.post("/createbooking", (req, res) => {
  let newBooking = req.body;
  let newID = bookings[bookings.length - 1].id + 1;
  console.log(newBooking);

  let createbooking = {
    id: newID,
    roomId: newBooking.roomId,
    title: newBooking.title,
    firstName: newBooking.firstName,
    surname: newBooking.surname,
    email: newBooking.email,
    checkInDate: newBooking.checkInDate,
    checkOutDate: newBooking.checkOutDate,
  };
  bookings.push(createbooking);
  res.json("New booking created");
});

app.get("/bookings", (req, res) => {
  res.json(bookings);
});
app.get("/booking/:id", (req, res) => {
  const findItem = Number(req.params.id);
  const selectedBooking = bookings.filter((booking) => booking.id === findItem);

  if (selectedBooking.length === 0) {
    res.status(404).json({ message: "Booking not found" });
  } else {
    res.status(200).json(selectedBooking);
  }
});

app.delete("/booking/:id", (req, res) => {
  const findItem = Number(req.params.id);
  const selectedBooking = bookings.filter((booking) => booking.id === findItem);
  if (selectedBooking.length === 0) {
    res.status(404).json({ message: "Booking not found" });
  } else {
    bookings = bookings.filter((booking) => booking.id !== findItem);
    res.json(`Booking ${findItem} has been deleted`);
  }
});

// TODO add your routes and helper functions here
// The default app listen process.env.PORT
const listener = app.listen(5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
