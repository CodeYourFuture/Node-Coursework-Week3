const express = require("express");
const cors = require("cors");
const fs = require("fs"); // feature to read&Write files
const app = express();
const dayjs = require("dayjs");
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookingData = require("./bookings.json");
//const bookingData = JSON.parse(fs.readFileSync('./bookingData.json', 'utf8'));

//Read
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

// read one booking by id
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


app.post("/bookings", function (req, res) {
  //create a unique id for the booking
  //const id = bookingData.length; requires the id to match the index in the array
  let newId; // declare undefined var
  if (bookingData.length >= 0) {
    // if array is empty than the length is 0
    newId = bookingData[bookingData.length - 1].id + 1;
  } else {
    newId = 0;
  }
  let newBooking = { id: newId, ...req.body };

  // This code might not actually work and is a best guess at what you need to do

  let checkInDate = req.body.checkInDate; //formatted like yyyy-mm-dd
  let checkOutDate = req.body.checkOutDate;
  //NOTE: these will probably throw an exception if the date is malformed
  // or maybe the return value will be undefined
  const validCheckInDate = dayjs(checkInDate);
  const validCheckOutDate = dayjs(checkOutDate);

  const dateDiff = validCheckInDate.diff(validCheckOutDate);
  if (dateDiff > 0) {
    res.status(400);
    res.send({
      message: "cannot have check out date that starts before check in",
    });
    //BAD STUFF HAPPENED (OUT DATE IS BEFORE IN DATE)
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
  }
  fs.writeFileSync(
    "./bookings.json",
    JSON.stringify(bookingData, null, 2),
    () => {}
  );
  res.status(204); // No data
  res.end(); // Response body is empty 
} catch (error) {
  console.log(error.message)
  res.send("request failed error in server")
}  
});


const listener = app.listen(process.env.PORT || 4040, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
