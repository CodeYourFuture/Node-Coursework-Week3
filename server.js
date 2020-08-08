const dotenv = require("dotenv")
const express = require("express");
const mongodb = require("mongodb")
const cors = require("cors");
const bodyParser = require("body-parser")
const moment = require("moment")

const app = express();

dotenv.config()
//app.use(express);
app.use(cors());
app.use(bodyParser())

const port = process.env.PORT || 3000

const uri = process.env.DATABASE_URI

//Use this array as your (in-memory) data store.
//let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.get("/bookings", (request, response) => {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('bookings')
    const collection = db.collection('booking')

    collection.find().toArray(function (error, bookings) {
      response.send(error || bookings)
})
})
});

app.post("/bookings", (request, response) => {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('bookings')
    const collection = db.collection('booking')
    const newBooking = {}

    var ObjectId = mongodb.ObjectID
      var id = new ObjectId();
      console.log(id)
      newBooking._id = id

    if (request.query.title){
      newBooking.title = request.query.title
    } else {
      response.send(400)
    }

    if (request.query.firstName){
      newBooking.firstName = request.query.firstName
    } else {
      response.send(400)
    }

    if (request.query.surname){
      newBooking.surname = request.query.surname
    } else {
      response.send(400)
    }

    if (request.query.email){
      newBooking.email = request.query.email
    } else {
      response.send(400)
    }

    if (request.query.roomId){
      newBooking.roomId = request.query.roomId
    } else {
      response.send(400)
    }

    if (request.query.checkInDate){
      newBooking.checkInDate = request.query.checkInDate
    } else {
      response.send(400)
    }

    if (request.query.checkOutDate){
      newBooking.checkOutDate = request.query.checkOutDate
    } else {
      response.send(400)
    }

    console.log(newBooking)
    collection.insertOne(newBooking, function (error, result) {
      response.send(error || result.ops[0]);
      console.log("Requested booking has been sent!")
    });
  })
});

app.get("/bookings/search", (request, response) => {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('bookings')
    const collection = db.collection('booking')

    const searchObject = {}

    if (request.query.date) {
      searchObject["date"] = request.query.date
    }

    collection.find(searchObject).toArray(function(error, booking) {
      if (moment(date).isBetween(booking.checkInDate, booking.CheckOutDate)) {
        response.send(booking)
      } else {
        response.status(404).send(error)
      }
      client.close()
    })
  })
})

app.get("/bookings/:id", (request, response) => {
  const client = new mongodb.MongoClient(uri)
  let id = new mongodb.ObjectID(request.params.id)

  client.connect(function() {
    const db = client.db('bookings')
    const collection = db.collection('booking')

    const searchObject = { _id: id }

    collection.findOne(searchObject, function(error, booking) {
        response.send(error || booking)
    })
  })
})

app.delete("/bookings/:id", (request, response) => {
  const client = new mongodb.MongoClient(uri)
  let id = new mongodb.ObjectID(request.params.id)

  client.connect(function() {
    const db = client.db('bookings')
    const collection = db.collection('booking')

    const searchObject = { _id: id }

    collection.deleteOne(searchObject, function(error, booking) {
      if (booking.deletedCount) {
        response.status(204).send("Successfully deleted!");
      } else if(booking._id !== id) {
        response.status(404).send("Sorry, this ID does not exist.");
      }
})
})
})

app.listen(port || 3000, function() {
  console.log(`Running at \`http://localhost:${port}\`...`)
})
