// FIRST COMMIT
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send(bookings);
});

// GET SPECIFIC
app.get("/:id", function (request, response) {
  response.send(bookings.filter((booking) => booking.id == request.params.id));
});

app.delete("/:id", function (requ, response) {
  bookings.map((booking, index) => {
    if (requ.params.id == booking.id) {
      bookings.splice(index, 1);
      console.log("Executing");

    } else {
      console.log("Not executing");
    }
  });
  // response.send(`DELETED USER ${request.params.id}`);
  response.json(bookings);
});

app.post("/", function (request, response) {
  const body = request.body;
  bookings.push(body);
  console.log(body);
  response.send(bookings);
  // response.send(bookings);
});

// TODO add your routes and helper functions here

const listener = app.listen(5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
