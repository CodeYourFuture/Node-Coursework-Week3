const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.Ask for /bookings, etc.");
});

// Create a new booking like:
/*
    "id": 5,
    "title": "Mr",
    "firstName": "John",
    "surname": "Lennon",
    "email": "lennon@example.com",
    "roomId": 3,
    "checkInDate": "2017-08-30",
    "checkOutDate": "2017-10-02"
*/
app.post("/booking", function (req, res) {
  const bookingData = req.body;
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = bookingData;

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return res.status(400).json({ msg: "something in the input was falsey" });
  }

  const newBooking = {
    ...bookingData,
    id: bookings.length + 1,
  };

  bookings.push(newBooking);

  res.json({ newBooking });
});

// get bookings
app.get("/booking/search", function (req, res) {
  const dateString = req.query.date;
  const dateObject = new Date(dateString);
  const dateNumber = dateObject.getTime();

  const filteredBookings = bookings.filter((booking) => {
    const checkInDateAsNumber = new Date(booking.checkInDate).getTime();
    const checkOutDateAsNumber = new Date(booking.checkOutDate).getTime();

    return (
      checkInDateAsNumber <= dateNumber && checkOutDateAsNumber >= dateNumber
    );
  });
  res.json({ filteredBookings });
});

// 1. Read one booking, specified by an ID
app.get("/booking/:id", function(req, res) {
  const findId = Number(req.params.id)
  const booking = bookings.find((booking) => findId == booking.id)
  res.json({booking})
})
// 1. Delete a booking, specified by an ID
app.delete("/booking/:id", function(req, res) {
  const deleteId = Number(req.params.id)
  const findDeletedIdIndex = bookings.findIndex((booking) => deleteId == booking.id)
  const deletedBooking = bookings.splice(findDeletedIdIndex,1)
  res.json({deletedBooking})
})
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
