const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.json("You're live");
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const newBooking = {
    id: Number(bookings.length + 1),
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.surname,
    email: req.body.email,
    roomId: req.body.roomId,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  if (
    !req.body.title ||
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.roomId ||
    !req.body.checkInDate ||
    !req.body.checkOutDate
  ) {
    res
      .status(404)
      .json({ success: false, error: "Please provide all fields" });
  } else {
    bookings.push(newBooking);
    res.status(200).json(newBooking);
  }
});

app.get("/bookings/search", (req, res) => {
  const searchQuery = req.query.term;

  const matchedBookings = bookings.filter(
    (bkng) =>
      bkng.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bkng.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  res.status(200).json({
    success: true,
    message: "showing all matched bookings",
    matchedBookings,
  });
});

//does this go in the other "search"?
app.get("/bookings/search", (req, res) => {
  const dateQuery = req.query.date;

  const fromDate = moment(new Date(checkInDate));
  const toDate = moment(new Date(checkOutDate));

  const matchedBookings = bookings.filter(
    (bkng) =>
      bkng.checkInDate.includes(dateQuery) ||
      bkng.checkOutDate.includes(dateQuery)
  );
});

app.get("/bookings/:id", (req, res) => {
  const idToFind = Number(req.params.id);
  const booking = bookings.find((bkng) => bkng.id === idToFind);

  bookings.includes(booking) === false
    ? res.status(404).json({
        success: false,
        error: `Booking ID: ${idToFind} could not be found`,
      })
    : res.status(200).json({
        success: true,
        booking,
      });
});

app.delete("/bookings/:id", (req, res) => {
  const idToDelete = Number(req.params.id);
  const indexOfBookingToDelete = bookings.findIndex(
    (bkng) => bkng.id === idToDelete
  );
  const bookingToDelete = bookings.find((bkng) => bkng.id === idToDelete);

  indexOfBookingToDelete === -1 || bookings.includes(bookingToDelete) === false
    ? res.status(404).json({
        success: false,
        error: `Booking ID: ${idToDelete} could not be found`,
      })
    : bookings.splice(indexOfBookingToDelete);
  res.status(200).json({
    success: true,
    message: `Booking wih ID: ${idToDelete} has been deleted`,
  });
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
