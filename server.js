const express = require("express");
const cors = require("cors");
const fs = require("fs"); // feature to read&Write files
const IsEmail = require("isemail");

const app = express();
const dayjs = require("dayjs");

app.use(express.json());
app.use(cors());

const bookingData = require("./bookings.json");

//Read home server page
app.get("/", function (req, res) {
  res.send("Hotel booking server.  Ask for /bookings, etc.");
});

// read all bookings
app.get("/bookings", function (req, res) {
  try {
    res.status(200).send(bookingData);
  } catch (error) {
    res.status(400).json({ message: "your request invalid" });
  }
});

// search term
app.get("/bookings/search", function (req, res) {
  try {
    const searchedTerm = req.query.date || req.query.term;
    console.log("date1", searchedTerm);
    res.send(search(searchedTerm, bookingData));
  } catch (error) {
    console.log(error.message);
    res.sendStatus(400);
  }
});

// /bookings/search?date=2019-05-20
function search(term, bookingData) {
  const result = bookingData.filter((booking) => {
    if (
      booking.checkInDate === term ||
      booking.checkOutDate === term ||
      booking.email.toLowerCase() === term ||
      booking.firstName.toLowerCase() === term ||
      booking.surname.toLowerCase() === term
    ) {
      return booking;
    }
  });
  return result;
}

// Read one booking by id
app.get("/bookings/:id", function (req, res) {
  const searchId = parseInt(req.params.id);
  try {
    const foundBooking = bookingData.find((booking) => {
      // function looks for the first element that matches the condition, starting from index 0
      if (searchId === booking.id) {
        return booking;
      }
    });
    if (foundBooking) {
      res.status(200).send(foundBooking);
    } else {
      res
        .status(404)
        .json({ message: "booking id does not exist in the database" });
    }
  } catch (error) {
    console.log(error.booking);
    res.sendStatus(500);
  }
});

//Create single booking
app.post("/bookings", function (req, res) {
  try {
  function emailValidator(email) {
    return IsEmail.validate(email);
  }
  const bookingEmail = req.body.email;
  if (emailValidator(bookingEmail) === false) {
    return res.status(400).send({ message: "please input a valid email" });
  }

  let newId; // declare undefined var
  if (bookingData.length >= 0) {
    newId = bookingData[bookingData.length - 1].id + 1;
  } else {
    newId = 0;
  }
  let newBooking = { id: newId, ...req.body };
  let { checkInDate, checkOutDate } = req.body
  const dateDiff = dayjs(checkInDate).diff(dayjs(checkOutDate))
  

  if (dateDiff > 0) {
   return  res.status(400).send({
      message: "cannot have check out date that starts before the check in date",
    });
  }

  bookingData.push(newBooking);
  res.send(newBooking);
  fs.writeFileSync(
    "./bookings.json",
    JSON.stringify(bookingData, null, 2),
    () => {}
  );  
  } catch (error) {
    res.send(error.message)
  }
});

// Delete
app.delete("/bookings/:id", (req, res) => {
  try {
    const bookingIndex = bookingData.findIndex(
      (booking) => booking.id == req.params.id
    );
    if (bookingIndex < 0) {
      return res.sendStatus(204);
    }
    bookingData.splice(bookingIndex, 1);
    fs.writeFileSync(
      "./bookings.json",
      JSON.stringify(bookingData, null, 2),
      () => {}
    );
    res.status(200).send({ message: "deleted selected booking entry" });
  } catch (error) {
    res.status(500);
    console.log(error.message);
  }
});

const listener = app.listen(process.env.PORT || 4040, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
