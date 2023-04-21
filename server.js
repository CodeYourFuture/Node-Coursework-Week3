const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public")); // connect the index.html file to the server 

// (in-memory) data store
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send(
    "Hotel booking server created by Natalie Zablotska.  Ask for /bookings, etc."
  );
});

app.get("/bookings", function (request, response) {
  //get all bookings
  response.status(200).send({ bookings });
});

app.get("/bookings/search", function (request, response) {
  //search for a booking by first name, surname, email, room ID and dates
  const searchTerm = request.query.term.toLowerCase();
  const matchingBookings = bookings.filter((booking) => {
    return (
      booking.firstName.toLowerCase().includes(searchTerm) ||
      booking.surname.toLowerCase().includes(searchTerm) ||
      booking.email.toLowerCase().includes(searchTerm) ||
      booking.roomId.toString().toLowerCase().includes(searchTerm) ||
      booking.checkInDate.toLowerCase().includes(searchTerm) ||
      booking.checkOutDate.toLowerCase().includes(searchTerm)
    );
  });

  if (matchingBookings.length === 0) {
    return response.status(404).send({ error: "No matching bookings found" });
  }
  response.status(200).send({ bookings: matchingBookings });
});

app.get("/bookings/:id", function (request, response) {
  //find a booking by id
  const idToFind = Number(request.params.id);
  const booking = bookings.find((booking) => booking.id === idToFind);
  if (!booking) {
    response
      .status(404)
      .send(`Booking with id ${request.params.id} is not found`);
  } else {
    response.status(200).send(booking);
  }
});

app.delete("/bookings/:id", function (req, res) {
  //delete a booking by id
  const idToDelete = parseInt(req.params.id);
  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === idToDelete
  );
  if (bookingIndex === -1) {
    return res.status(404).send({ error: "Booking not found" });
  }
  bookings.splice(bookingIndex, 1);
  res.status(200).send(`The booking No. ${idToDelete} has been deleted`);
});

app.post("/bookings", function (request, response) {
  //create a new booking
  const newBooking = {
    id: bookings.length + 1, // a unique ID for the new booking
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: parseInt(request.body.roomId),
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  // reject requests to create bookings if any property of the booking object is missing
  if (
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    isNaN(newBooking.roomId) ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response.status(400).send({ error: "Invalid booking data" });
  }

  // Adding the new booking to the bookings array
  bookings.push(newBooking);
  response.status(201).send({ booking: newBooking });
});

const port = 3000;
const listener = app.listen(process.env.PORT || port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});