const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// Get an ID number that hasn't already been used in albums


app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

let nextId = bookings.length;

//read all  bookings
app.get("/bookings", function (request, response) {
  response.status(200).send(bookings)
});

//read one booking, by booking ID
app.get("/bookings/:id", (request, response) => {
  
  const foundBookingById = bookings.find((booking) => booking.id == request.params.id);
 //check if the id exists
    if (foundBookingById === undefined) {
      response.sendStatus(404);
    } else {
      response.send(foundBookingById);
    }
});



app.post("/bookings", (request, response) => {
  const newBooking = request.body;
  newBooking.id = ++nextId;
  bookings.push(newBooking);
  response.sendStatus(201);
});

app.delete("/bookings/:id", (request, response) => {
  const bookingId = request.params.id;
  const bookingIndex = bookings.findIndex((booking) => booking.id == bookingId);

  if (bookingIndex >= 0) {
    bookings.splice(bookingIndex, 1);
    response.sendStatus(204);
  } else {
    response.sendStatus(404);
  }
});






const listener = app.listen(4005, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
