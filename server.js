const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 9090 || process.env.PORT;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// Creating a new Booking
app.post("/bookings", (req, res) => {
  const newBookings = req.body;

  if (newBookings) {
    bookings.push(newBookings);
    res.status(201).json({ message: "Booking created successfully" });
  } else {
    res.status(400).json({ message: "Ivalid booking data" });
  }
});

// Reeding all Bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Read one Bookings by an ID
app.get("/", (req, res) => {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
