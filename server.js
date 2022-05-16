const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");

const app = express();
const m = moment();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
const { json } = require("express");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.get("/bookings/search", (req, res) => {
  const { date, term } = req.query;
  const bookingsFilteredByDate = bookings.filter((booking) => {
    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);
    return moment(date).isBetween(checkInDate, checkOutDate);
  });
  const bookingsBySearchTerm = bookings.filter(
    (booking) =>
      booking.surname.toLowerCase().includes(term.toLocaleLowerCase()) ||
      booking.firstName.toLowerCase().includes(term.toLocaleLowerCase()) ||
      booking.email.toLowerCase().includes(term.toLocaleLowerCase())
  );
  if (term) {
    if (bookingsBySearchTerm.length === 0) {
      res.json({ msg: `No booking found with search term ${term}` });
    } else {
      res.json(bookingsBySearchTerm);
    }
  } else {
    if (bookingsFilteredByDate.length === 0) {
      res.json({ msg: `No booking found for ${date}` });
    } else {
      res.send(bookingsFilteredByDate);
    }
  }
});

app.get("/bookings/:id", (req, res) => {
  const requestedID = Number(req.params.id);
  const found = bookings.some((booking) => booking.id === requestedID);
  if (found) {
    res.json(bookings.filter((booking) => booking.id === requestedID));
  } else {
    res.status(404).json({ msg: `Booking with id ${requestedID} not found.` });
  }
});

app.delete("/bookings/:id", (req, res) => {
  const requestedID = Number(req.params.id);
  const found = bookings.some((booking) => booking.id === requestedID);
  if (found) {
    const deletedMessage = bookings.filter(
      (booking) => booking.id === requestedID
    );
    const { title, firstName, surname, id } = deletedMessage[0];
    bookings = bookings.filter((booking) => booking.id !== requestedID);
    res.json({
      msg: `Booking with id ${id} for ${title} ${firstName} ${surname} has now been deleted`,
      bookings,
      deletedMessage,
    });
  } else {
    res.status(404).json({ msg: `Booking with id ${requestedID} not found.` });
  }
});

app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;
  const newBooking = {
    id: bookings.length + 1,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    surname: surname.charAt(0).toUpperCase() + surname.slice(1),
    email,
    roomId: Number(roomId),
    checkInDate,
    checkOutDate,
  };
  const checkInDateAfterCheckOut = moment(checkInDate).isAfter(checkOutDate);
  const isEmailValid = validator.validate(email);
  const isEmptyKey = Object.values(newBooking).some(
    (x) => x === null || x === ""
  );
  const compulsoryFields = Object.keys(newBooking).slice(1);
  const allKeysArePresent = compulsoryFields.every((key) => {
    return Object.keys(req.body).includes(key);
  });
  const errorMessage = {};
  if (
    isEmptyKey ||
    !allKeysArePresent ||
    !isEmailValid ||
    checkInDateAfterCheckOut
  ) {
    if (isEmptyKey || !allKeysArePresent) {
      errorMessage.msgMissingKey = "Some information is missing";
    }
    if (!isEmailValid) {
      errorMessage.msgInvalidEmail = "Invalid email format";
    }
    if (checkInDateAfterCheckOut) {
      errorMessage.wrongCheckInDate = "Check-in can not be after Check-out";
    }
    res.status(400).json(errorMessage);
  } else {
    bookings.push(newBooking);
    return res.json({
      msg: `You have submitted new booking with id ${newBooking.id} for ${title} ${firstName} ${surname}.`,
      bookings,
    });
  }
});
// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("your app is listening on port " + PORT);
});
