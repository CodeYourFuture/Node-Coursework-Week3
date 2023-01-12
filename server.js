const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
const bookings = require("./bookings.json");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.

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
  const receivedData = Object.keys(obj);
  if (Model.every((x) => receivedData.includes(x))) {
    return validator.validate(obj.email);
  }
  return false;
}

//.....................Routes................................................

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// 1. Read all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.get("/bookings/search", (req, res) => {
  let result = bookings;

  if (req.query.date) {
    const inputDate = moment(req.query.date);
    result = bookings.filter((item) =>
      moment(item.checkInDate).isSame(moment(inputDate))
    );
  }

  if (req.query.term) {
    let term = req.query.term
    result = result.filter((item) => Object.values(item).includes(term));
  }
  res.json(result);
});

app.get("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const result = bookings.find((item) => item.id === +id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/bookings", (req, res) => {
  const result = {};
  const id = getMaxId(bookings) + 1;
  if (isValid(req.body)) {
    result.id = id;
    for (let key of Model) {
      result[key] = req.body[key];
    }
    bookings.push(result);
    fs.writeFile("bookings.json", JSON.stringify(bookings), (err) =>
      res.send(err)
    );
    res.json(bookings);
  } else {
    res.status(400).send("Please provide all mandatory data or a valid email");
  }
});

app.delete("/bookings/:id", (req, res) => {
  let id = req.params.id;
  const id_data = bookings.find((item) => item.id === +id);
  if (id_data) {
    const result = bookings.filter((item) => item.id !== +id);
    fs.writeFile("bookings.json", JSON.stringify(result), (err) =>
      res.send(err)
    );
    res.json(result);
  } else {
    res.status(404).send("Not found");
  }
});

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + 5000);
});
