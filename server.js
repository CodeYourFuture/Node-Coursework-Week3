const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// post method, adding new element
app.post("/bookings", function (request, response) {
  let newBooking = request.body;

  if (
    !newBooking.id ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    response.status(400);
    response.send("Some of the booking Details are missing");
  } else if (bookings.find((booking) => booking.id === newBooking.id)) {
    response.status(400);
    response.send("booking already exists");
  } else {
    bookings.push(newBooking);
    response.status(201);
    console.log(newBooking);
    response.send(newBooking);
  }
});

// Reading all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

// Reading a booking by ID
app.get("/bookings/:id", function (request, response) {
  // type conversion to int from string
  let id = parseInt(request.params.id);

  let filteredBooking = bookings.find((booking) => booking.id === id);

  // if no booking found
  if (!filteredBooking) {
    response.sendStatus(404);
  }
  response.send(filteredBooking);
});

// Deleting booking by Id

app.delete("/bookings/:id", (request, response) => {
  let id = parseInt(request.params.id);
  let deletedBookingIndex = bookings.findIndex((booking) => booking.id === id);
  if (deletedBookingIndex > -1) {
    bookings.splice(deletedBookingIndex, 1);
    // response.status(204);
    response.send("Booking Successfully deleted");
  } else {
    response.sendStatus(404);
  }
});

// get bookings by check in and out date
app.get("/search", (req, res) => {
  let date = req.query.date;

  if (!date) {
    res.send("Enter search query in YYYY-MM-DD format ");
  } else {
    const filteredBookings = bookings.filter(
      (booking) =>
        moment(booking.checkInDate).isSame(date) ||
        moment(booking.checkOutDate).isSame(date)
    );

    if (filteredBookings.length > 0) {
      res.send(filteredBookings);
    } else {
      res.sendStatus(404);
    }
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
