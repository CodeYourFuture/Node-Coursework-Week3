const express = require("express");
const cors = require("cors");

const app = express();
let bodyParser = require("body-parser");
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))
//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.sendFile(__dirname+"/index.html");
});
//new booking
app.post("/bookings", (req, resp) => {
  bookings.push({
    id:bookings.length+1  ,
    title: req.body.title   ,
    firstName:   req.body.firstName ,
    surname: req.body.surname  ,
    email: req.body.email  ,
    roomId: req.body.roomId,
    checkInDate: req.body.checkIn,
    checkOutDate: req.body.checkOut
  })
  resp.send(bookings)
})

// TODO add your routes and helper functions here
const PORT = process.env.PORT || 5000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + PORT);
});
