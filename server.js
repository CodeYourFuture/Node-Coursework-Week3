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

/******************************* ceating a new booking */
app.post("/booking",(req, res)=>{
  const newBooking = req.body;
  bookings.push(newBooking)
  res.json({bookings})
})


// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
app.listen(2000,()=>console.log("your server is listening to port 2000"))