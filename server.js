const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
app.get("/", function (request, response) {
  response.send({ bookings });
});
//Read all bookings

app.get("/booking", function (request, response) {
  response.send({ bookings });
});
//Create a new booking
app.post("/booking", (req, resp) => {
  const newBooking = req.body;
  console.log(newBooking);
  if (
    newBooking.id &&
    newBooking.title &&
    newBooking.firstName &&
    newBooking.surname &&
    newBooking.email &&
    newBooking.roomId &&
    newBooking.checkInDate &&
    newBooking.checkOutDate
  ) {
    bookings.push(newBooking);
    resp.send("New Booking has been added >>");
  } else {
    resp.send("400");
  }
});
//Read one booking, specified by an ID
app.get("/booking/:id", function (request, response) {
  const bookingID = +request.params.id;
  const fliterBooking = bookings.find((booking) => booking.id === bookingID);
  if (!fliterBooking) {
    response.send("4040");
  } else {
    response.send({ fliterBooking });
  }
});
//Delelte booking
app.delete("/booking/:id", (req, resp) => {
  const bookingID = +req.params.id;
  const fliterBooking = bookings.filter((booking) => booking.id !== bookingID);
  console.log(fliterBooking);
  resp.send({ fliterBooking });
});
// TODO add your routes and helper functions here
//process.env.PORT
const listener = app.listen(9090, function () {
  console.log("Your app is listening on port " + 9090);
});
