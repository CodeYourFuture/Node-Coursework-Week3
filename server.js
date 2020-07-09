const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const moment = require('moment')
const validator = require('email-validator')

const app = express();

app.use(express.json());
app.use(bodyParser.json())
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.get("/bookings", (request, response)=>{
  response.send(bookings);
});

app.post("/bookings/add", (req, res)=>{
  const {title, firstName: firstName, surname, email, roomId, checkInDate, checkOutDate} = req.body
  const isEmailOk = validator.validate(email)
  const isDateOk = (moment(checkInDate) < moment(checkOutDate))? true : false;

  if(title && firstName && firstName && surname && isEmailOk && isDateOk && roomId && checkInDate && checkOutDate){
    
    const booking = {
      "id" :Math.floor(Math.random()*1000000),
      "title":title,
      "firstName":firstName,
      "surname":surname,
      "email":email,
      "roomId":roomId,
      "checkInDate":checkInDate,
      "checkOutDate":checkOutDate
    }
    bookings.push(booking)
    res.send(bookings)
  
  }else{
    res.status(400).send('bad request')
  };

})

app.get("/bookings/search", (req, res)=>{
  const date = req.query.date;
  const searchedBooking =  bookings.filter(booking => booking.checkInDate === date || booking.checkOutDate === date)
  if (searchedBooking.length >0){
    res.send(searchedBooking)
  }else{
    res.status(400).send("Not found!");
  }
})

app.put("/bookings/:id", (req, res)=>{
  const bookingId = Number(req.params.id);
  const found = bookings.some(booking => booking.id === bookingId);
  if(found){
    const booking = bookings.find(booking => booking.id === bookingId)
    const {title, firstName, surname, email, checkInDate, checkOutDate} = req.body
    booking.title = title ? title: booking.title;
    booking.firstName = firstName ? firstName: booking.firstName;
    booking.surname = surname ? surname: booking.surname;
    booking.email = email ? email: booking.email;
    booking.roomId = roomId ? roomId: booking.roomId;
    booking.checkInDate = checkInDate ? checkInDate: booking.checkInDate;
    booking.checkOutDate = checkOutDate ? checkOutDate: booking.checkOutDate;
    res.json(bookings)
  }else{
    res.status(404).send('not found!')
  }
})


app.delete("/bookings/:id", (req , res)=>{
const bookingId = Number(req.params.id)
const found = bookings.some(booking => booking.id === bookingId)
if(found){
  bookings= bookings.filter(booking => booking.id !== bookingId)
  res.json(bookings)
}else{
  res.status(404).send("not found")
}
});

app.get("/bookings/:id", (req, res)=>{
  const bookingId = Number(req.params.id);
  const booking = bookings.filter(booking => booking.id === bookingId)
  if(booking.length > 0){
    res.send(booking)
  }else{
    res.status(404).send("not found")
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
