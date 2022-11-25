const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
let id = 6;


app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.post("/bookings", (req, res) => {
  const {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  } = req.body;

  if (
    !title ||
    !firstName ||
    !surname ||
    !email ||
    !roomId ||
    !checkInDate ||
    !checkOutDate
  ) {
    return res.sendStatus(404);
  }
  bookings.push({ ...req.body, id: id++ });
  console.log(bookings);
  return res.sendStatus(201);
});

// TODO add your routes and helper functions here

app.get("/bookings", (req, res) => {
  res.send(bookings);
});

app.get("/bookings/:id", (req, res) => {
  let findById = bookings.find((booking) => booking.id == req.params.id);
  if (!findById) res.sendStatus(404);
  res.send(findById);
});


app.delete("/bookings/:id", (req, res) => {
  let findByIndex = bookings.findIndex(
    (booking) => booking.id == req.params.id
  );
  bookings.splice(findByIndex, 1);
  if (findByIndex === -1) res.sendStatus(404);
  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
