const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", (req, res) => {
  res.json({message: "Hotel booking server.  Ask for /bookings, etc."});
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const newBooking = req.body;
  if (newBooking.id && newBooking.title && newBooking.firstName && newBooking.surname && newBooking.email && newBooking.roomId && newBooking.checkInDate && newBooking.checkOutDate) {
    bookings.push(newBooking);
    res.send({message: "New booking is successfully added"})
  } else {
    res.status(400);
    res.json({message: "Booking failed! Please fill all the required fields."})
  }

});

app.get("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const bookingById = bookings.find(booking => booking.id.toString() === id);
  if (id && bookingById) res.json(bookingById);
  else res.status(404).send({message: `A booking by the ID ${id} is not found.`});
});

app.delete("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const bookingToDelete = bookings.findIndex(booking => booking.id.toString() === id);
  if (id && bookingToDelete) {
    bookings.splice(bookingToDelete, 1);
    res.json({message: `A booking by the ID ${id} is successfully deleted!`});
  }
  else res.status(404).send({message: `A booking by the ID ${id} does not exist.`})
})

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
