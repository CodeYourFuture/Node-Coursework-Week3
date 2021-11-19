const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/bookings/search", (request, response) => {
  if (!request.query.term) {
    response.status(400);
    response.json({ message: "search input blank" });
  }
  const searchQuery = request.query.term.toLowerCase();
  response.send(
    bookings.filter(
      (booking) =>
        booking.firstName.toLowerCase().includes(searchQuery) ||
        booking.surname.toLowerCase().includes(searchQuery) ||
        booking.email.toLowerCase().includes(searchQuery)
    )
  );
});

app.get("/bookings/:id", (request, response) => {
  const customerId = request.params.id;
  const booking = bookings.find(
    (customer) => customer.id === Number(customerId)
  );
  booking
    ? response.json(booking)
    : response.status(404).send("ID does not exist");
});

app.post("/bookings", (request, response) => {
  const newBookingData = request.body;
  if (
    newBookingData.title === "" ||
    newBookingData.firstName === "" ||
    newBookingData.surname === "" ||
    newBookingData.email === "" ||
    newBookingData.checkInDate === "" ||
    newBookingData.checkOutDate === ""
  ) {
    response.status(400).send({
      message: "Missing Information Required",
    });
  } else {
    let newId = bookings[bookings.length - 1].id + 1;
    const newBooking = {
      id: newId,
      title: request.body.title,
      firstName: request.body.firstName,
      surname: request.body.surname,
      email: request.body.email,
      roomId: "",
      checkInDate: request.body.checkInDate,
      checkOutDate: request.body.checkOutDate,
    };
    bookings.push(newBooking);
    response.status(200).send(bookings);
  }
});

app.delete("/bookings/:id", function (request, response) {
  const bookingId = request.params.id;

  const index = bookings.findIndex(
    (booking) => booking.id === Number(bookingId)
  );
  if (index !== -1) {
    bookings.splice(index, 1);
    response.send(bookings);
  } else {
    return response.status(404).send("ID does not exist");
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
