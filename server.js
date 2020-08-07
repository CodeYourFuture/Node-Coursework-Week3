const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const dayjs = require("dayjs");
const validator = require("email-validator");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const uri = process.env.DB_URI;

const option = { useUnifiedTopology: true };
const client = new mongodb.MongoClient(uri, option);
client.connect(() => {
  const db = client.db("hotel-server");
  const collection = db.collection("bookings");

  app.get("/", function (req, res) {
    res.send("Hotel booking server.  Ask for /bookings, etc.");
  });

  app.get("/bookings", (req, res) => {
    collection.find().toArray((err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  });

  app.post("/bookings/add", (req, res) => {
    const {
      title,
      firstName,
      surname,
      email,
      roomId,
      checkInDate,
      checkOutDate,
    } = req.body;
    const isEmailOk = validator.validate(email);
    const isDateOk = dayjs(checkInDate) < dayjs(checkOutDate) ? true : false;

    if (
      !title ||
      !firstName ||
      !surname ||
      !isEmailOk ||
      !isDateOk ||
      !roomId ||
      !checkInDate ||
      !checkOutDate
    ) {
      return res
        .status(400)
        .send(" something is wrong! check the inputs and try again ");
    }
    const booking = {
      title: title,
      firstName: firstName,
      surname: surname,
      email: email,
      roomId: roomId,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    };
    collection.insertOne(booking, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result.ops[0]);
      }
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Your app is listening on port " + port));
