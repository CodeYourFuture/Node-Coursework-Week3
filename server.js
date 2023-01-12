const express = require("express");
const cors = require("cors");
const validator = require("email-validator");
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
const maxId = Math.max(...bookings.map(ele => ele.id));
// create a new booking
app.post("/bookings", (req, res) => {

  // for (const key in bookings[0]) {
  //   if (!req.body[key] && key !== "id") {
  //     res.status(400).send("Please enter all fields");
  //   }
  // }

  // if (validator.validate(req.body.email) === false) {
  //   res.status(400).send("Please enter a valid email");
  // }

  // if (moment(req.body.checkInDate) > moment(req.body.checkOutDate)) {
  //   res.status(400).send("Please enter a valid dates");
  // }
  const newBooking = {
    id: ++maxId,
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
})

// read all bookings
app.get("/bookings", (req, res) => {
  if (bookings.length <= 0) {
    res.status(500).send("No Available Data");
  }
  res.json(bookings);
})

// read one booking by id
app.get("/bookings/:id", (req, res) => {
  let bookingIndex = bookings.findIndex(booking => booking.id == req.params.id);
  if (bookingIndex >= 0) {
    res.json(bookings[bookingIndex]);
  } else {
    res.status(500).send("No Available Data");
  }
})

// Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  let bookingIndex = bookings.findIndex(booking => booking.id == req.params.id);
  bookings.splice(bookingIndex, 1);
  res.send(`booking has been deleted successfully`);
})

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});