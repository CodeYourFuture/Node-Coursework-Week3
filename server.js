const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.post("/bookings", function (request, response) {
  const expectedKeys = ["title", "firstName", "surname", "email", "roomId", "checkInDate", "checkOutDate"]
  for (let item in request.body) {
    if (!request.body[item] || !expectedKeys.includes(item)) {
      response.status(400).json("Please ensure your are passing the correct fileds")
      return;
    }
  }

  let newBooking = {
    id: bookings[bookings.length - 1].id + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate
  }
  bookings.push(newBooking)
  response.json(bookings)
});

app.get("/bookings", function (request, response) {
  response.send(bookings);
});

app.get("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id)
  let requestedBooking = bookings.find(booking => booking.id === id)
  if (requestedBooking) {
    response.json(requestedBooking)
  } else {
    response.status(404).json("There is no booking with this ID");

  }
});
app.delete("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id)
  let requestedBooking = bookings.findIndex(booking => booking.id === id)
  if (requestedBooking > -1) {
    bookings.splice(requestedBooking, 1)
    response.json(bookings)
  } else {
    response.status(404).json("There is no booking with this ID");
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
