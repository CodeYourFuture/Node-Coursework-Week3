const express = require("express");
const cors = require("cors");
const lodash = require("lodash");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

const validator = require("email-validator");

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.post("/bookings", function (request, response) {
  const { roomId, title, firstName, surname, email, checkInDate, checkOutDate } = request.body;
  const newBooking = {
    id: bookings[bookings.length - 1].id + 1,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate
  }
  const date1 = moment(checkInDate);
  const date2 = moment(checkOutDate);
  let difDays = date2.diff(date1, 'days');
  if (
    !firstName ||
    !title ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate ||
    !(difDays && difDays > 0) ||
    !validator.validate(email)
  ) {
    response.status(404).send("please fill out everything correctly");
  } else {
    bookings.push(newBooking);
    response.status(200).json(bookings);
  }
});


app.delete('/bookings/:id', (req, res) => {
  const bookingToDelete = bookings.find(booking => booking.id === Number(req.params.id));
  if (bookingToDelete) {
    bookings.splice(req.params.id, 1);
    bookings.map((booking, index) => booking.id = index + 1);
    res.status(200).send('Booking Deleted');
  } else {
    res.status(404).send('There is no booking with that ID');
  }
});

app.get("/bookings/search", function (request, response) {
  let { date, term } = request.query;
  let searchInput = date
    ? bookings.filter(d => moment(date).isSameOrAfter(d.checkInDate) || moment(date).isSameOrBefore(d.checkOutDate))
    : searchTerm(term);
  response.json(searchInput);

})

function searchTerm(filTerm) {
  return bookings.filter(t => {
    return t.firstName.toLowerCase().includes(filTerm.toLowerCase())
      || t.surname.toLowerCase().includes(filTerm.toLowerCase())
      || t.email.includes(filTerm.toLowerCase())
  });
}

app.get("/bookings", function (_, response) {
  response.send(bookings);
});

app.get("/bookings/:id", function (request, response) {
  let bookingById = bookings.find((booking) => booking.id == request.params.id);
  if (bookingById) {
    response.send(bookingById);
  } else {
    response.status(404).send("The is no booking ID  with  " + request.params.id);
  }
});

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});