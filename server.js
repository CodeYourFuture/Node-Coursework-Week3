const express = require("express");
const cors = require("cors");
const validator = require('validator');
const moment = require('moment');


const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
let maxID = Math.max(...bookings.map((c) => c.id));

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//Read all messages
app.get("/bookings", (req, res) => {
  res.send(bookings);
});

//Read all messages by search term
app.get("/bookings/search", (req, res) => {
  const term = req.query.term;
  const date = req.query.date;

  if (term) {
    // search by term
    const searchResults = bookings.filter(booking => {
      return (
        booking.firstName.toLowerCase().includes(term.toLowerCase()) ||
        booking.surname.toLowerCase().includes(term.toLowerCase()) ||
        booking.email.toLowerCase().includes(term.toLowerCase())
      )
    })
    res.send(searchResults)
  } else if (date) {
    // search by date
    const searchResults = bookings.filter(booking => {
      return (
        booking.checkInDate <= date && booking.checkOutDate >= date
      )
    })
    res.send(searchResults)
  } else {
    res.send('Please provide a search term or date')
  }
  // const term = req.query.term ? req.query.term.toLowerCase() :"";
  // const date=req.query.date ? moment(req.query.date): "";
  // console.log(`item is${term}`);
  // console.log(date)
  // console.log(moment(bookings[0].checkInDate));
  // // if (!req.body.term && !req.body.date) {
  // //   res.status(400).send("Please add search item");
  // //   return;
  // // }
  // console.log("date",moment(bookings[0].checkInDate).isSameOrBefore(date) && moment(bookings[0].checkOutDate).isSameOrAfter(date));
  // console.log("date",moment(bookings[0].checkInDate).isSame(date));
  
  // // Search for bookings that match the search term and span the given date

  // let searchedBooking = bookings.filter((c) =>
  //  c.firstName.toLowerCase().includes(term) ||c.surname.toLowerCase().includes(term) || c.email.includes(term) || moment(c.checkInDate).isSame(date)
  // );
  // if (searchedBooking.length === 0) {
  //   res.status(404).json({ msg: `Booking not found` });
  //   return;
  // }
  // res.json(searchedBooking);
});

//Read all messages by search term
// app.get("/bookings/search", (req, res) => {
//   const date=parseInt(req.query.data);
//   if (!date) {
//     res.status(400).send("Please add search date");
//     return;
//   }
//   let searchedBooking = bookings.filter((c) =>
//     c.checkInDate.includes(date)
//   );
//   if (searchedBooking.length === 0) {
//     res.status(404).json({ msg: `Booking not found` });
//     return;
//   }
//   res.json(searchedBooking);
// });

//Read one Booking specified by an ID
app.get("/messages/:id", (req, res) => {
  let bookingID = parseInt(req.params.id);
  let copyOfBookings = bookings;
  let booking = copyOfBookings.find((c) => c.id === bookingID);
  if (!booking) {
    res.status(404).json({ msg: `Booking not found with the id ${bookingID}` });
    return;
  }
  res.json(booking);
});

// Create a new booking
app.use(express.json());
const compulsoryFields = ['title', 'firstName', 'surname', 'email','roomId','checkInDate','checkOutDate'];
app.post("/booking", (req, res) => {
  // validate our input
  //1.validate if all the fields are included
   if (!compulsoryFields.every(cf => req.body.hasOwnProperty(cf))) {
        res.status(401).send('Not all compulsory fields supplied');
        return;
    }
  //2.validate the email
    if (!validator.isEmail(req.body.email)) {
        res.status(401).send('Email is not valid');
        return;
    }
  //3. validate checkoutDate is after checkinDate and format of date "yyyy-mm-dd"
    const checkIn = moment(req.body.checkInDate,'YYYY-MM-DD');
    const checkOut = moment(req.body.checkOutDate,'YYYY-MM-DD');
    if (!checkIn.isValid() && !checkOut.isValid()) {
       res.status(401).send("CheckIn/Out date is not valid");
        return;
    }
    if (!checkOut.isAfter(checkIn)) {
        res.status(401).send("CheckOut date can't be before Checkin date ");
        return;
    }
    const newEntry = { id: ++maxID };
    compulsoryFields.forEach(fld => { if (req.body[fld]) { newEntry[fld] = req.body[fld] } });
    bookings.push(newEntry);
    res.send(newEntry)
});

