const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
let count = bookings.length + 1;

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.post("/bookings", (request, response) => {
  const title = request.body.title;
  const firstName = request.body.firstName;
  const surname = request.body.surname;
  const email = request.body.email;
  const roomId = request.body.roomId;
  const checkInDate = request.body.checkInDate;
  const checkOutDate = request.body.checkOutDate;

  const newBooking = {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };

  if (!title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate) {
    response.status(404).json({
      msg: `Please include ${
        !newBooking.title
          ? "a title."
          : !newBooking.firstName
          ? "a first name."
          : !newBooking.surname
          ? "a surname."
          : !newBooking.email
          ? "an email."
          : !newBooking.roomId
          ? "a room id."
          : !newBooking.checkInDate
          ? "a check in date."
          : !newBooking.checkOutDate && "a check out date"
      }.`,
    });
  } else {
    (newBooking.id = count++), bookings.push(newBooking);
    response.json("Booking Added");
  }
});
app.get("/bookings", (request, response) => {
  response.send(bookings);
});

app.get("/bookings/:id", (request, response) => {
  const findBooking = bookings.some((booking) => booking.id === Number(request.params.id));
  if (findBooking) {
    response.json(bookings.filter((booking) => booking.id === Number(request.params.id)));
  } else {
    response.status(404).send(`Sorry, there is no booking with id ${request.params.id}`);
  }
});

app.delete("/bookings/:id", (request, response) => {
  const findBooking = bookings.some((booking) => booking.id === Number(request.params.id));
  if (findBooking) {
    bookingIndex = bookings.findIndex((booking) => booking.id === Number(request.params.id));
    bookings.splice(bookingIndex, 1);
    response.json({ msg: "Booking deleted successfully", bookings });
  } else {
    response.status(404).send(`Sorry, there is no booking with id ${request.params.id}`);
  }
});

const PORT = process.env.PORT || 7555;

app.listen(PORT, function () {
  console.log("Your app is listening on port " + PORT);
});
