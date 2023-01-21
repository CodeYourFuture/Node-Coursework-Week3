const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");
// reading bookings
app.get("/bookings", function (request, response) {
  response.status(20).send({ bookings })
});
// create new booking
app.post("/bookings", (req, res) => {
  const newId = booking[booking.length - 1].id + 1
  const { title, firstName, surname, email, roomId, checkInDate, checkOutDate } = req.body
  const obj = { id: newId, ...req.body }
  console.log(obj); if (!title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate) { res.status(400).send("missing value"); } else { res.status(201).json({ obj }) }
})

// get a booking by id
app.get("/bookings/:id", function (request, response) {
  const idToFind = Number(request.params.id);
  const booking = bookings.find((booking) => booking.id === idToFind);
  response.status(200).send({ booking })
});

// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
