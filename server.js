const express = require("express");
const cors = require("cors");
const validator = require("validator");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
let maxID = Math.max(...bookings.map((c) => c.id));

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Read all messages
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

//Read all messages by search term
app.get("/bookings/search", (req, res) => {
  if (req.query.term) {
    // search by term
    const term = req.query.term.toLowerCase();
    const searchResults = bookings.filter((booking) => {
      return (
        booking.firstName.toLowerCase().includes(term) ||
        booking.surname.toLowerCase().includes(term) ||
        booking.email.toLowerCase().includes(term)
      );
    });
    res.json(
      searchResults.length === 0 ? { msg: `Booking not found` } : searchResults
    );
  } else if (req.query.date) {
    // search by date
    const date = moment(req.query.date);
    const searchResults = bookings.filter((booking) => {
      return (
        moment(booking.checkInDate) <= date &&
        moment(booking.checkOutDate) >= date
      );
    });
    res.json(
      searchResults.length === 0 ? { msg: `Booking not found` } : searchResults
    );
  } else {
    res.send("Please provide a search term or date");
  }
});

//Read one Booking specified by an ID
app.get("/messages/:id", (req, res) => {
  let bookingID = parseInt(req.params.id);
  let copyOfBookings = bookings;
  let booking = copyOfBookings.find((c) => c.id === bookingID);
  if (!booking) {
    res.status(404).json({ msg: `Booking not found with the id ${bookingID}` });
    return;
  }
  res.json(booking);
});

// Create a new booking (POST)
app.use(express.json());
const compulsoryFields = [
  "title",
  "firstName",
  "surname",
  "email",
  "roomId",
  "checkInDate",
  "checkOutDate",
];
app.post("/bookings", (req, res) => {
  // validate our input
  //1.validate if all the fields are included
  if (!compulsoryFields.every((cf) => req.body.hasOwnProperty(cf))) {
    res.status(401).send("Not all compulsory fields supplied");
    return;
  }
  //2.validate the email
  if (!validator.isEmail(req.body.email)) {
    res.status(401).send("Email is not valid");
    return;
  }
  //3. validate checkoutDate is after checkinDate and format of date "yyyy-mm-dd"
  const checkIn = moment(req.body.checkInDate, "YYYY-MM-DD");
  const checkOut = moment(req.body.checkOutDate, "YYYY-MM-DD");
  if (!checkIn.isValid() && !checkOut.isValid()) {
    res.status(401).send("CheckIn/Out date is not valid");
    return;
  }
  if (!checkOut.isAfter(checkIn)) {
    res.status(401).send("CheckOut date can't be before Checkin date ");
    return;
  }
  const newEntry = { id: ++maxID };
  compulsoryFields.forEach((fld) => {
    if (req.body[fld]) {
      newEntry[fld] = req.body[fld];
    }
  });
  bookings.push(newEntry);
  res.json(newEntry);
});

// Delete Booking from bookings data(DELETE)
app.delete("/bookings/:id", function (req, res) {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.sendStatus(400);
    return;
  }
  const booking = bookings.find((a) => a.id === bookingId);
  if (!booking) {
    res.status(404).send("Booking is not found");
    return;
  }
  const index = bookings.findIndex((a) => a.id === bookingId);
  bookings.splice(index, 1);
  res.json({ msg: "booking deleted", bookings });
});
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
