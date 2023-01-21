const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

app.get("/booking", function (req, res) {
  
  res.send(bookings);
});

app.get("/booking/:id", function (req, res) {
  const bookingId= +req.params.id
  const booking =bookings.find(booking => booking.id === bookingId)
  if (!booking){
  res.status(404).send("404 error");
  }else {
  res.send(booking);
  }
});

app.post("/booking",function(req,res){
 const createBooking= req.body
 createBooking.id = bookings.length +1
 const { title, firstName, surname, email, roomId, checkInDate, checkOutDate } =
   createBooking;
 const valid =
   !!title &&
   !!firstName &&
   !!surname &&
   !!email &&
   (roomId === 0 || !!roomId) &&
   !!checkInDate &&
   !!checkOutDate;
   if(valid){bookings.push(createBooking)
    res.json(bookings)
  }
   else{res.status(400).send("Missing Information")

   }
}
)


app.delete("/booking/:id", function (req, res) {
  const bookingId = +req.params.id;
  const bookingIndex= bookings.findIndex((booking) => booking.id === bookingId);
  if(bookingIndex === -1){ 
    res.status(404).send("404 error");
  } else{
    bookings.splice(bookingIndex,1)
  res.json(bookings);
  }
})

const listener = app.listen(9000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

