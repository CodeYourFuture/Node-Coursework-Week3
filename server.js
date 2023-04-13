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
  let newBooking = {
    id,
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate,
  };
  if (
    newBooking.roomId &&
    newBooking.roomId > 0 &&
    newBooking.title &&
    newBooking.title.length > 0 &&
    newBooking.firstName &&
    newBooking.firstName.length > 0 &&
    newBooking.surname &&
    newBooking.surname.length > 0 &&
    newBooking.email &&
    newBooking.email.length > 0 &&
    newBooking.checkInDate &&
    newBooking.checkInDate.length > 0 &&
    newBooking.checkOutDate &&
    checkOutDate.length > 0
  ) {
    bookings.push(newBooking);
    response.status(201).send(bookings);
  } else response.status(400).send(`CHECK IF:\n\t1-->Object contains roomID, TITLE, firstName, surname, email, checkInDate, checkOutDate keys \n\t 2-->The above keys have values.`);
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
