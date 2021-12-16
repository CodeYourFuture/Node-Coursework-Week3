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



// TODO add your routes and helper functions here
app.post("/bookings", (request, response) => {
  const lastBooking = bookings[bookings.length - 1];
  const lastBookingId = lastBooking.id;
  const newBooking = {
    id: lastBookingId + 1,
    roomId: request.body.roomId,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  //if any properties (except id) missing or empty, throws 400
  if (
    !newBooking.roomId ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    response.sendStatus(400);
  } else {
    bookings.push(newBooking);
    return response.send("Booking added");
  }
});



app.get("/bookings", (request, response) => {
  response.send(bookings);
});



// LEVEL 3---------------
app.get("/bookings/search", getBookingByDate);

function getBookingByDate(req, res) {
  const date = req.query.date; //query variable for user

  // Checks for bookings that match search value date on either checkindate, checkoutDate, or in the checkin & checkout dates range
  const filteredBooking = bookings.filter((booking) => {
    const inDateRange = moment(date).isBetween(
      booking.checkInDate,
      booking.checkOutDate
    );

    return (
      booking.checkInDate == date || booking.checkOutDate == date || inDateRange
    );
  });

  res.json(filteredBooking);
}



// ------------------------
app.get("/bookings/:bookingId", (request, response) => {
  const bookingId = request.params.bookingId;

  if (bookingId) {
    const filteredBooking = bookings.filter(
      (booking) => booking.id == bookingId
    );

    //return 404 if no booking Id exists
    if (filteredBooking.length > 0) {
      return response.send(filteredBooking);
    } else {
      return response.sendStatus(404);
    }
  }
});



app.delete("/bookings/:bookingId", (request, response) => {
  const bookingId = request.params.bookingId;

  if (bookingId) {
    const bookingIndex = bookings.findIndex(
      (booking) => booking.id == bookingId
    );

    //non-existent booking has index of -1, so will throw 404
    if (bookingIndex >= 0) {
      bookings.splice(bookingIndex, 1);
      return response.send("Booking deleted");
    } else {
      return response.sendStatus(404);
    }
  }
});



const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});


