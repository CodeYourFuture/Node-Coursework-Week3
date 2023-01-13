const express = require("express");
const cors = require("cors");
const fs = require("fs");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const maxID = Math.max(...bookings.map((c) => c.id));



app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  const data = bookings;
  res.json(data);
});

app.get("/bookings/:id", (req, res) => {
  const booking = bookings.find((c) => c.id === parseInt(req.params.id));
  if (booking) {
    res.json(booking);
  } else {
  res.sendStatus(404);
  }
});

app.post("/bookings", (req, res) => {
  let newId = maxID + 1;

  const newBooking = {
    id: newId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return res.status(400).send("All fields are required");
  } else {
  bookings.push(newBooking);
  save();
  res.send("Booking completed");
  }
});

app.delete("/bookings/:id", (req, res) => {
  let bookingID = parseInt(req.params.id);
  let bookingIndex = bookings.findIndex((c) => c.id === bookingID);
  if (bookingIndex < 0) {
    res.status(404).send("Booking not found");
  }
  bookings.splice(bookingIndex, 1);
  save();
  res.send("Booking deleted");
});

const save = () => {
  fs.writeFileSync("bookings.json", JSON.stringify(bookings, null, 2));
};
// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
app.listen(3002, () => console.log("listening on port 3002"));
