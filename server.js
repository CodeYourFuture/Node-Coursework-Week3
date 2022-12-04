const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", (req, res) => {
  console.log(`This is my first log : ${req, bookings}`)
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// Create a new booking
app.post("/bookings/new", (req, res) => {
  const newBooking = req.body;
  console.log(`Before push : ${newBooking}`);
  bookings.push(newBooking);
  console.log(`After push : ${newBooking}`);
  if (newBooking !== 'id' && newBooking !== 'title' && newBooking !== "firstName" && newBooking !== "surname" && newBooking !== "email" && newBooking !== "roomId" && newBooking !== "checkInDate" && newBooking !== "checkOutDate") {
    return res.status(400).send(`Please complete all fields`);
  } else {
    res.status(200).send(bookings);
  }
});

// Read all bookings
app.get("/bookings", (req, res) => {
  console.log(req);
  res.send(bookings);
});

//Read one booking, specified by an ID
app.get('/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  res.send(bookings.find(e => e.id === bookingId));
});


// Delete a booking, specified by an ID
app.delete('/bookings/delete/:id', (req, res) => {
  const deleteId = parseInt(req.params.id);
  let delBookings = bookings.filter(element => element.id !== deleteId);
  bookings = delBookings;
  res.status(200).send(bookings);
});

// TODO add your routes and helper functions here

const listener = app.listen(3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
