const express = require("express");
var moment = require('moment');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

<<<<<<< Updated upstream
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
=======

//root directory
app.get("/", function (req, res) {
  res.send("Hotel booking server.  Search for bookings.");
});


//all bookings
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

//add new booking 
app.post("/bookings", function (req, res) {
  const newBooking = {
    id: bookings.length,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  //if these fields are empty..
  if (
    !newBooking.roomId ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res.status(400).json({ msg: "Please complete all required fields" });
  }

  //push new booking and send back bookings in response
  bookings.push(newBooking);
  res.status(200).json(bookings);

});


//search bookings by ID
app.get("/bookings/:id", (req, res) => {

  const foundBookings = bookings.filter(
    (booking) => booking.id === parseInt(req.params.id)
  );

  if (foundBookings.length > 0) {
    res.status(200).json(foundBookings);
  }

  res.status(404).json({ msg: `ID ${req.params.id} not found` });
});


//delete booking
app.delete("/bookings/:id", (req, res) => {

  const index = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );

  if (index < 0) {
    res.status(404).json({ msg: `Booking ${req.params.id} not found` });
  }

  bookings.splice(index, 1);
  res.status(200).json({ msg: `Booking ${req.params.id} was deleted` });
>>>>>>> Stashed changes
});

// TODO add your routes and helper functions here

<<<<<<< Updated upstream
const listener = app.listen(process.env.PORT, function () {
=======















//search by date & search(searchsearchTerm)

app.get("/bookings/search", (req, res) => {
  const { date, searchTerm } = req.query;

  if (date && searchTerm) {

    const formatDate = moment(date).format("YYYY-MM-DD");

    const filteredBookings = bookings.filter(
      (booking) =>
        booking.email.toUpperCase().includes(searchTerm.toUpperCase()) ||
        booking.firstName.toUpperCase().includes(searchTerm.toUpperCase()) ||
        booking.surname.toUpperCase().includes(searchTerm.toUpperCase())
    );

    if (formatDate !== date) {
      return res.status(400).json({
        success: false,
        msg: "Please fix date search format as such: 'search?date=YYYY-MM-DD'",
      });
    } else if (filteredBookings.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "your search searchTerm did not return any matches",
      });
    } else {
      const filteredBookings = bookings.filter(
        (booking) =>
          (booking.checkInDate === formatDate ||
            booking.checkOutDate === formatDate) &&
          (booking.email.toUpperCase().includes(searchTerm.toUpperCase()) ||
            booking.firstName.toUpperCase().includes(searchTerm.toUpperCase()) ||
            booking.surname.toUpperCase().includes(searchTerm.toUpperCase()))
      );

      if (filteredBookings.length === 0) {
        return res.status(400).json({
          success: false,
          msg: "No bookings match your date and search searchTerm",
        });
      }

      return res.status(200).json({
        success: true,
        filteredBookings,
      });
    }
  } else if (date) {
    const formatDate = moment(date).format("YYYY-MM-DD");
    if (formatDate !== date) {
      return res.status(400).json({
        success: false,
        msg: "Please fix date search format as such: 'search?date=YYYY-MM-DD'",
      });
    }

    const matchingBookingDate = bookings.filter(
      (booking) =>
        booking.checkInDate === formatDate ||
        booking.checkOutDate === formatDate
    );

    if (matchingBookingDate.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "It appears no bookings match your search date",
      });
    }

    return res.status(200).json({
      success: true,
      matchingBookingDate,
    });
  } else if (searchTerm) {
    const filteredBookings = bookings.filter(
      (booking) =>
        booking.email.toUpperCase().includes(searchTerm.toUpperCase()) ||
        booking.firstName.toUpperCase().includes(searchTerm.toUpperCase()) ||
        booking.surname.toUpperCase().includes(searchTerm.toUpperCase())
    );

    if (filteredBookings.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "your search searchTerm did not return any matches",
      });
    }

    return res.status(200).json({
      success: true,
      filteredBookings,
    });
  }
});

































































































//listen 
const listener = app.listen(PORT, function () {
>>>>>>> Stashed changes
  console.log("Your app is listening on port " + listener.address().port);
});
