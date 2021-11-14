const express = require("express");
const cors = require("cors");
const app = express();
const moment = require("moment");

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
//read all bookings
app.get("/bookings", (request, response) => {
  response.send(bookings);
  console.log("all booking");
});

//create new booking
app.post("/bookings", (request, response) => {
  //get data from the client
  const booking = request.body;

  if (
    !booking.title ||
    !booking.firstName ||
    !booking.surname ||
    !booking.email ||
    !booking.roomId ||
    !booking.checkInDate ||
    !booking.checkOutDate
  ) {
    response.status(400).send("Please fill the text");
    return;
  }

  const newBooking = {
    id: bookings[bookings.length - 1].id + 1,
    title: booking.title,
    firstName: booking.firstName,
    surname: booking.surname,
    email: booking.email,
    roomId: booking.roomId,
    checkInDate: moment(booking.checkInDate).format("YYYY-MM-DD"),
    checkOutDate: moment(booking.checkOutDate).format("YYYY-MM-DD"),
  };

  if (booking) {
    bookings.push(newBooking);
    response.status(201).send(newBooking);
  }
});
//search by date
const search = (date) => {
  return bookings.find((booking) => booking.checkInDate.includes(date));
};
// read booking by specified date
app.get("/bookings/search", (request, response) => {
  const searchDate = request.query.date;
  const newDate = moment(searchDate).format("YYYY-MM-DD");
  const result = search(newDate);

  if (newDate === "Invalid date" || !result) {
    response.status(400).send("You have entered an invalid date");
    return;
  }

  response.send(result);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (request, response) => {
  const filterBooking = bookings.filter(
    (booking) => booking.id === Number(request.params.id)
  );

  if (filterBooking.length === 0) {
    response.status(404).send("Booking cannot be found!:{");
    return;
  }
  response.send(filterBooking);
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (request, response) => {
  const index = bookings.findIndex(
    (booking) => booking.id === Number(request.params.id)
  );

  if (index === -1) {
    response.status(404).send("Booking for deletion cannot be found!:{");
    return;
  }

  bookings.splice(index, 1);
  console.log(index);
  response.send("Successfully Deleted!!!");
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
