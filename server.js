const express = require("express");
const cors = require("cors");

const app = express();




app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// booking api
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});


// TODO add your routes and helper functions here

// create new message


/* app.post("/bookings", (req, res) => {
  if (!req.body.firstName || !req.body.surname) {
    res.status(400).send("Please Complete all fields");
    return;
  }
  let newID = Math.max(...data.map((msg) => msg.id)) + 1;
  let newMessage = { id: newID, from: req.body.from, text: req.body.text };
  data.push(newMessage);
  save();
  res.json(newMessage);
}); */


// read all messages
app.get("/bookings", function (req, res) {
  res.json(bookings);
});



const listener = app.listen(process.env.PORT=3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
