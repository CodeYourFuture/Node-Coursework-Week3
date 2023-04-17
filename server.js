const express = require("express");
const cors = require("cors");
const port = 3030;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//for creating new Id for new booking
function getNewUniqueId(array) {
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000) + 1; // generate a random number between 1 and 1000
  } while (array.some((obj) => obj.id === newId)); // check if the id already exists in the array
  return newId;
}

// Read all bookings
app.get("/bookings", function (req, res) {
  res.status(200).send(bookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", function (req, res) {
  const searchId = Number(req.params.id);
  const bookingWithSearchId = bookings.find(
    (booking) => booking.id === searchId
  );

  if (!bookingWithSearchId) {
    return res.status(404).send("Booking not found");
  }

  // If the booking is found, return it to the client
  return res.status(200).send(bookingWithSearchId);
});

// Create a new booking
app.post("/bookings", function (req, res) {
  const {
    title,
    firstname,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  const newBooking = {
    id: getNewUniqueId(bookings),
    title: title,
    firstname: firstname,
    surname: surname,
    email: email,
    roomId: roomId,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  };

  bookings.push(newBooking);

  res.status(201).send(bookings);
});

// Delete a booking, specified by an ID
app.delete("/bookings/:id", function (req, res) {
  const searchId = Number(req.params.id);
  const bookingWithSearchId = bookings.find(
    (booking) => booking.id === searchId
  );

  if (!bookingWithSearchId) {
    return res.status(404).send("Booking not found");
  } else {
    const index = bookings.indexOf(bookingWithSearchId);
    console.log("index", index);
    bookings.splice(index, 1);
    // If the booking is found, return updated array with bookings
    return res.status(200).send(bookings);
  }
});

app.listen(port, () => {
  console.log("Listening to the port 3030...");
});
