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

// TODO add your routes and helper functions here

// *******Get all bookings*****

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// **** Post new booking *****

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: req.body.id,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  bookings.push(newBooking);
  res.json(bookings);
});

// ******** Get one by id *******

app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  selectedBooking = bookings.find((booking) => booking.id === id);
  res.json(selectedBooking);
});

// const port = process.env.PORT || 7070

const listener = app.listen(process.env.PORT || 7070, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
