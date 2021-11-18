const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
let bookingIdCounter = bookings.length + 1;

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.get("/bookings/search", (req, res) => {
  if (!req.query.term) {
    res.status(400);
    res.json({ msg: "No search query provided" });
  }
  const searchQuery = req.query.term.toLowerCase();
  res.send(
    bookings.filter(
      (booking) =>
        booking.firstName.toLowerCase().includes(searchQuery) ||
        booking.surname.toLowerCase().includes(searchQuery) ||
        booking.email.toLowerCase().includes(searchQuery)
    )
  );
});

app.get("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const bookingById = bookings.find(
    (booking) => booking.id === Number(bookingId)
  );
  if (bookingById) {
    return res.status(200).send(bookingById);
  } else {
    return res
      .status(404)
      .json({ msg: "No booking could be found with the id provided" });
  }
});

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
    res.status(400).send("Bad request");
    console.log(req.body);
  } else {
    const newBooking = {
      id: bookingIdCounter++, //? assigned by server, is it needed as a field
      roomId: "", //see above
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    };
    bookings.push(newBooking);
    res.status(201).send(bookings);
  }
});

app.delete("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  if (!bookingId) {
    return res
      .status(404)
      .send("No booking with the provided Id could be found");
  } else {
    bookings = bookings.filter((booking) => booking.id !== Number(bookingId));
    res.send(bookings);
  }
});

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
