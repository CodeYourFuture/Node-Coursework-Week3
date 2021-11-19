const express = require("express");
const cors = require("cors");
const port = 4500;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { response, request } = require("express");

//! Find Function

const findBooking = (req) =>
  bookings.find((b) => b.id === Number(req.params.id));

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//! Create Booking - POST

app.post("/bookings", (req, res) => {
  const newBookingInfo = req.body;
  if (
    !newBookingInfo.roomId ||
    !newBookingInfo.title ||
    !newBookingInfo.firstName ||
    !newBookingInfo.surname ||
    !newBookingInfo.email ||
    !newBookingInfo.checkInDate ||
    !newBookingInfo.checkOutDate
  ) {
    return res.status(400).send({
      msg: "Please make sure all fields are filled in",
    });
  }

  const bookingData = req.body;
  let id = bookings.length + 1;

  const newBooking = {
    id: id,
    bookingData,
  };

  bookings.push(newBooking);
  console.log(newBooking, bookings);

  response.json({ success: true });
});

//! Show all bookings - GET

app.get("/bookings", (req, res) => {
  res.send(bookings);
});

app.delete("/bookings/:id", (req, res) => {
  const bookingsId = Number(req.params.id);
  const doesBookingExist = bookings.find(
    (booking) => booking.id === bookingsId
  );

  if (doesBookingExist) {
    const remainingBookings = bookings.filter((booking) => {
      return bookingsId !== booking.id;
    });
    if (remainingBookings) {
      return res.json(remainingBookings);
    }
  }

  return res.status(404).send({
    msg: `Message not found with id: ${bookingsId}`,
  });
});

//! Return a booking by ID - GET

app.get("/bookings/:id", (req, res) => {
  const requestedBooking = findBooking(req);

  if (requestedBooking) {
    return res.json(requestedBooking);
  }

  return res.status(404).send({
    msg: `Message not found with id: ${requestedBookingId}`,
  });
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
