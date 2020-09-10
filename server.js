const express = require("express");
const cors = require("cors");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// *******Get all bookings*****

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// *******Search booking with time span******

app.get("/bookings/search", (req, res) => {
  let date = req.query.date;
  let matchedBookings = bookings.filter(
    (book) => book.checkInDate <= date && book.checkOutDate >= date
  );
  if (matchedBookings.length > 0) {
    res.json(matchedBookings);
  } else res.send("No bookings found matching the chosen timespan");
});

// **** Create new booking *****

app.post("/bookings", (req, res) => {
  let checkInFormat = moment(req.body.checkInDate, "YYYY-MM-DD");
  let checkOutFormat = moment(req.body.checkOutDate, "YYYY-MM-DD");
  let newBooking = {
    //id: bookings.length + 1, // temp solution for now to match with other id, I can use uuid for bigger pros
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: checkInFormat,
    checkOutDate: checkOutFormat,
  };

  if (checkInFormat > checkOutFormat) {
    res.send("Check-out Date must be later than Check-in Dates");
  } else if (
    newBooking.title.length > 0 &&
    newBooking.firstName.length > 0 &&
    newBooking.surname.length > 0 &&
    newBooking.email.length > 0 &&
    typeof newBooking.roomId == "number" &&
    checkInFormat > 0 &&
    checkOutFormat
  ) {
    bookings.push(newBooking);
    res.json(bookings);
  } else {
    res.status(400).send("Please fill all required properties to book a place");
  }
});

// ******** Get one by id *******

app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  if (bookings.map((booking) => booking.id).includes(id)) {
    const selectedBooking = bookings.find((booking) => booking.id === id);
    res.json(selectedBooking);
  } else {
    res
      .status(404)
      .send(`Please enter id number between 1 and ${bookings.length}`);
  }
});

// ******** Delete one by id *******

app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  if (bookings.map((booking) => booking.id).includes(id)) {
    const selectedBooking = bookings.filter((booking) => booking.id !== id);
    res.json({ msg: `Boking with id number ${id} deleted`, selectedBooking });
  } else {
    res
      .status(404)
      .send(`Please enter id number between 1 and ${bookings.length}`);
  }
});

const listener = app.listen(process.env.PORT || 7070, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
