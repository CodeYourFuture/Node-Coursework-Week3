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
  const date = dateToNumber(req.query.date);
  console.log("date:", date);
  res.send(bookings.filter((booking) => dateToNumber(booking.checkInDate) <= date && dateToNumber(booking.checkOutDate) >= date));
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
  const valid = !!title && !!firstName && !!surname && !!email && (roomId === 0 || !!roomId) && !!checkInDate && !!checkOutDate;
  if (!valid) return res.status(400).send("missing information");
  bookings.push(newBooking);
  res.send(bookings);
});

app.delete("/bookings/:id", (req, res) => {
  const booking = bookings.find((booking) => booking.id === +req.params.id);
  if (!booking) return res.status(404).send("incorrect id");
  const index = bookings.indexOf(booking);
  bookings.splice(index, 1);
  res.send(bookings);
});

const listener = app.listen(5000 || process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

const dateToNumber = (date) => {
  return +date.replaceAll("-", "");
};
