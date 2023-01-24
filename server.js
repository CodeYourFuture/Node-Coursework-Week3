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

// TODO add your routes and helper functions here

app.post("/bookings", function (req, res) {
  console.log("POST /bookings route");
  let newBooking = req.body;
  if (!(req.body.from || req.body.text)) {
    res.status(400).send("No booking entered");
  } else {
    bookings.push(newBooking);
    res.status(200).send(bookings);
  }
});

app.get("/bookings", function (request, response) {
  response.status(200).send(bookings);
});

app.get("/bookings/:id", (req, res) => {
  console.log(req.params.id);
  const id = parseInt(req.params.id);
  if (!id === id) {
    res.status(404).send("Incorrect ID, please try again");
  } else {
    res.status(200).send(bookings.filter((booking) => booking.id === id));
    console.log(bookings.filter((booking) => booking.id === id));
  }
});

app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const result = bookings.filter((booking) => booking.id === id);
  bookings = result;
  console.log("DELETE /booking route");
  res.status(200).send(result);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
