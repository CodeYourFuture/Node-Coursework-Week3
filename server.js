const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const moment = require("moment");
const emailValidation = require("email-validator");


const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//  Middleware
// const logger = (req, res, next) => {
//   console.log(
//     `${req.protocol}://${req.get('host')}${
//       req.originalUrl}: ${moment().format()}`
//     );
//   next();
// };


//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const res = require("express/lib/response");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});


//Parse incoming requests data

// TODO add your routes and helper functions here

// Level 1 
// API must allow client to retrieve all bookings

app.get ("/bookings", function (request, response) {
  response.status(200).json(bookings);
});


app.get ("/bookings/search", function (request, response) {
  const word = request.query.term;
  let bookingId = [];
  const dateOfBooking = request.query.date;
  if (word) {
    bookingId = searchWord(word);
    if (bookingId.length >= 1) {
      response.status(200).json(bookingId);
    } else {
      response.status(404).json({message :"No booking found"});
    }
  }else if (dateOfBooking) {
    bookingId = searchDate(dateOfBooking);
    if (bookingId.length >= 1) {
      response.status(200).json(bookingId);
    } else {
      response.status(404).json({message :"No booking found"});
    }
  }
});
// API must allow client to retrieve a specific booking by id

app.get ("/bookings/:id", function (request, response) {
  const bookingId = parseInt(request.params.id);
  const booking = bookings.find(booking => booking.id === bookingId);
  if (booking) {
    response.status(200).json(booking);
  } else {
    response.status(404).json({ message: "Booking ID not found" });
  }
});


//Search for a booking
//  app.get("/bookings/search", function(request, response) {
//   response.send("Hotel booking server.  Ask for /search, etc.");
//   const word = request.query.term;
//   let bookingId = [];
//   const dateOfBooking = request.query.date;
//   if (word) {
//     bookingId = searchWord(word);
//     if (bookingId.length >= 1) {
//       response.status(200).json(bookingId);
//     } else {
//       response.status(404).json({message :"No booking found"});
//     }
//   }else if (dateOfBooking) {
//     bookingId = searchDate(dateOfBooking);
//     if (bookingId.length >= 1) {
//       response.status(200).json(bookingId);
//     } else {
//       response.status(404).json({message :"No booking found"});
//     }
//   }
 //});




// API must allow client to retrieve a specific booking by id

// app.get("/bookings/:id", function (request, response) {
//   const booking = parseInt(request.params.id);
// let bookingId = bookings.find(booking => booking.id === booking);

//   if (bookingId) {
//     response.status(200).json(bookingId);
//   } else {
//     response.status(404).json({ message: "Booking ID not found" });
//   }
// });

app.get("bookings/:ids" , function (request, response) {
  return 'hello';
  // const bookingId = parseInt(request.params.id);
  // const booking = bookings.find(booking => booking.id === bookingId);
  // if (booking) {
  //   response.status(200).json(booking);
  // } else {
  //   response.status(404).json({ message: "Booking ID not found" });
  // }
});


// API must allow client to delete a booking by id

app.delete("/bookings/:id", function (request, response) {

  let bookingId = parseInt(request.params.id);
  let deleted = bookings.find(booking => booking.id === bookingId);
  if (deleted) {
    bookings.splice(bookings.indexOf(deleted), 1);
    response.status(200).json(bookings);
      //{ message: "Booking deleted" });
  } else {
    response.status(404).json({ message: "Booking ID not found" });
  }
});

//   const bookingId = bookings.find(booking => booking.id === parseInt(request.params.id));
//   if (bookingId) {
//     console.log('booking id', bookingId);
//     bookings.splice(bookings.indexOf(bookings.filter(booking => booking.id === parseInt(request.params.id))), 1);
//     response.json(bookings);
//   } else {
//     response.status(404).send(`Booking not found with id ${request.params.id}`);
//   }
// });



// API must allow client to create a new booking

app.post("/bookings", function(request , response){
  const newBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surName: request.body.surName,
    email: request.body.email,
    roomId: parseInt(request.body.roomId),
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };



    if (newBooking){
    bookings.push(newBooking);
    response.status(201).json(bookings);
      //{ message: "Booking created successfully" });
  } else {
    response.status(400).json({ message: "Booking not created" });
  }
});


const isValidBooking = (booking) => {
  let { title, firstName, surName, email, roomId, checkInDate, checkOutDate } = booking;
  if (
    title && 
    title !== "" && 
    firstName && 
    firstName !== "" &&
     surName && 
     surName !== "" && 
     email && 
     email !== "" && 
     emailValidation.validate(email) && 
     roomId && 
     roomId > 0 &&
      checkInDate && 
      checkInDate !== "" && 
      checkOutDate && 
      checkOutDate !== "" && 
      moment(checkInDate, "YYYY-MM-DD", true).isValid() &&
      moment(checkOutDate, "YYYY-MM-DD", true).isValid() && 
      moment(checkOutDate).isAfter(moment(checkInDate)
      ) 
  ) {
    return true;
  } else {
    return false;
  }
}; 

const searchDate = (date) => {
  return bookings.filter((booking) =>
    moment(date).isBetween(booking.checkInDate, booking.checkOutDate)
  );
};
const searchWord = (wordSearched) => {
  let word = wordSearched.toLowerCase();
  let bookingId= bookings.filter(
    (booking) =>
      booking.firstName.toLowerCase().includes(word) ||
      booking.surname.toLowerCase().includes(word) ||
      booking.email.includes(word)
  );
  return bookingId;
};



  //bookings.some(booking => booking.id === parseInt(req.params.id));
//   if (bookingId) {
//     res.json(bookings.filter(booking => booking.id === parseInt(req.params.id)));
//   } else {  
//     response.status(404).send(`Booking not found with id ${req.params.id}`);
//   }
//   response.send(req.params.id);
// });

// API must allow client to create a new booking
// app.post("/bookings", function (request, response) {
//   const newBooking = { 
//   id : uuid.v4(),
//   title : req.body.title,  
//   firstName : req.body.firstName,
//   lastName : req.body.lastName,
//   email : req.body.email,
//   roomId : req.body.roomId,
//   checkInDate : req.body.checkInDate,
//   checkOutDate : req.body.checkOutDate,
// };
// if (!newBooking.title || !newBooking.firstName || !newBooking.lastName || !newBooking.email|| !newBooking.roomId|| !newBooking.checkInDate || newBooking.checkOutDate ) {
//   response.status(400).send("Please enter a booking detail");
// } else {

//   bookings.push(newBooking);
//   response.json(bookings);
// };
// });





















const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
