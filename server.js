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
  res.send({bookings})
})

app.get("/bookings/:id", function (req, res) {
  const bookingsId = +req.params.id;
  const oneBooking = bookings.find((booking) => booking.id === bookingsId);
  res.send(oneBooking);
})

app.delete("/bookings/:id", function (req, res) {
  let bookingsId = +req.params.id;
  bookings = bookings.filter((booking) => booking.id !== bookingsId);
  res.send({bookings});
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});




app.listen(9000);
