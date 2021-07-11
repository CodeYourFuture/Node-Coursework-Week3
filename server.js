const express = require("express");
const cors = require("cors");
const _ = require('lodash');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// 2.Read All Bookings
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
