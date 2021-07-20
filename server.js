const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const moment = require("moment");


const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/",  (request, response) => {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// get all bookings

  app.get("/bookings", (req, res) => {
    res.status(200);
    res.send(bookings);
  });























const listener = app.listen(process.env.PORT || 3000,   () => {
  console.log("Your app is listening on port " + listener.address().port);
});

