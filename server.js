const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Create a new booking

// Read all bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", function (request, response) {
  let id = parseInt(request.params.id);
  let booking = bookings.filter((el) => el.id === id);
    if (booking) {
     response.status(200).json(booking);
    } else {
      response.status(404).send("Incorrect ID, please enter again");
    }
  
});

// Delete a booking, specified by an ID
app.delete("/bookings/:id", function (request, response) {
  let id = request.params.id;
  let result = bookings.filter((el) => el.id !== id);
  bookings = result;
  if (result) {
    response.json(result);
  } else {
    response.status(404).send("Incorrect ID, please enter again");
  }
});

let port = 3003 || process.env.PORT;

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
