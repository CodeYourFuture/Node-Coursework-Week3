const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const moment = require("moment");

const app = express();

app.use(express.json());
app.use(cors());
const validator = require("email-validator");
// validator.validate("test@email.com"); // true

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send(
    "Hotel booking server.  Ask for /bookings, etc."
  );
});

//return all bookings
app.get("/bookings", (request, response) => {
  response.send(bookings);
});

// Level 3 (Optional, advanced) - search by date
// /bookings/search?date=2019-05-20 && term
app.get("/bookings/search", (request, response) => {
  let term = request.query.term;
  if (term) {
    term = term.toLowerCase();
    const searchedBookings = bookings.filter(
      (book) =>
        book.firstName.toLowerCase().includes(term) ||
        book.email.toLowerCase().includes(term) ||
        book.surname.toLowerCase().includes(term)
    );
    return response.send(searchedBookings);
  }
  const date = request.query.date;
  const bookingsIndDate = bookings.filter(
    ({ checkInDate, checkOutDate }) =>
      // new Date(booking.checkInDate) <= date &&
      // new Date(booking.checkOutDate) >= date
      moment(date).isBetween(
        moment(checkInDate),
        moment(checkOutDate)
      ) // true
  );
  bookingsIndDate.length === 0
    ? response.status(400).send({
        msg: `There is nobody on date ${request.query.date}`,
      })
    : response.send(bookingsIndDate);
});
//get one booking by id
app.get("/bookings/:id", (request, response) => {
  const customerId = +request.params.id;
  const customerWithId = bookings.find(
    (booking) => booking.id === customerId
  );
  customerWithId
    ? response.send(customerWithId)
    : response.status(404).send({
        msg: `Custumer doesn't exist with id: ${customerId} `,
      });
});

//Create a new booking
app.post("/bookings", (request, response) => {
  const {
    title,
    firstName,
    surname,
    email,
    checkInDate,
    roomId,
    checkOutDate,
  } = request.body;
  if (
    !title ||
    !firstName ||
    !surname ||
    !checkInDate ||
    !checkOutDate ||
    !roomId
  ) {
    return response.status(400).send({
      msg: "Please check all informations of customer ",
    });
  }
  if (!validator.validate(email)) {
    return response.status(400).send({
      msg: `Please check email, your email is not valid, ${email} `,
    });
  }
  if (new Date(checkInDate) > new Date(checkOutDate)) {
    return response.status(400).send({
      msg: `checkoutDate ${checkOutDate} must be after checkinDate ${checkInDate} `,
    });
  }

  const newCustomer = {
    id: bookings[bookings.length - 1].id + 1,
    ...request.body,
  };
  bookings.push(newCustomer);
  response.send(newCustomer);
});
// Delete a booking, specified by an ID
app.delete("/bookings/:customerId", (request, response) => {
  const customerId = +request.params.customerId;
  const customerIndex = bookings.findIndex(
    (booking) => booking.id === customerId
  );
  if (customerIndex === -1) {
    return response.status(404).send({
      msg: `Customer  doesn't exist with id: ${customerId}`,
    });
  } else {
    bookings.splice(customerIndex, 1);
    response.sendStatus(204);
  }
});
const listener = app.listen(PORT, () => {
  console.log(
    "Your app is listening on port " +
      listener.address().port
  );
});
