const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
