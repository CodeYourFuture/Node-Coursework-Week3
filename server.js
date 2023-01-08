const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

//using midaleware needed
app.use(express.json());
app.use(cors());

//Initalising the data
const bookings = require("./bookings.json");
let maxID = Math.max(...bookings.map((c) => c.id));

//root directory
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask /bookings for all bookings");
});

//creat a new booking
app.post("/create/booking", function (req, res) {
  const roomId = req.body.roomId;
  const title = req.body.title;
  const firstName = req.body.firstName;
  const surname = req.body.surname;
  const email = req.body.email;
  const checkInDate = req.body.checkInDate;
  const checkOutDate = req.body.checkOutDate;
  if (
    !roomId ||
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !checkInDate ||
    !checkOutDate
  ) {
    res
      .status(400)
      .send("invalid data to be posted, post a valid form of data");
    return;
  }
  const newBooking = {
    id: ++maxID,
    roomId: roomId,
    title: title,
    firstName: firstName,
    surname: surname,
    email: email,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
  };

  bookings.push(newBooking);
  save();
  res.json(newBooking);
});

//read all bookings
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

//read one booking based on ID
app.get("/bookings/:id", function (req, res) {
  const queryId = Number(req.params.id);
  if (!queryId) {
    res.send("Provide a Number, Please");
  }
  const result = bookings.find((booking) => booking.id === queryId);
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send("Booking Does Not Exist In The DataBase");
  }
});

//delete one booking based on ID
app.delete("/bookings/:id", function (req, res) {
  const queryId = Number(req.params.id);
  const bookingIndex = bookings.findIndex((booking) => booking.id === queryId);
  if (!queryId) {
    res.send("Provide a Number, Please");
  }
  if (bookingIndex < 0) {
    res.sendStatus(404);
    return;
  }
  bookings.splice(bookingIndex, 1);
  save();
  res.send("Booking has been deleted ! ");
});

//saving data to the database
const save = () => {
  fs.writeFileSync("bookings.json", JSON.stringify(bookings, null, 2));
};

//listening for the server
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
