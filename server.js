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

//to make new bookings
app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  bookings.push(newBooking);
  res.json(newBooking);
});

app.get("/bookings", (req, res) => res.json(bookings));

// to recognise bookings by ID
app.get("/bookings/:id", (req, res) => {
  let id = parseInt(req.params.id);
  const filteredBookings = bookings.find((booking) => booking.id === id);
  res.json(filteredBookings);
});

//to delete bookings

app.delete("/bookings/:id", (req, res) => {
  let id = parseInt(req.params.id);
  bookings.forEach((booking) => {
    if (booking.id === id) {
      bookings.splice(booking, 1);
      res.send("booking deleted");
    } else {
      res.status("400").send("Bad Request");
    }
  });
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
