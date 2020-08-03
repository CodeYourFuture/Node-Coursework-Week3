const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
require("dotenv").config();
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

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(email);
  };

  //  Create a new bookings
  app.post("/bookings", (request, response) => {
    const missingParams = [
      "title",
      "firstName",
      "email",
      "roomId",
      "checkInDate",
      "checkOutDate",
      "surname",
    ].filter((key) => !(key in request.body));
    if (missingParams.length > 0) {
      return response
        .status(400)
        .send("Uri params missing:" + missingParams.join(", "));
    }

    const duration = moment(request.body.checkOutDate).diff(
      request.body.checkInDate,
      "days"
    );
    const booking = {
      title: request.body.title,
      firstName: request.body.firstName,
      surname: request.body.surname,
      email: request.body.email,
      roomId: Number(request.body.roomId),
      checkInDate: request.body.checkInDate,
      checkOutDate: request.body.checkOutDate,
      duration: duration,
    };

    if (validateEmail(request.body.email) || duration < 0) {
      return response
        .status(400)
        .json("Please Fill all the form fields, thanks!");
    }

    collection.insertOne(booking, (error, result) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.status(201).json(result.ops[0]);
      }
    });
  });

  // free-text search and search by date
  app.get("/bookings/search", (request, response) => {
    const searchTerm = request.query.term;
    const date = request.query.date;
    if (searchTerm === undefined && date === undefined) {
      return response.status(400).send("please, try again!");
    }
    const searchObject = { $or: [{ searchTerm: searchTerm }, { date: date }] };

    collection.find(searchObject).toArray((error, results) => {
      if (error) {
        response.status(500).send(error);
      } else {
        results.length > 0
          ? response.status(200).send(results)
          : response.status(404).send("search not found!");
      }
    });
  });

  //  Read one booking specified by an ID
  app.get("/bookings/:id", (request, response) => {
    if (!mongodb.ObjectId.isValid(request.params.id)) {
      return response.sendStatus(400);
    }

    collection.findOne({ _id: mongodb.ObjectId(request.params.id) }, (error, result) => {
      if (error) {
        return response.status(500).send(error);
      } else if (result) {
        response.status(200).send(result);
      } else {
        response.status(404).send("your search not found!");
      }
    });
  });

  //  Delete a booking by ID
  app.delete("/bookings/:id", (request, response) => {
    if (!mongodb.ObjectId.isValid(request.params.id)) {
      return response.sendStatus(400);
    }

    const searchObject = { _id: mongodb.ObjectId(request.params.id) };

    collection.deleteOne(searchObject, function (error, result) {
      if (error) {
        response.status(500).send(error);
      } else if (result.deletedCount) {
        response.sendStatus(204);
      } else {
        response.sendStatus(404);
      }

      client.close();
    });
  });
});

const portNumber = process.env.PORT || 5001;

const listener = app.listen(portNumber, function () {
  console.log("Server is listening on port " + listener.address().port);
});
