const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(cors());

//search term
app.get("/bookings/search", function (request, response) {
  const queryDate = request.query.date;
  const term = request.query.term;
  if (!term && !queryDate) {
    response.status(400).json("There isn't any match");
    return;
  }
  if (moment(queryDate, "YYYY-MM-DD", true).isValid()) {
    let result = bookings.filter(
      (booking) =>
        moment(queryDate).isBetween(
          booking.checkInDate,
          booking.checkOutDate
        ) ||
        moment(queryDate).isSame(booking.checkInDate) ||
        moment(queryDate).isSame(booking.checkOutDate)
    );
    result.length > 0
      ? response.send(result)
      : response.send("Not found a booking ton this date");
    return;
  } else if (queryDate) {
    response
      .status(400)
      .json('Please enter a valid date, format should like "YYYY-MM-DD"');
    return;
  }
  const searchTerm = bookings.filter((booking) =>
    `${booking.firstName} ${booking.surname} ${booking.email}`
      .toLowerCase()
      .includes(term.toLowerCase())
  );
  if (term && searchTerm.length > 0) {
    response.json(searchTerm);
  } else if (term) {
    response.status(400).json("Sorry we couldn't find your term");
  }
});

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const moment = require("moment");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.get("/bookings", (req, res) => {
  res.json(bookings);
});
//booking server
app.post("/bookings", (req, res) => {
  let newBookings = {
    id: bookings.length + 1,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };
  //for (let key in newBookings) {
  if (
    newBookings.title &&
    newBookings.firstName &&
    newBookings.surname &&
    newBookings.email &&
    newBookings.roomId &&
    newBookings.checkInDate &&
    newBookings.checkOutDate
  ) {
    bookings.push(newBookings);
    res.json(bookings);
  } else {
    res.status(400).send("please Fill All Fields");
  }
  //}
});

//Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const findbooking = bookings.find((item) => item.id === id);
  if (findbooking) {
    res.json(findbooking);
  } else {
    res.status(404).send("Id Number Not Find");
  }
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  const findbooking = bookings.findIndex((item) => item.id === id);

  if (findbooking > -1) {
    bookings.splice(findbooking, 1);
    res.json(bookings);
  } else {
    res.status(404).send("Id Number Not Find");
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
