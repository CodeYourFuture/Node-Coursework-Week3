const express = require("express");
const cors = require("cors");
const app = express();
const bp = require("body-parser");
const moment = require("moment");
var validator = require("email-validator");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
let maxID = Math.max(...bookings.map((c) => c.id));

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Read All bookings
app.get("/allBookings", (req, res) => {
  res.json(bookings);
});

// Read one booking, specified by an ID
app.get("/booking/:id", (req, res) => {
  const bookingId = req.params.id;
  const indexBooking = bookings.findIndex(
    (booking) => booking.id === parseInt(bookingId)
  );
  if (indexBooking >= 0) {
    res.send(bookings[indexBooking]);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
});

// Delete one booking, specified by an ID
app.delete("/booking/:id", (req, res) => {
  const bookingId = req.params.id;
  const updateBookings = bookings.filter(
    (elm) => elm.id !== parseInt(bookingId)
  );

  if (updateBookings.length < bookings.length) {
    bookings = [...updateBookings];
    res.send(bookings);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
});

// Search by Date
app.get("/bookings/search", (req, res) => {
 if(req.query.date){
  const bookingWithDate = moment(req.query.date);
  // console.log(req.query.date)
  if (!bookingWithDate.isValid()) {
    res.status(400).send("the date is not valid");
  } else {
    let bookingsInValidDates=[];
     bookings.map((elm) => {
      moment(elm.checkInDate).isBefore(bookingWithDate)? 
      bookingsInValidDates.push(elm): null;
    });
    // console.log(bookingsInValidDates);
    res.send(bookingsInValidDates);
    return;
  }
}
if (req.query.term){
const  term= req.query.term;
// console.log(term)
const bookingWithThisTerm=[];
bookings.map( elm => (
  elm.firstName.toLowerCase().includes(term) ||
  elm.surname.toLowerCase().includes(term)  ||
  elm.email.toLowerCase().includes(term)) ? bookingWithThisTerm.push(elm):null
)

  res.send(bookingWithThisTerm);
  return;
}
});


//free search 
app.get("/bookings/search", (req, res) => {
  const  term= req.query.term;
  // console.log(term)
  const bookingWithThisTerm=bookings.filter( elm => {
    elm.firstName.includes(term) ||
    elm.surname.includes(term)  ||
    elm.email.includes(term)
  })
  
    res.send(bookingWithThisTerm);
    return
  
});

//1. Create a new booking
app.post("/booking", (req, res, next) => {
  if (
    !req.body.firstName ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.checkInDate ||
    !req.body.checkOutDate ||
    !req.body.roomId
  ) {
    res.status(400).send(`Some details are missing`);
    return;
  } else if (!validator.validate(req.body.email) ||
  moment(req.body.checkOutDate).isBefore(moment(req.body.checkInDate))    ){
    res.status(400).send(`Email is not valid or the date is not consist`);
  }
  
    else {
    const newBooking = {
      id: ++maxID,
      title: req.body.title,
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      roomId: req.body.roomId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    };

    // console.log(newBooking);
    bookings = [...bookings, newBooking];
    res.send(bookings);
    // console.log(bookings);
    return;
  }
});

const PORT = process.env.PORT || 5000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});


// just added .gitignore