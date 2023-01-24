const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 9090;
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//get a single booking using Id

app.get("/bookings/:id", (req, res) => {
  const singleBooking = bookings.find(
    (item) => item.id === Number(req.params.id)
  );
  if (!singleBooking) return res.status(404).send({ error: "No Data found" });

  res.status(200).send({ booking: singleBooking });
});

// query all bookings
app.get("/bookings", (req, res) => {
  res.status(200).send({ bookings: bookings });
});

//create a new booking using post

const newBookingNumber = function () {
  const maxID = bookings.reduce((max, item) => {
    return max > item.id ? max : item.id;
  }, 0);
  return maxID;
};

app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  const bookingEntry = [
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  ];

  if (
    bookingEntry.includes(undefined) ||
    bookingEntry.includes(null) ||
    bookingEntry.includes("")
  ) {
    return res
      .status(400)
      .send({ error: "All field must be present and valid!" });
  }

  const bookingID = { id: newBookingNumber() + 1 };
  const newBooking = { ...bookingID, ...req.body };
  bookings.push(newBooking);
  res.status(200).send({ message: "Booking has been created..." });
});

// Delete a booking

app.delete("/bookings/:id", (req, res) => {
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );

  if (bookingIndex === -1)
    return res.status(404).send({ error: "No Data found" });

  bookings.splice(bookingIndex, 1);
  res.status(200).send({ message: "Booking deleted" });
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
