const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", (request, response) => {
  response.json(bookings)
})

app.get("/bookings/:id", (request, response) => {
  let bookingId = parseInt(request.params.id)

  if (bookings[bookingId]) response.json(bookings[bookingId])
  else {
    response.status(404)
    response.json({ msg: `Could not find booking with id, ${bookingId}` })
  }
})

app.post("/bookings", (request, response) => {
  let newBooking = request.body

  if (!newBooking.roomId || newBooking.title === "" || newBooking.firstName === "" || newBooking.surname === "" || newBooking.email === "" || newBooking.checkInDate === "" || newBooking.checkOutDate === "") {
    response.status(400)
    response.json({ msg: `Missing forms in booking, could not accept` })
  }
  else {
    newBooking.id = bookings.length
    bookings.push(newBooking)
    response.json({ msg: `Booking successful` })
  }
})

app.delete("/bookings/:id", (request, response) => {
  let bookingId = parseInt(request.params.id)

  if (bookings[bookingId]) {
    bookings = bookings.filter( booking => booking.id !== bookingId )
    response.json({ msg: `Booking with Id ${bookingId} has been deleted`})
  }
  else {
    response.status(404)
    response.json({ msg: `Could not find booking with id, ${bookingId}` })
  }
})

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
