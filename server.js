const express = require("express");
const cors = require("cors");
const firstName = require("./bookings.json");

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/firstName", function (request, response) {
  let result = bookings.map((a) => a.firstName);
  response.json(result);
});
//This array is our "data store".
// const hotelBookings = {
//   id: 0,
//   roomId: 123,
//   title: "Mr",
//   firstName: "John",
//   surname: "Doe",
//   email: "johndoe@doe.com",
//   checkInDate: "2017-11-21",
//   checkOutDate: "2017-11-23",
// };
//let bookings = [hotelBookings];

// TODO add your routes and helper functions here
const port = process.env.PORT || 3001;
const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
app.get("/bookings", (req, res) => {
  res.send(bookings);
});
// Create a new message
app.post("/bookings", (req, res) => {
  let lastIndex = bookings.length - 1; // find last index(4) of the array eg. 5 bookings are there 5(length) - 1 = 4(length) is the last index
  let lastId = bookings[lastIndex].id; // giving us last id of the index eg. 5id
  let idPosition = lastId + 1; // incrementing last by 1 eg. 5 + 1 = 6id
  let title = req.body.title;
  let firstName = req.body.firstName;
  let surname = req.body.surname;
  let email = req.body.email;
  let roomId = req.body.roomId;
  let checkInDate = req.body.checkInDate;
  let checkOutDate = req.body.checkOutDate;

  const newBooking = {
    id: idPosition,
    title: title,
    roomId: roomId,
    firstName: firstName,
    surname: surname,
    email: email,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  };
  bookings.push(newBooking);
  res.status(200).json(bookings);
});
//(get booking by id) Read one booking, specified by an ID
app.get("/bookings/:id", function (req, res) {
  let id = parseInt(req.params.id);
  let filterBooking = bookings.filter((book) => book.id === id);

  res.send(filterBooking);
});
app.delete("/bookings/:id", function (req, res) {
  let id = parseInt(req.params.id); // int = integer
  bookings = bookings.filter((book) => book.id !== id); // take all the bookings except the passed id for delete and over write.

  res.send(bookings);
});
