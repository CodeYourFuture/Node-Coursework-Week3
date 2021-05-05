const express = require("express");
const cors = require("cors");
const fs = require("fs"); // feature to read&Write files
// const moment = require("moment");
const IsEmail = require('isemail');

const app = express();
const dayjs = require("dayjs");

app.use(express.json());
app.use(cors());

const bookingData = require("./bookings.json");
//const bookingData = JSON.parse(fs.readFileSync('./bookingData.json', 'utf8'));



// function emailValidator(email, req) {
//   const validEmail = IsEmail.validate(req.params.email, { errorLevel: true });
//   const inValidEmail = IsEmail.validate(req.params.email, { errorLevel: false });

//   if (email == validEmail) {
//     return email
//   } else{
//    return inValidEmail
//   }
// }



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
    const searchedDate = req.query.date;
    console.log("date1", searchedDate);
    res.send(search(searchedDate, bookingData));
  } catch (error) {
    console.log(error.message);
    res.sendStatus(400);
  }
});

// /bookings/search?date=2019-05-20
function search(date, bookingData) {
  let result = bookingData.filter((booking) => {
    if ((booking.checkInDate === date) || (booking.checkOutDate === date)) {
      console.log("func date", booking)
      return booking
    }
  });
    return result;
  }

//http://localhost:4040/booking/search?date=2021-05-04
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
      res.status(200).send(foundBooking);
    }
  } catch (error) {
    console.log(error.booking);
    res.sendStatus(500);
  }
});

// // Read- messages with substring express -lv 3
// app.get("/bookings/search", function (req, res) {
//   // try {
//   const date  = req.query.date;
//   const result = search(date, bookingData);
//     // if (result) {
//         // console.log("result in if", result);
//     res.status(200).json({ message: "date retrieved from the database" }).send(result);
//     // } else {
//     // res.status(400).json({ message: "date does not exist in the database" })
//     // }
//   // } catch (error) {}
//   // res.status(500);
//   // console.log(error.message);
// });

//Create single booking
app.post("/bookings", function (req, res) {
  //create a unique id for the booking
  //const id = bookingData.length; requires the id to match the index in the array
  const reqEmail = req.body.email
  
  let newId; // declare undefined var
  if (bookingData.length >= 0) {
    // if array is empty than the length is 0
    newId = bookingData[bookingData.length - 1].id + 1;
  } else {
    newId = 0;
  }
  let newBooking = { id: newId, ...req.body };
  let checkInDate = req.body.checkInDate; //formatted like yyyy-mm-dd
  let checkOutDate = req.body.checkOutDate;
  //NOTE: these will probably throw an exception if the date is malformed
  // or maybe the return value will be undefined
  const validCheckInDate = dayjs(checkInDate);
  console.log("test", validCheckInDate);
  const validCheckOutDate = dayjs(checkOutDate);
  const dateDiff = validCheckInDate.diff(validCheckOutDate);

  if (dateDiff > 0) {
    res.status(400);
    res.send({
      message: "cannot have check out date that starts before check in",
    });
  } else {
    bookingData.push(newBooking);
    res.send(newBooking);
  }
  // add error handling
  // validate the input
  // TODO
  //send the response
  fs.writeFileSync(
    "./bookings.json",
    JSON.stringify(bookingData, null, 2),
    () => {}
  ); // logic for adding -formats the file immediately
});

// Delete
app.delete("/bookings/:id", (req, res) => {
  try {
    const bookingIndex = bookingData.findIndex(
      (booking) => booking.id == req.params.id
    );
    if (bookingIndex >= 0) {
      bookingData.splice(bookingIndex, 1);
      fs.writeFileSync(
        "./bookings.json",
        JSON.stringify(bookingData, null, 2),
        () => {}
      );
      res.status(200);
    } else {
      res.status(204).json({ message: "ID does not exist in the database" }); // No data
      res.end(); // Response body is empty
    }
  } catch (error) {
    // generic error
    res.status(500);
    console.log(error.message);
  }
});

const listener = app.listen(process.env.PORT || 4040, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
