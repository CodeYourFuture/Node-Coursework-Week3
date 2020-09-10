const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

// 1.Read all bookings

app.get("/bookings", (request, response) => {
  response.json(bookings);
});

// 2.Read one booking, specified by Id

app.get("/bookings/:id", (request, response) => {
  const id = Number(request.params.id);
  const idSearched = bookings.filter((booking) => booking.id === id);
  const found = bookings.some((booking) => booking.id === id);

  if (found) {
    response.json(idSearched);
  } else {
    response
      .status(404)
      .send(`No bookings match the id ${id}. Please enter a valid Id.`);
  }
});

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
