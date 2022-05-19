const express = require("express");
const cors = require("cors");
const moment = require("moment");
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

//search query should always be at the top
//level 3 Search bookings
app.get("/bookings/search", (req, res) => {
  console.log(req.query);
  const findDate = bookings.filter(
    (booking) => booking.checkInDate === req.query.searchDate
  );
  res.send(findDate);
});

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//Create a new booking
let id = 6;
app.post("/bookings", (request, response) => {
  const {title,firstName,surname,email,roomId,checkInDate,checkOutDate,} = request.body;

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return response.sendStatus(404);
  }
  bookings.push({ ...request.body, id: id++ });
  return response.sendStatus(201);
});

app.get("/bookings", (req, res) => {
  res.send(bookings);
});

// Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const findById = bookings.find((booking) => booking.id === Number(req.params.id)
  );
  if (!findById) res.status(404);
  res.send(findById);
});

//Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  const deleteById = bookings.findIndex((booking) => booking.id === Number(req.params.id)
  );
  bookings.splice(deleteById, 1);

  // DeleteById
  if (deleteById === -1) res.sendStatus(404);
  res.sendStatus(200).send();
});
 
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 5100, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
