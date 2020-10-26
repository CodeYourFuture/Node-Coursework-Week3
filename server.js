const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();
const PORT = "3009" || process.env.PORT;
app.use(express.json());
app.use(cors());
app.use(express.json());
//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Route to Post new Booking

app.post("/booking", (req, res) => {
  const newBooking = {
    id: req.body.id,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  // usually we do the validation in both the front end and in the backend , I have this validation
  //for the sake of simplicity

  if (
    !newBooking.id ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  )
    return res.status(400).send("Please Enter All data");

  bookings.push(newBooking);
  res.json(bookings);
});

// Route to return all bookings
app.get("/bookings", function (req, res) {
  //Route to retuen bookings in a specific date
  const searchDate = req.query.date;
  console.log(searchDate);
  if (searchDate) {
    // res.json(searchDate);
    res.json(
      bookings.filter(
        (booking) =>
          booking.checkInDate === searchDate ||
          booking.checkOutDate === searchDate
      )
    );
  } else {
    res.json(bookings);
  }
});

// Route to read booking of a specified id arguments
app.get("/booking/:id", (req, res) => {
  const queriedId = parseInt(req.params.id);
  const index = bookings.map((booking) => booking.id).indexOf(queriedId);

  if (index > -1)
    res.json(bookings.filter((booking) => booking.id === queriedId));
  res.status(404).send("No Data Found");
});

// Route to create new Booking
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// Route to delete a booking

app.delete("/booking/:id", (req, res) => {
  const queriedId = parseInt(req.params.id);
  const index = bookings.map((booking) => booking.id).indexOf(queriedId);

  if (index > -1) {
    bookings.splice(index, 1);
    res.json(bookings);
  }
  res.status(404).send("No Data Found");
});
