const lodash = require("lodash");
const date = require("date-and-time");
const bookings = require("../../data/bookings.json");
const { request, response } = require("express");
const { result } = require("lodash");
const Moment = require("moment");
const MomentRange = require("moment-range");
const isemail = require("email-format-check");
const { checkout } = require("../../routes");

const moment = MomentRange.extendMoment(Moment);

const controller = {
  create: (request, response) => {
    const newBooking = {
      id: lodash.uniqueId("1"),
      title: request.body.title.trim(),
      firstName: request.body.firstName.trim(),
      surname: request.body.surname.trim(),
      email: request.body.email.trim(),
      roomId: request.body.roomId,
      checkInDate: request.body.checkInDate.trim(),
      checkOutDate: request.body.checkOutDate.trim(),
    };
    var isNotEmpty = true;
    for (var key in newBooking) {
      if (newBooking[key] === null || newBooking[key] === "")
        isNotEmpty = false;
    }
    const emailFormat = isemail(newBooking.email);
    const inDateBeforeOut = moment(newBooking.checkInDate).isBefore(
      newBooking.checkOutDate
    );
    console.log(inDateBeforeOut);
    const statusIn = date.isValid(newBooking.checkInDate.trim(), "YYYY-MM-DD");
    const statusOut = date.isValid(
      newBooking.checkOutDate.trim(),
      "YYYY-MM-DD"
    );

    if (isNotEmpty && statusOut && statusIn && emailFormat && inDateBeforeOut) {
      bookings.push(newBooking);
      response.status(201).json(bookings);
      response.end;
    } else response.status(400).json("Data is not Valid");
  },
  fetchAll: (request, response) => {
    response.status(200).json(bookings);
  },
  delete: (request, response) => {
    const bookingId = request.params.id;
    const index = bookings.findIndex((booking) => booking.id == bookingId);
    if (index > -1) {
      bookings.splice(index, 1);
      response.status(200).json(bookings);
      response.end();
    } else response.status(404).send("The booking was not found");
  },
  fetchBySearch: (request, response) => {
    const { date, term } = request.query;
    if (date) {
      const format = "YYYY-MM-DD";
      const statusDate = moment(date, format).isValid();
      if (statusDate) {
        const result = bookings.filter((booking) => {
          const startDate = moment(booking.checkInDate, format);
          const endDate = moment(booking.checkOutDate, format);
          return moment(date).isBetween(startDate, endDate);
        });
        response.status(200).json(result);
      }
    } else if (term) {
      const result = bookings.filter(
        (booking) =>
          booking.firstName.toUpperCase().includes(term.toUpperCase()) ||
          booking.surname.toUpperCase().includes(term.toUpperCase()) ||
          booking.email.toUpperCase().includes(term.toUpperCase())
      );
      response.status(200).json(result);
    }
  },
  fetchById: (request, response) => {
    console.log(request.params.id);
    const specifiedBooking = bookings.filter(
      (booking) => booking.id == request.params.id
    );
    if (specifiedBooking.length != 0)
      response.status(200).json(specifiedBooking);
    else response.status(404).json("The booking was not found");
  },
};

module.exports = controller;
