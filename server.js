const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.post("/bookings", (req, res) => {
  const newBooking = {
    id: req.body.id,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  bookings.push(newBooking);
  res.json(bookings);
});

app.get("/bookings", (req, res) => res.json(bookings));

const findBooking = (id) =>
  bookings.find((booking) => booking.id === Number(id));

app.get("/bookings/:id", (req, res) => {
  const id = req.params.id;
  if (findBooking(id)) {
    res.send(findBooking(id));
  } else {
    res.status(404).send(`Booking not found with the id ${id}`);
  }
});

app.delete("/bookings/:id", (req, res) => {
  const id = req.params.id;
  if (findBooking(id)) {
    const index = bookings.indexOf(findBooking(id));
    bookings.splice(index, 1);
    res.json(bookings);
  } else {
    res
      .status(404)
      .send(`Could not delete, booking not found with the id ${id}`);
  }
});

app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
});
