const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//All bookings
app.get("/bookings", (request, response) => {
  response.send(bookings);
});

//New booking
app.post("/bookings/new", (request, response) => {
  const newBooking = request.body;
  bookings.push(newBooking);
});

//Booking specified by ID
app.get("/bookings/:id", (request, response) => {
  const bookingId = parseInt(request.params.id);
  bookings = bookings.filter((_, index) => {
    return index != bookingId;
  });
  response.redirect("/bookings");
});

const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
