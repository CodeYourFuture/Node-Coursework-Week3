const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");


// reading bookings
app.get("/bookings", function (request, response) {
  response.status(200).send({ bookings })
});
// delete booking
app.delete("/bookings/:id", (req, resp) => {
  const bookingID = +req.params.id;
  let filterBooking = bookings.find((booking) => booking.id === bookingID);
  if (!filterBooking) {
    resp.status(404).send("Miss info ");
  } else {
    bookings = bookings.filter((book) => book.id !== bookingID);
    resp.send({ bookings });
  }
});
// create new booking
app.post("/bookings", (req, res) => {
  const newBooking = req.body;

  if (newBooking.id && newBooking.title && newBooking.firstName && newBooking.surname && newBooking.email && newBooking.roomId && newBooking.checkInDate && newBooking.checkOutDate) {
    bookings.push(newBooking);
    res.status(201).send(bookings);
  }
  else {
    res.status(400).send("Missing information")
  }
});

// get a booking by id
app.get("/bookings/:bookingId", function (request, response) {
  const idToFind = Number(request.params.bookingId);
  const booking = bookings.find((booking) => booking.id === idToFind);
  response.status(200).send({ booking })
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
