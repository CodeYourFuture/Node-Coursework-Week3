const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("validator");
const { query } = require("express");
const emailValidator = require("deep-email-validator");
const date = require("date-and-time");


app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.post("/bookings", function (request, response) {
  
  let id = bookings.length;
  const {
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  } = request.body;
  let newBooking = {
    id,
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  };
  bookings.push(newBooking);
  response.send(bookings);
  if (
    newBooking.roomId &&
    newBooking.roomId > 0 &&
    newBooking.title &&
    newBooking.title.length > 0 &&
    newBooking.firstName &&
    newBooking.firstName.length > 0 &&
    newBooking.surname &&
    newBooking.surname.length > 0 &&
    newBooking.email &&
    newBooking.email.length > 0 &&
    newBooking.checkInDate &&
    newBooking.checkInDate.length > 0 &&
    newBooking.checkOutDate &&
    checkOutDate.length > 0
  ) {
    bookings.push(newBooking);
    response.status(201).send(bookings);
  } else response.status(400).send(` check The above has keys have values.`);

});

app.get("/bookings/:id", function (request, response) {
  let booking = bookings.find((book) => book.id === Number(request.params.id));
  booking
    ? response.status(200).send(booking)
    : response.status(404).send("Sorry, booking not found");
});

app.delete("/bookings/:id", function (request, response) {
  let bookingToDelete = bookings.find(
    (el) => el.id === Number(request.params.id)
  );
  bookings.splice(bookings.indexOf(bookingToDelete), 1);
  response.send(bookings);
});
app.get("/bookings/search", function (request, response) {
  let searchedDate = request.query.date;
  const elementToFind = bookings.find(
    (book) => book.checkInDate === searchedDate || book.checkOutDate === searchedDate
  );
  response.send(elementToFind);
});

async function isEmailValid(email) {
  return emailValidator.validate(email);
}
app.post("/bookings", async function (request, response) {
  let id = bookings.length;
 
  const { valid } = await isEmailValid(newBooking.email); //email validation

  const date2 = new Date(newBooking.checkOutDate);
  const date1 = new Date(newBooking.checkInDate);
  const difference = date.subtract(date2, date1);

  if (
    valid &&
    difference.toDays() > 0 )

  {
    bookings.push(newBooking);
    response.status(201).send(bookings);
  
  } else response.status(400).send(`CHECK If information is correct `);
});
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
