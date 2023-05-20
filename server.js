const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001 || process.env.PORT;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
//Creating new booking


// creating new booking
app.post("/bookings", (req, res) => {
  const newBookings = req.body;

  if (
    newBookings.title &&
    newBookings.firstName &&
    newBookings.surname &&
    newBookings.roomId &&
    checkInDate &&
    checkOutDate
  ) {
    bookings.push(newBookings);
    res.status(201).json({ message: "Booking created successfully" });
  } else {
    res.status(400).json({ message: "Invalid booking data" });
  }
});


// reading all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings)
});


// Read one booking, specified by an ID
app.get("/booking/:id", (req, res) => {
  const id = Number(req.params.id);
  const bookingByID = bookings.find((booking) => booking.id === id);
  if (bookingByID) {
    res.send(bookingByID);
  } else {
    res.status(404).json(`Booking not found`);
  }
});

// Delete a booking, specified by an ID
app.delete("/booking/:id", (req, res) => {
  const id = Number(req.params.id);
  const deleteByID = bookings.find(booking => booking.id === id)
  if (deleteByID) {
    res.json(bookings.filter(booking => booking.id !== id))
  } else {
    res.status(404).json({message: "booking not found"})
  }

})






const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
