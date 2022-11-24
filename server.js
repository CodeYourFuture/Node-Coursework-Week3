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

app.post("/bookings", (req, res) => {

  const { id, title, firstName, surname, email, roomId, checkInDate, checkOutDate } = req.body;
  const booking = { id: bookings.length + 1, title, firstName, surname, email, roomId, checkInDate, checkOutDate };

  if(Object.values(booking).every(v => v)) res.status(404);

  bookings.push(booking);
  res.status(200).json(booking);
})

app.get("/bookings", (req, res) => {
  res.json(bookings);
})

app.get("/bookings/search", (req, res) => {
  const date = req.query.date;
  res.json(bookings.find(d => d.checkInDate === date || d.checkOutDate === date))
})

app.get("/bookings/:id", (req, res) => {
  if (bookings.some(b => b.id === req.params.id - "")) {
    res.status(200).json(bookings.find(b => b.id === req.params.id - ""));
  } else {
    res.status(404).json({ message: "unsuccessful" });
  }
})


app.delete("/bookings/:id", (req, res) => {
  if (bookings.some(b => b.id === req.params.id - "")) {
    bookings = bookings.filter(b => b.id !== req.params.id - "");
    res.status(200).json(bookings);
  } else {
    res.status(404).json({ message: "unsuccessful" });
  }
})

// TODO add your routes and helper functions here
const listener = app.listen(process.env.PORT || 3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
