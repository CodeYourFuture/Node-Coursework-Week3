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
// get all bookings
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

// get booking by id
app.get("/bookings/:id", (req, res) => {
  const bookingId = bookings.find(
    (elem) => elem.id === parseInt(req.params.id)
  );
  // validation
  if (bookingId) {
    res.status(200).send({
      bookingId,
    });
  } else {
    res.status(404).send({
      message: "Booking's Id not found",
    });
  }
});

// create new booking
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

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    res.status(400).send({ message: "Booking Error" });
  } else {
    // generate new Id with increment of 1 of last id, disregard deleted id
    let newId = bookings[bookings.length - 1].id + 1;

    const newBooking = {
      id: newId,
      title,
      firstName,
      surname,
      email,
      roomId,
      checkInDate,
      checkOutDate,
    };
    bookings.push(newBooking);
    res.status(201).send(newBooking);
  }
});

app.delete("/bookings/:id", (req, res) => {
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === parseInt(req.params.id)
  );
  const bookingId = bookings.find(
    (elem) => elem.id === parseInt(req.params.id)
  );

  if (bookingId) {
    if (bookingIndex >= 0) {
      bookings.splice(bookingIndex, 1);
      res.status(204).send({
        message: `Booking ${req.params.id} deleted`,
      });
      res.end();
    }
  } else {
    res.status(400).send({message: "Deletion error, id not found"})
  }

});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
