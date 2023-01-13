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

//GET all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//POST new bookings
app.post("/bookings", function (request, response) {
  let bkTitle = request.body.title;
  let bkFName = request.body.firstName;
  let bkLName = request.body.surName;
  let bkEmail = request.body.email;
  let bkRoomId = request.body.roomId;
  let bkCheckInDate = request.body.checkInDate;
  let bkCheckOuDate = request.body.checkOutDate;
  let idPosition = bookings.length;

  const newBooking = {
    id: idPosition,
    title: bkTitle,
    firstName: bkFName,
    surName: bkLName,
    email: bkEmail,
    roomId: bkRoomId,
    checkInDate: bkCheckInDate,
    checkOutDate: bkCheckOuDate,
  };

  if (
    newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surName ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response.status(400).json("Please fill out everything");
  } else {
    bookings.push(newBooking);
    response.status(200).json(bookings);
  }
});

//GET specific bookings
app.get("/bookings/:id", function (request, response) {
  const inputId = request.params.id;
  if (inputId) {
    const booking = bookings.filter((res) => res.id == inputId);
    response.json(booking);
  }
});


app.get("/bookings/delete/:id", function (req, res) {
  let id = parseInt(req.params.id);
  let filtered = bookings.filter((bk) => bk.id === id);

  bookings = bookings.filter((bk) => bk.id !== id);

  res.send(filtered);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
