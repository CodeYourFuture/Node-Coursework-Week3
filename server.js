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
/**********************************reed all Booking */
app.get("/booking",(req, res)=>{
  res.json({bookings})
})
/*********** Read one booking, specified by an ID */
app.get("/booking/:id",(req,res)=>{
  const bookingToReed =req.params.id;
  const specificBooking = bookings.find(el =>el.id == bookingToReed)
  if(specificBooking){
    res.send({specificBooking})
  }else{
    res.json({error:"error"} ,404)
  }
})
/*********************** Delete a booking, specified by an ID */
app.delete("/booking/:id", (req, res) => {
  const bookingToDelete = req.params.id;
  const BookingToDeleteIndex = bookings.findIndex((el) => el.id == bookingToDelete);
  if (BookingToDeleteIndex !== -1) {
    bookings.splice(BookingToDeleteIndex,1)
    res.send({ bookings });
  } else {
    res.json({ error: "error" }, 404);
  }
});

// const listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });
app.listen(2000,()=>console.log("your server is listening to port 2000"))