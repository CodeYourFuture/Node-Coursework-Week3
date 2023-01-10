const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
//read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
});
app.post("/bookings", (req, res) => {
  //validate our input
  const newBooking = req.body;
  newBooking.id = bookings.length + 1;
  //build our booking
  for (let field in newBooking) {
    if (!newBooking[field]) {
      res.status(400).send("Please fill out all fields");
    } else {
      bookings.push(newBooking);
      res.status(201).json(newBooking);
    }
  }
});

app.get("/bookings/:id", (req, res) => {
  const bookingId = parseInt(req.params.id);
  res.json(bookings.find((b) => b.id === bookingId));
});
app.delete("/bookings/:id", (req, res) => {
  const bookingId = bookings.find((b) => b.id === parseInt(req.params.id));
  if (!bookingId)
    return res.status(404).send("The booking with the given ID was not found.");
  const index = bookings.indexOf(bookingId);
  //delete
  bookings.splice(index, 1);
  res.send(bookingId);
});
app.get("bookings/search", (req, res) => {
  if (req.query.search) {
    let search = req.query.checkInDate;
    console.log(req.query.search);
    let matchedBooking = bookings.find((booking) => booking.includes(search));
    res.send(matchedBooking);
  } else {
    res.send("");
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
