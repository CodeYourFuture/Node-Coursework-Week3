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

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.send(bookings);
});

let idsUsed = bookings.map(booking => booking.id);
console.log(Math.max(...idsUsed) + 1);

app.post("/bookings", (req, res) => {
  let booking = {
    "id": (Math.max(...idsUsed) + 1),
    "title": "Ms",
    "firstName": "Selenia",
    "surname": "Harris",
    "email": "selenia@example.com",
    "checkInDate": "2018-03-09",
    "checkOutDate": "2018-03-16"
  };

  console.log(booking);
  res.send(booking);
  bookings.push(booking);
  idsUsed.push(booking.id);
});

app.get("/bookings/:id", (req, res) => {
  const booking = bookings
    .find(booking => booking.id === Number(req.params.id));

  res.send(booking);
});

app.delete("/bookings/:id", (req, res) => {
  bookings = bookings.filter(booking => booking.id !== Number(req.params.id));
  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
