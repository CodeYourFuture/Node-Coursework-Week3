const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.json("You're live");
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: Number(bookings.length + 1),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  if (
    !req.body.title ||
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.roomId ||
    !req.body.checkInDate ||
    !req.body.checkOutDate
  ) {
    res
      .status(404)
      .json({ success: false, error: "Please provide all fields" });
  } else if (validator.validate(req.body.email) === false) {
    res.status(404).json({ success: false, error: "Email is not valid" });
  } else {
    bookings.push(newBooking);
    res.status(200).json({
      success: true,
      message: "New booking created successfully",
      newBooking,
    });
  }
});

app.get("/bookings/search", (req, res) => {
  const searchQuery = req.query.term;
  const dateQuery = req.query.date;
  console.log(searchQuery);

  if (!dateQuery) {
    const matchedBookings = bookings.filter(matchedSearchQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  } else if (!searchQuery) {
    const matchedBookings = bookings.filter(matchedDateQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  } else {
    const matchedBookings = bookings.filter(allMatchedQueries);
    res.status(200).json({
      success: true,
      message: "showing all matched bookings",
      matchedBookings,
    });
  }

  function matchedSearchQueries(bkng) {
    return (
      bkng.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function matchedDateQueries(bkng) {
    const dateToFind = moment(new Date(dateQuery));
    const fromDate = moment(new Date(bkng.checkInDate));
    const toDate = moment(new Date(bkng.checkOutDate));
    const isDateBetween = dateToFind.isBetween(fromDate, toDate);

    return (
      bkng.checkInDate.includes(dateQuery) ||
      bkng.checkOutDate.includes(dateQuery) ||
      isDateBetween === true
    );
  }

  function allMatchedQueries(bkng) {
    const dateToFind = moment(new Date(dateQuery));
    const fromDate = moment(new Date(bkng.checkInDate));
    const toDate = moment(new Date(bkng.checkOutDate));
    const isDateBetween = dateToFind.isBetween(fromDate, toDate);

    return (
      bkng.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.checkInDate.includes(dateQuery) ||
      bkng.checkOutDate.includes(dateQuery) ||
      isDateBetween === true
    );
  }
});

app.get("/bookings/:id", (req, res) => {
  const idToFind = Number(req.params.id);
  const booking = bookings.find((bkng) => bkng.id === idToFind);

  bookings.includes(booking) === false
    ? res.status(404).json({
        success: false,
        error: `Booking ID: ${idToFind} could not be found`,
      })
    : res.status(200).json({
        success: true,
        booking,
      });
});

app.delete("/bookings/:id", (req, res) => {
  const idToDelete = Number(req.params.id);
  const indexOfBookingToDelete = bookings.findIndex(
    (bkng) => bkng.id === idToDelete
  );
  const bookingToDelete = bookings.find((bkng) => bkng.id === idToDelete);

  indexOfBookingToDelete === -1 || bookings.includes(bookingToDelete) === false
    ? res.status(404).json({
        success: false,
        error: `Booking ID: ${idToDelete} could not be found`,
      })
    : bookings.splice(indexOfBookingToDelete);
  res.status(200).json({
    success: true,
    message: `Booking wih ID: ${idToDelete} has been deleted`,
  });
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
