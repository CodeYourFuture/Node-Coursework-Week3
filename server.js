const express = require("express");
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
const fs = require("fs");

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
  const receivedData = Object.keys(obj);
  if (Model.every((x) => receivedData.includes(x))) {
    return validator.validate(obj.email);
  }
  return false;
}

// Controller Functions.....................................
const queryBookings = (req, res) => {
  let result = bookings;

  if (req.query.date) {
    const inputDate = moment(req.query.date);
    result = bookings.filter((item) =>
      moment(item.checkInDate).isSame(moment(inputDate))
    );
  }

  if (req.query.term) {
    let term = req.query.term;
    result = result.filter((item) => Object.values(item).includes(term));
  }
  res.json(result);
};

const getAllBookings = (req, res) => {
  res.json(bookings);
};

const getBooking = (req, res) => {
  const id = req.params.id;
  const result = bookings.find((item) => item.id === +id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Not Found");
  }
};

const createBooking = (req, res) => {
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
};

const deleteBooking = (req, res) => {
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
};
//.....................Routes................................................

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
app.get("/bookings/search", queryBookings);
app.route("/bookings").get(getAllBookings).post(createBooking);
app.route("/bookings/:id").get(getBooking).delete(deleteBooking);

const listener = app.listen(process.env.PORT || 5000, function () {
  console.log("Your app is listening on port " + 5000);
});
