const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.get("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id);
  const booking = bookings.find(booking => booking.id === id);
  if (booking) {
    response.json(booking);
  } else {
    response.status(404).send("Booking not found");
  }
});

app.post("/bookings", function (request, response) {
  const newBooking = request.body;
  if (
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response.status(400).send("Booking is not complete");
  }
  bookings.push(newBooking);
  response.json(bookings);
});

app.delete("/bookings/:id", function (request, response) {
  const id = parseInt(request.params.id);
  const booking = bookings.find(booking => booking.id === id);
  if (booking) {
    const index = bookings.indexOf(booking);
    bookings.splice(index, 1);
    response.json(bookings);
  } else {
    response.status(404).send("Booking not found");
  }
});

/** Level 2 - simple validation

For this level, your server must reject requests to create bookings if:

- any property of the booking object is missing or empty.

In this case your server should return a status code of 400, and should NOT store the booking in the bookings array.

# Level 3 (Optional, advanced) - search by date

For this level your API must also allow a client to:

Search for bookings which span a date (given by the client).

It should accept requests of the following format:

`/bookings/search?date=2019-05-20`

Hint: use the `moment` library to make this easier.

# Level 4 (Optional, advanced) - advanced validation

In this level, bookings should also be rejected if:

- email address is not valid (hint: use a library to do this - [search here](https://www.npmjs.com/))
- checkoutDate is not after checkinDate (hint: use the `moment` library to check this)

# Level 5 (Optional, easy) - free-text search

For this level your API must also allow a client to:

Search for bookings which match a given search term.

It should accept requests of the following format:

`/bookings/search?term=jones`

It should match if the term occurs in _any_ of `email`, `firstName`, or `surname` fields.

# Level 6 (Optional) - make your React app use your new server

For this level, change your react hotel front-end to use your own back-end API that you have designed here in this challenge. Adjust it so that all the functionality works.

# Spoiler: Correct Routes

| method | example path                     | behaviour                                   |
| ------ | -------------------------------- | ------------------------------------------- |
| GET    | /bookings                        | return all bookings                         |
| GET    | /bookings/17                     | get one booking by id                       |
| GET    | /bookings/search?term=jones      | get all bookings matching a search term     |
| POST   | /bookings                        | create a new booking                        |
| DELETE | /bookings/17                     | delete a booking by id                      |
| GET    | /bookings/search?date=2019-05-20 | return all bookings spanning the given date |
 */

const port = process.env.PORT || 3000;
const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
