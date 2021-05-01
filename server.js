const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//get all bookings

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// get booking by id

app.get("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id) {
    const booking = bookings.filter((item) => item.id === id);
    res.status(200).json(booking);
  } else {
    res.status(400).json({ msg: "yyyyy" });
  }
});

// TODO add your routes and helper functions here
app.listen(PORT);
