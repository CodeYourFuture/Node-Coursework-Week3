const express = require("express");
const cors = require("cors");
const moment = require("moment");
// validator ("....@email.com");
const validator = require("email-validator");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Create a new booking
app.post("/bookings", (req, res) => {
  //  res.send(req.body);
  const index = bookings.length;

  const newBookings = {
    id: index + 1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
// reject requests to create bookings if any property of the booking object is missing or empty
  if (
    !newBookings.title ||
    !newBookings.firstName ||
    !newBookings.surname ||
    !newBookings.email ||
    !newBookings.roomId ||
    !newBookings.checkInDate ||
    !newBookings.checkOutDate
  ) {
    return res.status(404).json({ message: "Please fill in all information!" });
  } 
  if(!validator.validate(newBookings.email)){
    return res.status(404).send({ message: "invalid email address" });
  }
  if((new Date (newBookings.checkOutDate)) < (new Date (newBookings.checkInDate))){
    res.status(404).send({ message: "Please check your Date!" });
  }
  bookings.push(newBookings);
  res.json(bookings);
});

// Level 3 (Optional, advanced) - search by date And Level 5 (Optional, easy) - free-text search
app.get("/bookings/search", function (req, res) {
  const date = req.query.date;
  const term = req.query.term;
  if (!term && !date) {
    res.status(404).json("Not found!!");
    return;
  }

  if (moment(date, "YYYY-MM-DD", true).isValid()) {
    let result = bookings.filter(
      (booking) =>
        moment(date).isBetween(booking.checkInDate, booking.checkOutDate ) ||
        moment(date).isSame(booking.checkInDate) ||
        moment(date).isSame(booking.checkOutDate)
    );
    result.length > 0
      ? res.send(result)
      : res.status(404).send("There isn't record ...");
    return;
  } else if (date) {
    res.status(400).json('Please enter a valid date, format should like "YYYY-MM-DD"');
    return;
  }

  const searchTerm = bookings.filter((booking) =>
    `${booking.firstName} ${booking.surname} ${booking.email}`
      .toLowerCase()
      .includes(term.toLowerCase())
  );
  if (term && searchTerm.length > 0) {
    res.json(searchTerm);
  } else if (term) {
    res.status(404).json("Server couldn't find your term");
  }
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const foundId = bookings.some((booking) => booking.id === +req.params.id);
  if (foundId) {
    res.send(bookings.filter((booking) => booking.id === +req.params.id));
  } else {
    res
      .status(404)
      .json({ message: `No booking with the id of ${req.params.id}` });
  }
});

// Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const foundId = bookings.some((booking) => booking.id === +req.params.id);
  if (foundId) {
    res.json({
      msg: `Booking deleted ${req.params.id}`,
      message: bookings.filter((booking) => booking.id !== +req.params.id),
    });
  } else {
    res
      .status(404)
      .json({ message: `No booking with the id of ${req.params.id}` });
  }
});

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
