const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//  Create a new booking
let idCount = 6;

app.post("/bookings", function (req, res) {
  const newbooking = req.body;

  // Level 2 - simple validation
  const booking = {
    id: idCount++,
    roomId: newbooking.roomId,
    title: newbooking.title,
    firstName: newbooking.firstName,
    surname: newbooking.surname,
    email: newbooking.email,
    checkInDate: newbooking.checkInDate,
    checkOutDate: newbooking.checkOutDate,
  };

  if (
    !newbooking.roomId ||
    !newbooking.title ||
    !newbooking.firstName ||
    !newbooking.surname ||
    !newbooking.email ||
    !newbooking.checkInDate ||
    !newbooking.checkOutDate
  ) {
    res.status(400).send("Rejected: empty or missing property.");
  } else {
    messages.push(booking);
    res.redirect("/");
  }
});

//  Read all bookings
app.get("/bookings", function (req, res) {
  res.status(200).send({ bookings });
});

// get all bookings matching a search term
app.get("/bookings/search", function (req, res) {
  const searchWord = req.query.term;
  const result = search(searchWord);
  res.json(result);
});

//search by a term
function search(word) {
  return bookings.filter(
    (booking) =>
      booking.firstName.toLowerCase().includes(word.toLowerCase()) ||
      booking.surname.toLowerCase().includes(word.toLowerCase()) ||
      booking.email.toLowerCase().includes(word.toLowerCase())
  );
}

// return all bookings spanning the given date

//  get one booking by id
app.get("/bookings/:id", function (req, res) {
  const idToFind = Number(req.params.id);
  const booking = messages.find((booking) => booking.id === idToFind);
  if (booking) {
    res.status(200).send({ booking });
  } else {
    res.status(404).send("Not found.");
  }
});

//  delete a booking by id
app.delete("/bookings/:id", function (req, res) {
  const idToDel = Number(req.params.id);
  const indexToDel = bookings.findIndex((booking) => booking.id === idToDel);
  if (indexToDel >= 0) {
    bookings.splice(indexToDel, 1);
    res.status(200).send({ booking });
  } else {
    res.status(404).send("Not found.");
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
