const express = require("express");
const cors = require("cors");
const validator = require("email-validator");
const app = express();
const moment =require( "moment");
moment().format();
app.use(express.json());
app.use(cors());

let id = 6;
//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/bookings/search", (req, res) => {
  console.log(req.query);
  const findDate = bookings.filter(
    (booking) => booking.checkInDate === req.query.searchDate
  );
  res.send(findDate);
});

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.post("/bookings", (request, response) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = request.body;

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return response.sendStatus(404);
  }

  const momentCheckInDate =moment(checkInDate)
  const momentCheckOutDate=moment(checkOutDate)
  console.log(moment.minutes( momentCheckOutDate.subtract(momentCheckInDate)))




  if (validator.validate(email)) {
    bookings.push({ ...request.body, id: id++ });
    return response.sendStatus(201);
  }else{
    return response.status(404).send('Wrong email')
  }
});

app.get("/bookings", (req, res) => {
  res.send(bookings);
});

app.get("/bookings/:id", (req, res) => {
  const findById = bookings.find(
    (booking) => booking.id === Number(req.params.id)
  );

  if (!findById) res.status(404);

  res.send(findById);
});

app.delete("/bookings/:id", (req, res) => {
  const indexId = bookings.findIndex(
    (booking) => booking.id === Number(req.params.id)
  );
  bookings.splice(indexId, 1);

  if (indexId === -1) res.sendStatus(404);

  res.sendStatus(200).send();
});

// TODO add your routes and helper functions here

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// 1. Delete a booking, specified by an ID
