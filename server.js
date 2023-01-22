const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const moment = require("moment");
const validator = require("email-validator");

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//read all booking
app.get("/bookings", function (req, res) {
  res.status(200).send({ bookings });
});

//Create a new booking
app.post("/bookings", (req, res) => {
  const newID = bookings[bookings.length - 1].id + 1;

  const title = req.body.title;
  const firstName = req.body.firstName;
  const surname = req.body.surname;
  const email = req.body.email;
  const roomId = req.body.roomId;
  const checkInDate = req.body.checkInDate;
  const checkOutDate = req.body.checkOutDate;
  const isValidEmail = validator.validate(email);
  if (!isValidEmail) {
    res.status(400).send("Email is not valid");
    return;
  }
  if (moment(checkInDate).isAfter(checkOutDate)) {
    res.status(400).send("Check in date is after check out date");
    return;
  }
  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    res.status(400).send("invalid data to be posted");
    return;
  }
  const newBooking = {
    id: newID,
    title: title,
    firstName: firstName,
    surname: surname,
    email: email,
    roomId: roomId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  };

  bookings.push(newBooking);

  res.send(newBooking);
});

//search date between checkIn and checkOut(important need to be before than :id code)
app.get("/bookings/search", function (req, res) {
  const dateSearch = req.query.date; //need to be the same you are using on postman
  const date = moment(dateSearch); //convert to moment to check as number
  let foundResult = [];
  bookings.forEach((booking) => {
    let checkInAsNumber = moment(booking.checkInDate);
    let checkOutAsNumber = moment(booking.checkOutDate);
    if (date.isBetween(checkInAsNumber, checkOutAsNumber, null, "[]")) {
      foundResult.push(booking);
    }
  });
  if (foundResult.length === 0) {
    res.status(404).send("Not found a match search");
  } else {
    res.send(foundResult);
  }
});

//delete one booking by ID
app.delete("/bookings/:bookingId", function (req, res) {
  const toDelete = +req.params.bookingId;
  const deleteBooking = bookings.findIndex(
    (booking) => booking.id === toDelete
  );
  if (deleteBooking !== -1) {
    bookings.splice(deleteBooking, 1); //1 means replace, if it was 0 would be add in the position
    res.status(200).send({ bookings });
  } else {
    res.status(404).send("Not found");
  }
});

//Read one booking by ID
app.get("/bookings/:bookingId", function (req, res) {
  //+req.params.bookingId -> +interpret a number, req.params.bookingId * 1, Number(req.params.bookingId )
  const idToFind = +req.params.bookingId;
  const booking = bookings.find((booking) => booking.id === idToFind); //booking.id -> id -> property
  if (booking) {
    res.status(200).send({ booking });
  } else {
    res.status(204).send("Not found");
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 9090, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
