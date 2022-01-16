const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
let generatedId = 5;

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//read all bookings
app.get("/bookings", (req, res) => {
  res.status(200).json(bookings);
});

//read one booking specified by id
app.get("/bookings/:id", (req, res) => {
  const filteredBookings = bookings.filter(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (filteredBookings.length > 0) {
    res.status(200).json(filteredBookings);
  }
  res.status(404).json({ msg: `The id ${req.params.id} is invalid` });
});

//create a new booking
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: generatedId + 1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  if (
    newBooking.title &&
    newBooking.firstName &&
    newBooking.surname &&
    newBooking.email &&
    newBooking.roomId &&
    newBooking.checkInDate &&
    newBooking.checkOutDate
  ) {
    bookings.push(newBooking);
    res.status(200).json({ msg: "The new booking was added successfully" });
  }

  res
    .status(400)
    .json({
      msg: "A title, a firstName, a surname, an email, a roomId, a checkInDate and a checkOutDate is required",
    });
});

//delete a message by id
app.delete("/bookings/:id", (req, res) => {
    console.log("index");
  const index = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );


  if (index < 0) {
    res.status(404).json({ msg: `No booking with ${req.params.id} was found` });
  }

  bookings.splice(index, 1);
  res.status(200).json({ msg: `Booking ${req.params.id} was deleted` });
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});


