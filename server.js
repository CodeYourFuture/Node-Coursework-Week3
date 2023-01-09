const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Read all bookings
app.get("/bookings", (req, res) => res.json(bookings));

//Create a new booking
app.post("/bookings", (req, res) => {
  let newBooking = {
    id: bookings.length + 1,
    roomId: req.body.roomId,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
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
    res.status(400).json({ msg: "Please fill in all fields" });
  }
  bookings.push(newBooking);
  res.send(bookings);
});

//Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const findById = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (!findById) res.status(404).send("Booking with this ID not found");
  res.send(findById);
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  let bookingsId = parseInt(req.params.id);
  let found = bookings.some((booking) => booking.id === bookingsId);
  if (found) {
    res.json(
      (bookings = bookings.filter((booking) => booking.id !== bookingsId))
    );
  } else {
    res.status(404).json({
      msg: "Booking with this ID not found",
    });
  }
});

//Search by date
app.get("/bookings/search", (req, res) => {
  const date = moment().format(req.query.date);

  const found = bookings.some(
    (item) =>
      item.checkInDate.includes(date) || item.checkOutDate.includes(date)
  );

  if (found) {
    res.json(
      bookings.filter(
        (booking) =>
          booking.checkInDate.includes(date) ||
          booking.checkOutDate.includes(date)
      )
    );
  } else {
    res.status(200).json({
      msg: "Bookings with this date not found" + date,
    });
  }
});

// const listener

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
