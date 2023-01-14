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

//1. Read all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//1. Create a new booking
app.post("/bookings", function (request, response) {
  let bookingsTitle = request.body.title;
  let bookingsfirstname = request.body.firstName;
  let bookingsSurname = request.body.surName;
  let bookingsEmail = request.body.email;
  let bookingsRoomId = request.body.roomId;
  let bookingsCheckInDate = request.body.checkInDate;
  let bookingsCheckOutDate = request.body.checkOutDate;

  let idNumber = bookings.length;

  const newBooking = {
    id: idNumber,
    title: bookingsTitle,
    firstName: bookingsfirstname,
    surname: bookingsSurname,
    email: bookingsEmail,
    roomId: bookingsRoomId,
    checkInDate: bookingsCheckInDate,
    checkOutDate: bookingsCheckOutDate,
  };

  if (
    !newBooking.roomId ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response
      .status(404)
      .json("Please complete all fields");
  } else {
    bookings.push(newBooking);
    response.status(200).json(bookings);
  }
});

//1. Read one booking, specified by an ID
app.get("/bookings/:id", function (request, response) {
  const idNumber = request.params.id;
  if (idNumber) {
    const booking = bookings.filter((response) => response.id == idNumber);
    response.json(booking);
  } else {
     return res.status(404).send("not found")
  }
});

//1. Delete a booking, specified by an ID
app.delete("/bookings/:id", function (req, res) {
  const queryId = Number(req.params.id);
  const bookingIndex = bookings.findIndex((booking) => booking.id === queryId);
  if (!queryId) {
    res.send("Provide Id Number");
  }
  if (bookingIndex < 0) {
    res.sendStatus(404);
    return;
  }
  bookings.splice(bookingIndex, 1);
  save();
  res.send("Booking Removed");
});



const listener = app.listen(process.env.PORT=3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});