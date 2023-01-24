const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
app.get("/bookings", (request, response) => {
  response.json({bookings});
})

app.get("/bookings/:id", (request, response) => {
  const id = Number(request.params.id);
  const findId = bookings.find((booking) => booking.id === id);
  if (!findId) {
    return response
     .status(404)
     .json({ message: `booking with the ${id} not found`});

  }
  response.status(200).json({findId});
});

app.post("/bookings", (request, response) => {
  if (
    request.body.firstName === "" ||
    request.body.email === "" ||
    request.body.surname == "" ||
    request.body.title === "" ||
    request.body.checkInDate === "" ||
    request.body.checkOutDate === "" ||
    request.body.roomId === null
  ) {
    response.status(400).json({ message: "please fill all the fields" });
    return;
  }
  const newBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };
  bookings.push(newBooking);
  response.status(201).json({ bookings });
});
app.delete("/bookings/:id", (request, response) => {
  const requestId = Number(request.params.id);
  let result = bookings.filter((item) => item.id !== requestId);
  if (requestId<0){
    return response.status(404).json({ msg: "message not found" });

  }
  response.json({ result });
});
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
