const express = require("express");
// const cors = require("cors");
// const uuid = require("uuid");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
// getting the booking data
const bookings = require("./bookings.json");
app.post("/bookings", function (req, res) {
  const booking = {
    id: 0,
    title: req.body.title,
    firstName: req.body.firstName,
    surname: req.body.secondName,
    email: req.body.email,
    roomId: 0,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
  };

  console.log(req.body);

  if (
    !booking.firstName ||
    !booking.surname ||
    !booking.email ||
    !booking.checkInDate ||
    !booking.checkOutDate
  ) {
    // bookings.push(booking);
    // booking.id = bookings.indexOf(booking);
    return res.status(400).json({
      msg: "Please include a title, a first name, a second name ,an email, check-in and check-out date",
    });
  } else {
    bookings.push(booking);
    booking.id = bookings.indexOf(booking) + 1;
    booking.roomId = booking.id + 10;
    return res.json(bookings);
  }
});
//Read all bookings
app.get("/bookings", function (req, res) {
  res.json(bookings);
});

//Read one booking
app.get("/bookings/:id", (req, res) => {
  const idFilter = (req) => (booking) => booking.id === parseInt(req.params.id);

  const found = bookings.some(idFilter(req));

  if (found) {
    res.json(bookings.filter(idFilter(req)));
  } else {
    res.status(400).json({ msg: `No booking with the id of ${req.params.id}` });
  }
});

//Delete a booking

app.delete("/bookings/:id", (req, res) => {
  const idFilter = (req) => (booking) => booking.id === parseInt(req.params.id);
  const found = bookings.some(idFilter(req));

  if (found) {
    res.json({
      msg: "Booking Deleted",
      bookings: bookings.filter(
        (booking) => booking.id !== parseInt(req.params.id)
      ),
    });
  } else {
    res.status(400).json({ msg: `No booking with the id of ${req.params.id}` });
  }
});

const PORT = process.env.PORT || 4040;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
