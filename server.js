const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/bookings", function (request, response) {
  // response.send("Hotel booking server.  Ask for /bookings, etc.");
  response.send(bookings);
});

// TODO add your routes and helper functions here

app.post("/bookings", function (request, response) {
  if (
    !request.body.title ||
    !request.body.firstName ||
    !request.body.surname ||
    !request.body.email ||
    !request.body.roomId ||
    !request.body.checkInDate ||
    !request.body.checkOutDate
  ) {
    return response.status(400).json({ message: "Please fill all fields" });
    //
  }
  request.body.id = bookings[bookings.length - 1].id + 1;
  bookings.push(request.body);

  response.status(201).json(request.body);
});

app.get("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;
  let booking = bookings.find(
    (booking) => Number(booking.id) === Number(bookingId)
  );
  booking ? response.send(booking) : response.status(404);
});

app.put("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;
  const currentIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );
  bookings[currentIndex] = request.body;
  response.json(bookings[currentIndex]);
});

app.delete("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;
  bookings.find((booking) => booking.id === bookingId)
    ? response.status(404)
    : (bookings = bookings.filter((booking) => {
        return Number(booking.id) !== Number(bookingId);
      }));
  console.log(bookings);

  response.status(204).send();
});

app.get("/bookings/search", function (request, response) {
  const bookingDate = request.query.date;
  console.log(bookingDate);
  const bookings = bookings.filter((booking) => booking.date === bookingDate);
  bookings ? response.send(bookingDate) : response.status(404);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
