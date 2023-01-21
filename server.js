const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
const { response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (req, res) {
  res.send({ bookings });
});

app.post("/bookings", function (req, res) {
  const newBooking = req.body;
  bookings.push(newBooking);
  res.send(newBooking);
})

app.get("/bookings/:id", function (req, res) {
  const bookingsId = +req.params.id;
  let isInclude = bookings.some((booking) => booking.id === bookingsId);
  if (isInclude) {
    const oneBooking = bookings.find((booking) => booking.id === bookingsId);
    res.send(oneBooking);
  } else {
    res.send(`We couldn't find the ID ${JSON.stringify(bookingsId)}`);
  }
  
});

app.delete("/bookings/:id", function (req, res) {
  let bookingsId = +req.params.id;
  let isInclude = bookings.some((booking) => booking.id === bookingsId);
  if (isInclude) {
    bookings = bookings.filter((booking) => booking.id !== bookingsId);
    res.send({ bookings });
  } else {
    res.send(`We couldn't find the ID ${JSON.stringify(bookingsId)}`);
  }
});

const listener = app.listen(9000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});


