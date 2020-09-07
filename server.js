const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3005;
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// create a new booking

app.post("/bookings", (request, response) => {
  let indexOfLastBooking = bookings.length - 1;
  console.log(indexOfLastBooking);
  let newBooking = {
    id: bookings[indexOfLastBooking].id + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkInDate,
  };
  if (!newBooking.title || newBooking.title.length === 1) {
    response.json({ message: "Please enter a valid title" });
  } else if (!newBooking.firstName || newBooking.firstName.length < 2) {
    response.json({ message: "Please enter a valid first name" });
  } else if (!newBooking.surname || newBooking.surname.length < 2) {
    response.json({ message: "Please enter a valid surname" });
  } else if (
    !newBooking.email ||
    newBooking.email.length < 9 ||
    !newBooking.email.split("").includes("@")
  ) {
    response.json({ message: "Please enter a valid email" });
  } else {
    response.json(bookings.push(newBooking));
  }
});

// TODO add your routes and helper functions here

app.listener = app.listen(port, function () {
  console.log(`Your app is listening on port ${port}`);
});
