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

//1.Create a new booking
app.post("/bookings", function (request, response) {
  const newBooking = request.body;
  bookings.push(newBooking);
  response.send(bookings);
});

//2.Read all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

// TODO add your routes and helper functions here

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
app.listen(8080);
