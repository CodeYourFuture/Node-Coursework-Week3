const express = require("express");
const cors = require("cors");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Read all booking
app.get("/booking", (req, res) => {
  bookings.length > 0 ? res.json(bookings).status(200) : res.status(404);
});

// Read one booking, specified by an ID
app.get("/booking/:id", (req, res) => {
  const bookingIndex = req.params.id - 1;
  // console.log(req.params.id)
  bookingIndex < 0
    ? res.status(404).send("this booking does not exist")
    : res.status(200).send(bookings.splice(bookingIndex, 1));
});

// Create a new booking
app.post("/booking/", (req, res) => {
  const newBooking = {
    id: Date.now(),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  bookings.push(newBooking);

  res.send("Booking added").status(200);
});

// Delete a booking, specified by an ID
app.delete("/booking/:id", (req, res) => {
  res.send(bookings[req.params.id - 1]);
});

const listener = app.listen(process.env.PORT || 4001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
