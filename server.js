const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
let bookingNum = bookings.length+1;


app.get("/", (req, res) => {
  res.json("Hotel booking server.  Ask for /bookings, etc.");
});

// get all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: bookingNum,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate
  }
  bookingNum++;
  bookings.push(newBooking);
  res.status(200).json({
    msg: `Booking made on ${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
  });
  
});

// get a booking by its id
app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookingId = bookings.find((booking) => booking.id === id);
  bookingId !== undefined
    ? res.status(200).json(bookingId)
    : res.status(404).json({ msg: "Booking not found" });
});

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
