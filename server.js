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
  let id = bookings.length;
  const {
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  } = request.body;
  const newBooking = {
    id,
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  };
  bookings.push(newBooking);
  response.send(bookings);
});

//2.Read all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//3. Read one booking, specified by an ID
app.get("/bookings/:id", function (request, response) {
  let booking = bookings.find((el) => el.id === Number(request.params.id));
  booking
    ? response.status(200).send(booking)
    : response.status(404).send("Sorry, booking not found");
});

//4. Delete a booking, specified by an ID
app.delete("/bookings/:id", function (request, response) {
  let bookingToDelete = bookings.find(
    (el) => el.id === Number(request.params.id)
  );
  bookings.splice(bookings.indexOf(bookingToDelete), 1);
  response.send(bookings);
});

// TODO add your routes and helper functions here

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
app.listen(8080);
