const express = require("express");
const cors = require("cors");
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());

const validator = require("email-validator");

const port = 3005;

let bookings = require("./bookings.json");

app.get("/bookings", function (request, response) {
  console.log("Validate", validator.validate("testemail.com"));
  validator.validate("test@email.com");
  response.send(bookings);
});

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
  }

  if (!moment(request.body.checkInDate).isBefore(request.body.checkOutDate)) {
    return response.status(400).json({
      message: "Please ensure check in date is before check out date",
    });
  }

  if (!validator.validate(request.body.email)) {
    return response.status(400).json({ message: "Please type a valid email" });
    //
  }
  request.body.id = bookings[bookings.length - 1].id + 1;
  bookings.push(request.body);

  response.status(201).json(request.body);
});

app.get("/bookings/search", function (request, response) {
  const bookingDate =
    request.query.date && moment(request.query.date, "YYYY-MM-DD");
  console.log(bookingDate);
  let foundBooking = bookings.filter((booking) =>
    bookingDate.isBetween(
      booking.checkInDate,
      booking.checkOutDate,
      undefined,
      "[]"
    )
  );
  response.send(foundBooking);
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

  response.status(204).send();
});

const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
