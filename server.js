const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//Create a new booking
app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  newBooking.id = Math.max(...bookings.map((booking) => booking.id), 0) + 1;
  bookings.push(newBooking);
  res.json(bookings);
});
//read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
});
// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const filtered = bookings.filter((booking) => booking.id === bookingId);
  res.send(filtered);
});
//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );
  bookings.splice(bookingIndex, 1);
  res.send(bookings);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
