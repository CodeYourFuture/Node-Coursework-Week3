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
// 1. Create a new booking

app.post("/bookings", function (req, res) {
  console.log(`POST /bookings ROUTE`);
  let newBooking = [
    {
      id: bookings.length + 1,
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    },
  ];

  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    res.status(400).send(`Booking not valid!`);
  } else {
    bookings.push(newBooking);
    send(bookings.json);

    res.status(200);
  }
});

// 2. Read all bookings

app.get("/bookings", function (req, res) {
  res.send(bookings);
});

// 3. Read one booking, specified by an ID

app.get("/bookings/:id", function (req, res) {
  console.log(`GET /bookings/${req.params.id} ROUTE`);
  let id = parseInt(req.params.id);

  res.json(bookings.find((el) => el.id === id));
  res.status(200);
});

// 4. Delete a booking, specified by an ID

app.delete("/bookings/:id", function (req, res) {
  console.log("DELETE /bookings/:id ROUTE");
  let deletedBooking = parseInt(req.params.id);
  let filteredArray = bookings.filter((el) => el.id !== deletedBooking);
  if ((deletedBooking = bookings.filter((el) => el.id !== bookings.id))) {
    res.status(404);
    res.send(`id not found!`);
  } else {
    bookings = filteredArray;
    res.json(bookings);
    send.status(200);
  }
});

const listener = app.listen(3005, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
