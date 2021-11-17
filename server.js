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

app.get('/bookings', (req, res) => {
  res.send(bookings);
})

app.post('/bookings', (req, res) => {
  const newBooking = req.body;
  bookings.push(newBooking);
  res.send(bookings);
})

app.get('/bookings/:bookingId', (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = bookings.find(({id}) => id == bookingId);
  if(booking === undefined) {
    res.sendStatus(404);
    return;
  }
  res.send(booking);
})


app.delete('/bookings/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  const bookingIndex = bookings.findIndex(({ id }) => id == bookingId);
  if(bookingIndex === -1) {
    res.sendStatus(404);
    return;
  }
  bookings.splice(bookingIndex, 1);
  res.send(bookings);
})

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
