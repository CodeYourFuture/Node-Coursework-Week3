const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// Helper Functions
function isInvalidId(id, index, response) {
  if (index < 0) {
    response.status(400).send("No booking with Id: " + id + " is found");
  }
}

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here


// Get all bookings
app.get("/bookings", function (request, response) {
  if (bookings.length <= 0) {
    response.status(500).send("No Available Data");
  }
  response.json(bookings);
});
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
