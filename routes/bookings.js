const express = require("express");
const router = express.Router();
//Use this array as your (in-memory) data store.
const bookingsData = require("../bookings.json");

router.get("/", function (request, response) {
  response.json(bookingsData);
});

router.get("/:id", function (request, response) {
  let id = parseInt(request.params.id);
  let filteredMessage = bookingsData.find((el) => el.id === id);
  if (!filteredMessage) {
    res.status(400).send("User not found for given id");
  }
  response.json(filteredMessage);
});

router.post("/", function (request, response) {
  let newMessage = {
    id: bookingsData[bookingsData.length - 1].id + 1,
    title: request.body.title,
    firstName: request.body.firstName,
    surname: request.body.surname,
    email: request.body.email,
    roomId: request.body.roomId,
    checkInDate: request.body.checkInDate,
    checkOutDate: request.body.checkOutDate,
  };

  if (!newMessage.firstName || !newMessage.surname || !newMessage.email) {
    response.status(400).send("Please enter name and email");
  }
  bookingsData.push(newMessage);
  response.json(bookingsData);
});

router.delete("/:id", function (request, response) {
  let id = parseInt(request.params.id);
  let deletedMessage = bookingsData.find((el) => el.id === id);
  if (deletedMessage) {
    bookingsData = bookingsData.filter(
      (message) => message.id !== parseInt(req.params.id)
    );

    response.json({
      msg: "User deleted",

      bookingsData,
    });
  } else {
    response.status(400).send("Bookings not existing given id");
  }
});

router.put("/:id", function (request, response) {
  let paramsId = parseInt(request.params.id);
  let foundBooking = bookingsData.find((data) => data.id === paramsId);

  if (foundBooking) {
    bookingsData.forEach((booking) => {
      if (message.id === paramsId) {
        booking.firstName = request.body.firstName
          ? updateMessage.firstName
          : booking.firstName;
        booking.surname = request.body.surname
          ? updateMessage.surname
          : booking.surname;
        booking.email = request.body.email
          ? updateMessage.email
          : booking.email;

        response.json({ msg: "user updated", message });
      }
    });
  } else {
    response.sendStatus(400);
  }
});

module.exports = router;
