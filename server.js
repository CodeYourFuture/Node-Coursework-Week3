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

  app.get("/bookings/search", (req, res) => {
    const { date, term } = req.query;
    if (!date && !term) {
      return res.status(400).send("please try again!");
    }
    collection.find().toArray((err, results) => {
      if (err) {
        return res.status(500).json(err);
      } else {
        const searchedBookings = results.filter((booking) =>
          date
            ? booking.checkInDate === date || booking.checkOutDate === date
            : null || term
            ? booking.firstName.toLowerCase().includes(term.toLowerCase()) ||
              booking.surname.toLowerCase().includes(term.toLowerCase()) ||
              booking.email.toLowerCase().includes(term.toLowerCase())
            : null
        );
        if (searchedBookings.length > 0) {
          return res.json(searchedBookings);
        } else {
          res.status(400).send("Not found!");
        }
      }
    });
  });

  app.put("/bookings/:id", (req, res) => {
    const bookingId = req.params.id;
    if (!mongodb.ObjectID.isValid(bookingId)) {
      return res.status(400).json("the ID is not valid");
    }
    const id = mongodb.ObjectID(bookingId);
    const {
      title,
      firstName,
      surname,
      email,
      checkInDate,
      checkOutDate,
    } = req.body;

    if (
      !title ||
      !firstName ||
      !surname ||
      !email ||
      !checkInDate ||
      !checkOutDate
    ) {
      return res.status(400).json("please complete all info and try again!");
    }
    const booking = {
      $set: {
        title: title,
        firstName: firstName,
        surname: surname,
        email: email,
        checkInDate: checkOutDate,
        checkOutDate: checkOutDate,
      },
    };
    collection.findOneAndUpdate({ _id: id }, booking, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  });

  app.delete("/bookings/:id", (req, res) => {
    const bookingId = req.params.id;
    if (!mongodb.ObjectID.isValid(bookingId)) {
      return res.status(400).json("the ID is not valid");
    }
    const id = mongodb.ObjectID(bookingId);
    collection.findOneAndDelete({ _id: id }, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(result);
      }
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Your app is listening on port " + port));
