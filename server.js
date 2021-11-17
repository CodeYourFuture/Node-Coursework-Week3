const express = require("express");
const cors = require("cors");
const moment = require("moment");
const emailValidation = require('nodejs-email-validation')


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here

//get all bookings
app.get("/bookings", function (request, response) {
  response.status(200).json(bookings);
});
app.get("/bookings/search", function (request, response) {
  const word = request.query.term;
  let id_booking = [];
  const dateEntered = request.query.date;
  if (word) {
    id_booking = searchWord(word);
    if (id_booking.length >= 1) {
      response.status(200).json(id_booking);
    } else {
      response.status(404).json({ message: "no entry found" });
    }
  } else if (dateEntered) {
    id_booking = searchDate(dateEntered);
    if (id_booking.length >= 1) {
      response.status(200).json(id_booking);
    } else {
      response.status(404).json({ message: "no entry found" });
    }
  } else {
    response.status(404).json({ message: "no entry found" });
  }
});

//get bookings with particular id
app.get("/bookings/:id", function (request, response) {
  const bookingId = parseInt(request.params.id);
  let id_booking = bookings.find((booking) => booking.id === bookingId);
  id_booking ? response.status(200).json(id_booking) : response.status(404).json({message: "id not found" });
});

//app delete with id
app.delete("/bookings/:id", function (request, response) {
  const bookingId = parseInt(request.params.id);
  let toDelete = bookings.find((booking) => booking.id === bookingId);
 if (toDelete) {
    let id_booking = bookings.findIndex((booking) => booking.id === bookingId);
    let modifiedArray = bookings.splice(id_booking, 1);
    response.sendStatus(204);
  }
  else { response.status(404).json({ 'message': 'id not found' } )}
  
});


const searchDate = (date) => {
  return bookings.filter(booking=> moment(date).isBetween(booking.checkInDate,booking.checkOutDate))

}
const searchWord = (wordSearched) => {
  let word = wordSearched.toLowerCase();
  let id_booking = bookings.filter(
    (booking) =>
      booking.firstName.toLowerCase().includes(word) ||
      booking.surname.toLowerCase().includes(word) ||
      booking.email.includes(word)
  );
  return id_booking;
};

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//post a new booking

app.post("/bookings", function (request, response) {
  const newBooking = {
    id: bookings.length + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: parseInt(request.body.roomId),
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate
  };
 
  let validBooking = isValid(newBooking);
  console.log(validBooking.length)
  if(validBooking)
   {
    bookings.push(newBooking);
    response.status(200).json({'message': 'booking added' });
  } else response.sendStatus(400);
 
});
const isValid = (Booking) => {
  const { title, firstName, surname, email, roomId, checkInDate, checkOutDate } = Booking;
  if (
    title &&
    title != "" &&
    firstName &&
    firstName != "" &&
    surname &&
    surname != "" &&
    email &&
    email != "" &&
    emailValidation.validate(email) &&
    roomId &&
    roomId > 0 &&
    checkInDate &&
    checkInDate != "" &&
    checkOutDate &&
    checkOutDate != "" &&
    moment(checkInDate, "YYYY-MM-DD", true).isValid() &&
    moment(checkOutDate, "YYYY-MM-DD", true).isValid() && moment(checkOutDate)
    .isAfter(checkInDate)
  ) {
    return true;
  } else return false;
 }
// TODO add your routes and helper functions here

const listener = app.listen("13000", function () {
  console.log("Your app is listening on port " + listener.address().port);
});



