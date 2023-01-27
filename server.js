const express = require("express");
const cors = require("cors");
const gloryHotel = process.env.PORT || 4500;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json"); //("bookings.json") is the array

app.post("/bookings", function(request, response) {
  const entry = request.body;
  (bookings.push(entry));
  response.send(bookings); //inform us about the output of the server
});

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

const listener = app.listen(gloryHotel, function () {
  console.log("Your app is listening on port " + gloryHotel);
});
