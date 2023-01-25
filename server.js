const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
const { response } = require("express");
const { hasSubscribers } = require("diagnostics_channel");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (req, res) {
  res.send({ bookings });
});

app.post("/bookings", function (req, res) {
  const booking = req.body;
  const {
    id,
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = booking;
  const arrayOfBooking = Object.values(booking);
  const isValid =
    arrayOfBooking.every((value) => value !== undefined && value !== "") &&
    !!id &&
    !!title &&
    !!firstName &&
    !!surname &&
    !!email &&
    !!roomId &&
    !!checkInDate &&
    !!checkOutDate;

  if (isValid) {
    let newBooking = {
      id: id,
      title: title,
      firstName: firstName,
      surname: surname,
      email: email,
      roomId: roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate
    };
    bookings.push(newBooking);
    res.send(
      `Your booking has been successfully added ${JSON.stringify(newBooking)}`
    );
  } else {
    res.status(400).send("Missing Info");
  }
})

app.get("/bookings/:id", function (req, res) {
  const bookingsId = +req.params.id;
  let isInclude = bookings.some((booking) => booking.id === bookingsId);
  if (isInclude) {
    const oneBooking = bookings.find((booking) => booking.id === bookingsId);
    res.send(oneBooking);
  } else {
    res.send(`We couldn't find the ID ${JSON.stringify(bookingsId)}`);
  }
  
});

app.delete("/bookings/:id", function (req, res) {
  let bookingsId = +req.params.id;
  let isInclude = bookings.some((booking) => booking.id === bookingsId);
  if (isInclude) {
    bookings = bookings.filter((booking) => booking.id !== bookingsId);
    res.send({ bookings });
  } else {
    res.send(`We couldn't find the ID ${JSON.stringify(bookingsId)}`);
  }
});

const listener = app.listen(9000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});


