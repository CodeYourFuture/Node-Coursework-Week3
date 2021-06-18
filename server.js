const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//Create a New Booking
app.post("/bookHotel", function (request, response) {

  const newBooking = {
    id: request.body.id,
    roomID: request.body.roomID,
    title: request.body.title,
  };

  if (!newBooking.id) {
    return response
      .status(400)
      .json({ message: `No Booking ID` });
  } else {
    bookings.push(newBooking);
    response.send(bookings);
  }
  // TEST
  // let testID = bookings.length + 1;
  // const newBooking = {id: testID, ...request.body,};
});

//READ || GET ALL BOOKINGS
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

// READ BOOKING SPECIFIED BY ID
app.get("/booking/:id", (request, response) => {
  const availableBookings = bookings.filter(
    (booking) => booking.id === parseInt(request.params.id)
  );
  const unavailableBookiings = bookings.some(
    (booking) => booking.id === parseInt(request.params.id)
  );
  if (unavailableBookiings) {
    response.json(availableBookings);
  } else {
    response
      .status(404)
      .json({ message: `No Booking with this id ${request.params.id}` });
  }
});

//DELETE A BOOKING SPECIFIED BY ID
app.delete("/booking/:id", (request, response) =>{
  const deleteBooking = bookings.filter(
    (item) => item.id === parseInt(request.params.id)
  );
  const selectBooking = bookings.some(
    (item) => item.id === parseInt(request.params.id)
  );
  if(selectBooking){
    response.json(deleteBooking)
  } else{
    response
      .status(404)
      .json({ message: `ID ${request.params.id} unavailable to delete `});
  }
})

// VALIDATION 
app.post("/booking", function (request, response) {
  let testID = bookings.length - 1;
  const newBooking = { id: testID, ...request.body };

  if (
    !newBooking.id ||
    !newBooking.title ||
    !newBooking.firstName ||
    !newBooking.surname ||
    !newBooking.email ||
    !newBooking.roomId ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return response
      .status(404)
      .json({ message: `Booking information is missing!` });
  } else {
    bookings.push(newBooking);
    response.send(bookings);
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
