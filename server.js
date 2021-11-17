const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Create a new booking
app.post("/bookings", (req, res) => {
  //  res.send(req.body);
  const index = bookings.length;

  const newBookings = {
    id: index + 1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  if (
    !newBookings.title ||
    !newBookings.firstName ||
    !newBookings.surname ||
    !newBookings.email ||
    !newBookings.roomId ||
    !newBookings.checkInDate
  ) {
    return res.status(400).json({ message: "Please fill in all information!" });
  }
  bookings.push(newBookings);
  res.json(bookings);
});


const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
