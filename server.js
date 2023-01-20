const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 9000;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
