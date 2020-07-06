const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Read all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

//Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const selectedBooking = bookings.filter(
    (booking) => booking.id === Number(req.params.id)
  );
  if (selectedBooking) {
    res.send(selectedBooking);
  } else {
    res.sendStatus(404);
  }
});

//Create a new booking
app.post("/bookings", (req, res) => {
  console.log(req.body);
  if (req.body !== "") {
    bookings.push(req.body);
    res.send({ success: true });
  } else {
    res.sendStatus(404);
  }
  res.send();
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const deleteBooking = bookings.filter(
    (booking) => booking.id !== Number(req.params.id)
  );
  if (bookings.length !== deleteBooking.length) {
    bookings = deleteBooking;
    res.send(bookings);
  } else {
    res.sendStatus(404);
  }
});

const myPort = process.env.PORT || 3003;
app.listen(myPort, () => {
  console.log(` Your app is listening on port ${myPort}`);
});
