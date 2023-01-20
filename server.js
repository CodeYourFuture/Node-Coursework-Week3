const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const bookings = require("./bookings.json");

app.use(bodyParser.json());
app.use(express.json());

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", (request, response) => {
  response.json({ bookings });
});

app.get("/bookings/search", (request, response) => {
  const searchTerm = request.query.term;
  let matchingBookings = bookings;
  if (searchTerm) {
    matchingBookings = bookings.filter((booking) => {
      return (
        booking.email.includes(searchTerm) ||
        booking.firstName.toLowerCase().includes(searchTerm) ||
        booking.surname.toLowerCase().includes(searchTerm)
      );
    });
  }
  response.status(200).send(matchingBookings);
});

app.get("/bookings/:id", (request, response) => {
  const id = Number(request.params.id);
  const findId = bookings.find((booking) => booking.id === id);
  if (!findId) {
    return response
      .status(404)
      .json({ message: `booking with the ${id} not found` });
  }
  response.status(200).json({ findId });
});

app.post("/bookings", (request, response) => {
  if (
    request.body.firstName === "" ||
    request.body.email === "" ||
    request.body.surname == "" ||
    request.body.title === "" ||
    request.body.checkInDate === "" ||
    request.body.checkOutDate === "" ||
    request.body.roomId === null
  ) {
    response.status(400).json({ message: "please fill all the fields" });
    return;
  }
  const newBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };
  bookings.push(newBooking);
  response.status(201).json({ bookings });
});

app.delete("/bookings/:id", (request, response) => {
  const requestId = Number(request.params.id);
  let result = bookings.filter((item) => item.id !== requestId);
  if (requestId < 0)
    return response.status(404).json({ msg: "message not found" });
  response.json({ result });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on ${port}.Ready to accept request!`);
});
