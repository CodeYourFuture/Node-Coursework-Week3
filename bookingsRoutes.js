const express = require("express");
const bookings = require("./bookings.json");
const fs = require("fs").promises;

const bookingsRouter = express.Router();


// ----------- Getting All -----------
const getAllBookings = (req, res) => {
  fs.readFile("./bookings.json", "utf8")
    .then(bookings => {
      bookings = JSON.parse(bookings);
      res.status(200).json({ data: bookings });
      return;
    });
};


// ----------- Posting -----------
const postBooking = (req, res) => {
  const { title, firstName, surname, email, checkInDate, checkOutDate } = req.body;
  if (!title.trim() || !firstName.trim() || !surname.trim() || !email.trim() || !checkInDate.trim() || !checkOutDate.trim()) {
    res.status(400).json("Please Fill all the Fields!");
    return;
  }


  else {
    const id = parseInt(bookings[bookings.length - 1].id) + 1;
    const roomId = Math.floor(Math.random() * 10 + 1);
    const newBooking = {
      id, title, firstName, surname, email, roomId, checkInDate, checkOutDate
    };


    bookings.push(newBooking);


    fs.writeFile("./bookings.json", JSON.stringify(bookings, null, 2), (err) => {
      res.status(500).json({ message: "There is some Errors!" });
    });
    res.status(200).json({ data: newBooking });
    return;
  }
}


// ----------- Getting One -----------
const getOneBooking = (req, res) => {

  const { id } = req.params;

  const bookingFiltered = bookings.find(eachBook => eachBook.id === parseInt(id));

  fs.readFile("./bookings.json", "utf8")
    .then(bookings => {
      res.status(200).json({ data: bookingFiltered })
      return;
    });
};


// ----------- Delete -----------
const deleteBooking = (req, res) => {
  const { id } = req.params;


  const bookingIndex = bookings.findIndex(eachBooking => eachBooking.id === parseInt(id));
  bookings.splice(bookingIndex, 1);


  fs.writeFile("./bookings.json", JSON.stringify(bookings, null, 2));
  res.status(200).json({ message: "Booking deleted" });
  return;
};


// ----------- Update -----------
const updateBooking = (req, res) => {
  let { title, firstName, surname, email, checkInDate, checkOutDate } = req.body;
  if (!title.trim() || !firstName.trim() || !surname.trim() || !email.trim() || !checkInDate.trim() || !checkOutDate.trim()) {
    res.status(400).json("Please Fill all the Fields!");
    return;
  }
  else {
    const id = parseInt(req.params.id);
    roomId = Math.floor(Math.random() * 10 + 1);
    const newBooking = { id, title, firstName, surname, email, roomId, checkInDate, checkOutDate };

    const bookingIndex = bookings.findIndex(eachBooking => eachBooking.id === parseInt(id));
    bookings.splice(bookingIndex, 1, newBooking);

    fs.writeFile("./bookings.json", JSON.stringify(bookings, null, 2));
    res.status(200).json({ message: "message updated" });
  }
};


bookingsRouter.route("/")
  .get(getAllBookings)
  .post(postBooking);

bookingsRouter.route("/:id")
  .get(getOneBooking)
  .delete(deleteBooking)
  .put(updateBooking);

module.exports = bookingsRouter;