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

app.get("/bookings", function (req, res) {
  res.send(bookings);
});

app.get("/bookings/:id", function (req, res) {
  const bookingId = +req.params.id;
  const valid = bookings.some((booking) => booking.id === bookingId);
  if (valid) {
    const matched = bookings.find((booking) => booking.id === bookingId);
    res.send(matched);
  } else {
    res.status(404).send("incorrect id");
  }
});

app.post("/bookings", function (req, res) {
  const newBooking = req.body;
  newBooking.id = bookings.length + 1;
  bookings.push(newBooking);
  res.send(bookings);
});

app.delete('/bookings/:id', (req, res) => {
	const bookingId = +req.params.id;
	const valid = bookings.some((booking) => booking.id === bookingId);
	if (valid) {
		const filtered = bookings.filter((booking) => booking.id !== bookingId);
		res.send(filtered);
	} else {
		res.status(404).send('incorrect id');
	}
});

const listener = app.listen(5000 || process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
