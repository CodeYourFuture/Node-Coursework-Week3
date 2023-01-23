const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 9000;
const app = express();
const moment = require("moment");

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//reading all bookings
app.get("/bookings", (req, res) => {
  res.status(200).send(bookings);
});

app.post("/bookings", (req, res) => {
  const requestBody = req.body;

  const newBooking = {
    id: requestBody.id,
    title: requestBody.title,
    firstName: requestBody.firstName,
    surname: requestBody.surname,
    email: requestBody.email,
    roomId: requestBody.roomId,
    checkInDate: requestBody.checkInDate,
    checkOutDate: requestBody.checkOutDate,
  };

  // validation

  const validBooking =
    (!!requestBody.id || requestBody.id === 0) &&
    !!requestBody.title &&
    !!requestBody.firstName &&
    !!requestBody.surname &&
    !!requestBody.email &&
    !!requestBody.roomId &&
    !!requestBody.checkInDate &&
    !!requestBody.checkOutDate;

  if (validBooking) {
    bookings.push(newBooking);
    res.status(200).send(bookings);
  } else {
    res.status(400).send("Some information is missing");
  }
});

// Read by Id
app.get("/bookings/:id", (req, res) => {
  const bookingId = +req.params.id;
  const searchedBooking = bookings.filter(
    (booking) => booking.id === bookingId
  );
  res.status(200).send(searchedBooking);
});

//Deleting by id
app.delete("/bookings/:id", (req, res) => {
  const bookingId = +req.params.id;
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );

  bookings.splice(bookingIndex, 1);

  res.status(200).send(bookings);
});

//Level 3 search by date
const dateToNumber = (date) => Number(date.replaceAll("-", ""));

app.get("/bookings/search/:date", (req, res) => {
  
  const date = dateToNumber(req.params.date);

  const bookingByDate = bookings.filter((booking) => {
    // this is filtering out if the date is * earlier then the checkout and later then the checkin
    return (
      dateToNumber(booking.checkInDate) <= date &&
      dateToNumber(booking.checkOutDate) >= date
    );
  });

  if (bookingByDate) {
    res.status(200).send(bookingByDate);
  } else {
    res.status(400).send("No booking has this date");
  }
});

// convet date to numbers


// TODO add your routes and helper functions here

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
