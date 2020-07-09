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

// TODO add your routes and helper functions here

//read all messages
app.post("/bookings", (req, res) => {
  bookings.push(req.body);
  res.send({ success: true });
});
app.get("/bookings", function (request, response) {
  response.send(bookings);
});

const port = process.env.PORT || 5000;
app.listen(port);

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
