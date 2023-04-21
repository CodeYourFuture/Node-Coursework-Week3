const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//set an Id counter
let idCounter = 6;

//Create a new booking
app.post("/bookings", function (request, response) {
  //simple validation
  if (
    !request.body.title ||
    !request.body.firstName ||
    !request.body.surname ||
    !request.body.email ||
    !request.body.roomId ||
    !request.body.checkInDate ||
    !request.body.checkOutDate
  ) {
    return response.status(400).json({ error: "Missing or empty booking property" });
   
  }
  
  const newBooking = {
    id: idCounter++,
    roomId: request.body.roomId,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };
  response.json(newBooking);
  bookings.push(newBooking);
});

//Read all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

//Read one booking

function idFromRequest(request) {
  return parseInt(request.params.id);
}
function findBookingById(id) {
  return bookings.find((element) => element.id === id);
}
app.get("/bookings/:id", function (request, response) {
  let id = idFromRequest(request);
  let foundBooking = findBookingById(id);
  if (foundBooking) {
    response.json(foundBooking);
  } else {
    response.status(404).end();
  }
});
//Delete a booking, specified by an ID
app.delete("/bookings/:id", function (request, response) {
  let id = idFromRequest(request);
  let foundBooking = findBookingById(id);
  if (foundBooking) {
    bookings = bookings.filter((e) => e.id !== id);
    response.json(bookings);
  } else {
    response.status(404).end();
  }
});

// TODO add your routes and helper functions here

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
