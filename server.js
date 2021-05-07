const express = require("express");
// const cors = require("cors");

const app = express();

app.use(express.json());
// app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//Get all the bookings
app.get("/bookings", (req, res) => {
  res.status(200).send(bookings);
});

//Get one booking by id
app.get("/bookings/:id", (req, res) => {
  const booking = bookings.find(
    (booking) => booking.id === parseInt(req.params.id)
  );
  if (booking) {
    res.status(200).send(booking);//send this back if  booking exists
  } else {
    res.sendStatus(404);//send this back if booking does not exist.
  }
});

//Delete a booking by an id
app.delete("/bookings/:id", (req, res) => {
  const index = bookings.findIndex((booking) => booking.id === parseInt(req.params.id)
  );
  if (index >= 0) {
    bookings.splice(index, 1);
    res.sendStatus(204).send('Booking has been deleted');
  } else {
    res.sendStatus(404).send('The booking requested to be deleted does not exist');
  }
});


//Create a new booking
app.post("/bookings",(request, response) => {
  let newBooking = request.body;

  if (
    
      !newBooking.id ||
      !newBooking.title ||
      !newBooking.firstName ||
      !newBooking.surname ||
      !newBooking.email ||
      !newBooking.roomId ||
      !newBooking.checkInDate ||
      !newBooking.checkOutDate
  ) {
    response.status(400);
    response.send("Some of the fields are missing");
  } else if (bookings.find((booking) => booking.id === newBooking.id)) {
    response.status(400);
    response.send("Booking already exists");
  } else {
    bookings.push(newBooking);
    response.status(201);
    console.log(newBooking);
    response.send(newBooking);
  }
});




//port configuration
const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});