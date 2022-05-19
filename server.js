const express = require("express");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { param } = require("express/lib/request");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/bookings/:id", function (request, response) {
  const id = Number(request.params.id);
  const result = bookings.find((booking) => booking.id === id);
  if (result) {
    response.json(result);
  } else {
    response.status(404).send("not found");
  }
});

app.get("/bookings/search?", function (request, response) {
  console.log(request.query);
  let name = bookings.filter(
    (booking) => booking.firstName === request.query.name
    //addingchecks for booking.surname || booking.email causes problem, look at this again
  );

  if (name) {
    response.json(name);
  } else {
    response.send("not found");
  }
});

let id = 6;
app.post("/bookings", function (request, response) {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = request.body;
  if (
    title === 0 ||
    firstName.length == 0 ||
    surname === 0 ||
    email === 0 ||
    roomId === 0 ||
    checkInDate === 0 ||
    checkOutDate === 0
  ) {
    response.status(400).send("make sure all fields are filled");
  } else {
    const createdBooking = {
      id: id++,
      title,
      firstName,
      surname,
      email,
      roomId,
      checkInDate,
      checkOutDate,
    };
    bookings.push(createdBooking);
  }
  response.json(bookings).send("created a new booking");
});

app.delete("/bookings/:id", function (request, response) {
  const { id } = request.params;
  const remove = bookings.findIndex((index) => index.id == id);

  if (remove) {
    bookings.splice(remove, 1);
    response.send(`${id} id has been removed`);
  } else {
    response.status(404).send("not found");
  }
});

//look at search date again
app.get("/bookings/search?date=", function (request, response) {
  console.log(request.query);
  const date = bookings.filter(
    (booking) => booking.checkInDate === request.query.date
  );
  if (date) {
    response.json(date);
  } else {
    response.send("not found");
  }
});

const listener = app.listen(3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
