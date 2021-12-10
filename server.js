const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/bookings", function (request, response) {
  response.send(bookings);
});
app.get("/bookings/:id", function (request, response) {
  response.send(bookings);
});


// TODO add your routes and helper functions here
const port = 4000 || process.env.PORT;
const listener = app.listen(port, function () {
  console.log(`Your app is listening on ${port}`);
});
