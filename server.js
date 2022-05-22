const express = require("express");
const cors = require("cors");
const moment = require("moment")
const emailValidation = require("nodejs-email-validation");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");
let count = bookings.length + 1;

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.post("/bookings", (request, response) => {
  const title = request.body.title;
  const firstName = request.body.firstName;
  const surname = request.body.surname;
  const email = request.body.email;
  const roomId = request.body.roomId;
  const checkInDate = request.body.checkInDate;
  const checkOutDate = request.body.checkOutDate;

  const newBooking = {
    title,
    firstName,
    surname,
    email,
    roomId,
    checkInDate,
    checkOutDate,
  };

  const validEmail = emailValidation.validate(email);
  if (!validEmail) {
    return response.status(400).json({msg: "Please include a valid email"});
  } else if (!moment(checkOutDate).isAfter(checkInDate)) {
    return response.status(400).json({ msg: "Please check your dates, you cannot check out before you check in." });
  } else if (!title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate) {
    return response.status(400).json({
      msg: `Please include ${
        !newBooking.title
          ? "a title."
          : !newBooking.firstName
          ? "a first name."
          : !newBooking.surname
          ? "a surname."
          : !newBooking.email
          ? "an email."
          : !newBooking.roomId
          ? "a room id."
          : !newBooking.checkInDate
          ? "a check in date."
          : !newBooking.checkOutDate && "a check out date"
        }.`,
      });
    } else {
    (newBooking.id = count++); bookings.push(newBooking);
      response.json("Booking Added");
    }
  });
  app.get("/bookings", (request, response) => {
    response.send(bookings);
  });
  app.get("/bookings/search?", (request, response) => {
    let dateSearched = request.query.date;
    const isBetween = bookings.filter(booking => {return moment(dateSearched).isBetween(booking.checkInDate, booking.checkOutDate, undefined, "[]");
    })
    if ( dateSearched.length !== 10 || !dateSearched.match("\\d{4}-\\d{2}-\\d{2}")) {
      response.send("Please enter a valid date with the format YYYY-MM-DD");
    } else if (isBetween.length > 0) {
      response.json(isBetween);
    } else {
      response.status(404).send(`Sorry, no bookings could be found for the date ${dateSearched}`);
    }
  });
  
app.get("/bookings/:id", (request, response) => {
  const findBooking = bookings.some((booking) => booking.id === Number(request.params.id));
  if (findBooking) {
    response.json(bookings.filter((booking) => booking.id === Number(request.params.id)));
  } else {
    response.status(404).send(`Sorry, there is no booking with id ${request.params.id}`);
  }
});

app.delete("/bookings/:id", (request, response) => {
  const findBooking = bookings.some((booking) => booking.id === Number(request.params.id));
  if (findBooking) {
    bookings = bookings.filter((booking) => booking.id !== Number(request.params.id));
    response.json({ msg: "Booking deleted successfully", bookings });
  } else {
    response.status(404).send(`Sorry, there is no booking with id ${request.params.id}`);
  }
});


const PORT = process.env.PORT || 7555;

app.listen(PORT, function () {
  console.log("Your app is listening on port " + PORT);
});
