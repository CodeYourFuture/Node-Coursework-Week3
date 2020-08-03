const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());
const uri = process.env.DATABASE_URI;
const mongoOptions = { useUnifiedTopology: true };
const client = new mongodb.MongoClient(uri, mongoOptions);

client.connect(() => {
  const db = client.db("hotel_server");
  const collection = db.collection("bookings");

  app.get("/", function (request, response) {
    response.send(
      "Hotel booking server.  Ask for /bookings, /bookings/3, /bookings/search?term=jones, /bookings/search?date=2017-11-21 etc."
    );
  });

  // Read all bookings

  app.get("/bookings", function (request, response) {
    collection.find().toArray((error, bookings) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.status(200).send(bookings);
      }
    });
  });
});

const portNumber = process.env.PORT || 5001;

const listener = app.listen(portNumber, function () {
  console.log("Server is listening on port " + listener.address().port);
});
