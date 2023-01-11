const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

let Model = [
  "title",
  "firstName",
  "surname",
  "email",
  "roomId",
  "checkInDate",
  "checkOutDate",
];

//Helper functions.................................................

function getMaxId(arr) {
  let idArray = arr.map((el) => (el = el.id));
  return Math.max(...idArray);
}

function isValid(obj) {
  let receivedData = Object.keys(obj);
  return Model.every((x) => receivedData.includes(x));
}

//.....................Routes................................................

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});


// 1. Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// 1. Read one booking, specified by an ID
app.get("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const result = bookings.find((item) => item.id === +id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Not Found");
  }
});

// 1. Create a new booking
app.post("/bookings", (req, res) => {
  const result = {};
  const id = getMaxId(bookings) + 1;
  if (isValid(req.body)) {
    result.id = id;
    for (let key of Model) {
      result[key] = req.body[key];
    }
    bookings.push(result);
    res.json(bookings);

  } else {
    res.status(400).send("Please provide all mandatory data");
  }
});

// 1. Delete a booking, specified by an ID
app.delete("/bookings/:id", (req, res) => {
  let id = req.params.id;
  const id_data = bookings.find((item) => item.id === +id);
  if(id_data) {
     const result = bookings.filter((item) => item.id !== +id);
      res.json(result);
  } else {
    res.status(404).send("Not found")
  }
});

// If the booking to be read cannot be found by id, return a 404.

// If the booking for deletion cannot be found by id, return a 404.

// All booking content should be passed as JSON.

// See the later spoiler section "Correct Routes" if you are not sure of the correct routes.

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + 5000);
});
