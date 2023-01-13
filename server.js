const express = require("express");
const cors = require("cors");
const { response, json } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
response.send("Hotel booking server.  Ask for /bookings, etc.");
});
// gets all bookings 
app.get("/bookings", (req, res) => {
res.send(bookings);
});

app.post("/bookings", (req, res) => {
const { title, firstName, surname, email, checkInDate, checkOutDate} = req.body;
if (!title || !surname || !email || !checkInDate || !checkOutDate){
res.status(400).send({message: " ERROR All fields have not been completed please try again"});
}
let newBookingTable = {
id: 0,
title: req.body.title,
firstName: req.body.firstName,
surname: req.body.surname,
email: req.body.email,
roomId: 0,
checkInDate: req.body.checkInDate,
checkOutDate: req.body.checkOutDate,
}
bookings.push(newBookingTable);
newBookingTable.id = bookings.findIndex(newBooking) + 1;
newBookingTable.roomId = newBookingTable.id + 10;
res.send(newBookingTable);
res.json(bookings);
});
// defines IsInvalidId function
function isInvalidId(id, bookingIndex, res) {
  if (bookingIndex === -1) {
    ({ message: "Booking not found" });
    return true;
  }
  if (isNaN(id)) {
    ({ message: "Invalid id parameter" });
    return true;
  }
  return false;
}
// Get one booking by id
app.get("/bookings/:id", function (request, response) {
  let bookingIndex = bookings.findIndex((newBookingTable) => newBookingTable.id == request.params.id);
  isInvalidId(request.params.id, bookingIndex, response);
  if (bookingIndex >= 0) {
    let booking = bookings[bookingIndex];
    response.json(booking);
  }
});
// Delete one booking by id
app.delete("/bookings/:id", function (request, response) {
  let bookingIndex = bookings.findIndex((newBookingTable) => newBookingTable.id == req.params.id);
  if (isInvalidId(request.params.id, bookingIndex, response)) return;
  bookings.splice(bookingIndex, 1);
  response.send({ message: "Booking deleted" });
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
console.log("Your app is listening on port " + listener.address().port);
});
