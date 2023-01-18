const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (req, res) {
  res.send(bookings);
});

app.get("/bookings/search", function (req, res) {
  if (req.query.date) {
    const date = dateToNumber(req.query.date);
    res.send(bookings.filter((booking) => dateToNumber(booking.checkInDate) <= date && dateToNumber(booking.checkOutDate) >= date));
  } else {
    const term = req.query.term;
    res.send(bookings.filter((booking) => booking.firstName.includes(term) || booking.surname.includes(term) || booking.email.includes(term)));
  }
});

app.get("/bookings/:id", function (req, res) {
  const matched = bookings.find((booking) => booking.id === +req.params.id);
  if (!matched) return res.status(404).send("incorrect id");
  res.send(matched);
});

app.post("/bookings", function (req, res) {
  const newBooking = req.body;
  newBooking.id = bookings.length + 1;
  const { title, firstName, surname, email, roomId, checkInDate, checkOutDate } = newBooking;
  const valid =
    !!title &&
    !!firstName &&
    !!surname &&
    !!email &&
    (roomId === 0 || !!roomId) &&
    !!checkInDate &&
    !!checkOutDate &&
    emailValidation(email) &&
    dateValidation(dateToNumber(checkInDate), dateToNumber(checkOutDate));
  if (!valid) return res.status(400).send("missing or incorrect information");
  bookings.push(newBooking);
  res.send(bookings);
});

app.delete("/bookings/:id", (req, res) => {
  const bookingIndex = bookings.findIndex((booking) => booking.id === +req.params.id);
  if (bookingIndex === -1) return res.status(404).send("incorrect id");
  bookings.splice(bookingIndex, 1);
  res.send(bookings);
});

const listener = app.listen(5000 || process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

const dateToNumber = (date) => {
  return +date.replaceAll("-", "");
};

const dateValidation = (checkIn, checkOut) => {
  return checkIn < checkOut;
};

const emailValidation = (email) => {
  return /\w+@[a-zA-Z_]+?\.[a-zA-Z]{1,6}/.test(email);
};
