const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Welcome to my API. Try /bookings");
});

//get bookings:
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

//get by id:
app.get("/bookings/:id", function (request, response) {
  const id = Number(request.params.id);

  const booking = bookings.find((value) => {
    return value.id === id;
  });

  if (!booking) {
    response.status(404).json({ message: "booking not found" });
  } else {
    response.json(booking);
  }
});

//post:
app.post("/bookings", function (request, response) {
  const booking = request.body;
  console.log(booking);
  if (
    !booking.title ||
    !booking.firstName ||
    !booking.surname ||
    !booking.email ||
    !booking.roomId ||
    !booking.checkInDate ||
    !booking.checkOutDate
  ) {
    response.status(400).json({ message: "invalid booking" });
    return;
  }

  booking.id = bookings.length + 1;

  bookings.push(request.body);

  response.json(bookings);
});

//delete:
app.delete("/bookings/:id", function (request, response) {
  const id = Number(request.params.id);

  //delete a booking  from bookings array by id:
  const booking = bookings.find((value) => {
    return value.id === id;
  });

  if (!booking) {
    response.status(404).json({ message: "booking not found" });
  } else {
    const index = bookings.indexOf(booking);
    bookings.splice(index, 1);

    response.json(bookings);
  }
});

//to get all ids respectively:
// app.get("/bookings/ids", function (request, response) {
//   response.json(bookings.map((booking) => booking.id));
// });
const listener = app.listen(3001, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
