const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.Ask for /bookings, etc.");
});

// 1. Create a new booking
app.post("/booking", function(req, res) {
  const bookingData = req.body;
  const newBooking = {
    ...bookingData,
    id: bookings.length +1
  }
  bookings.push(newBooking);
  res.json({newBooking})
})
// 1. Read all bookings
app.get("/bookings", function(req, res) {
  res.json({bookings})
})
// 1. Read one booking, specified by an ID
app.get("/booking/:id", function(req, res) {
  const findId = Number(req.params.id)
  const booking = bookings.find((booking) => findId == booking.id)
  res.json({booking})
})
// 1. Delete a booking, specified by an ID
app.delete("/booking/:id", function(req, res) {
  const deleteId = Number(req.params.id)
  const findDeletedIdIndex = bookings.find((booking) => deleteId == booking.id)
  const deletedBooking = bookings.splice(findDeletedIdIndex,1)
  res.json({deletedBooking})
})
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
