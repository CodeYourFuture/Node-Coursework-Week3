const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const PORT = 9000;

const app = express();

app.use(express.json());
app.use(cors());

// TODO add your routes and helper functions here

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
app.listen(PORT, function () {
  console.log(`Server is listening on ${PORT}. Ready to accept requests!`);
});

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { response, request } = require("express");

// to read all the bookings
app.get("/bookings", function (request, response) {
  response.json(bookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (request, response) => {
  const foundId = bookings.some(
    (eachbooking) => eachbooking.id === parseInt(request.params.id)
  );
  console.log(foundId);
  if (foundId) {
    response
      .status(200)
      .json(
        bookings.filter(
          (eachmessage) => eachmessage.id === parseInt(request.params.id)
        )
      );
  } else {
    response
      .status(404)
      .json({
        message: `No bookings with the id of ${request.params.id} is found`,
      });
  }
});

//  to create bookings & level :02 


app.post("/createNewBookings", (request, response) => {
  //  console.log("hello hahha")
  // response.send(request.body)
  let createNewBookings = {
    id: uuid.v4(),
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };
  if (
    !createNewBookings.title ||
    !createNewBookings.firstName ||
    !createNewBookings.surname ||
    !createNewBookings.email ||
    !createNewBookings.roomId ||
    !createNewBookings.checkInDate ||
    !createNewBookings.checkOutDate
  ) {
    return response.status(400).json({
      msg: "Please include a title, FirstName, surName, Email, RoomId, CheckInDate & CheckOutDate",
    });
  }

  bookings.push(createNewBookings);
  response.json(bookings);
});

// Delete a booking, specified by an ID

app.delete("/bookings/delete/:id", (request, response) => {
  const foundId = bookings.some(
    (eachbooking) => eachbooking.id === parseInt(request.params.id)
  );

  console.log(foundId);
  if (foundId) {
    response.status(200).json({
      message: `DELETED the booking with the id of ${request.params.id}`,
      bookings: bookings.filter(
        (eachmessage) => eachmessage.id !== parseInt(request.params.id)
      ),
    });
  } else {
    response.status(404).json({
      message: `No bookings with the id of ${request.params.id} is found`,
    });
  }
});
