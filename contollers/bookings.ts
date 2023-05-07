import { Request, Response } from "express";
import { bookingType, KeyType } from "../utils/types";
import emailValidator from "email-validator";
import moment from "moment";

//Use this array as your (in-memory) data store.
let bookings: bookingType[] = require("../bookings.json");

const validateBook = (booking: bookingType) => {
  if (
    !booking.title ||
    !booking.firstName ||
    !booking.surname ||
    !booking.email ||
    !emailValidator.validate(booking.email) ||
    !booking.roomId ||
    !booking.checkInDate ||
    !booking.checkOutDate ||
    !moment(booking.checkOutDate).isAfter(booking.checkInDate)
  ) {
    return false;
  }
  return true;
};
export const getAllBookings = (req: Request, res: Response) => {
  res.send(bookings);
};

export const getBooking = (req: Request, res: Response) => {
  const haveBooking = bookings.find(
    ({ id }) => id === Number(req.params.bookingsId)
  );
  if (!haveBooking) {
    return res.status(404).json(`no booking with id ${req.params.bookingsId}`);
  }
  return res.send(haveBooking);
};
export const searchBookings = (req: Request, res: Response) => {
  if (!req.query.term && !req.query.date) return;

  if (req.query.term) {
    const keys: KeyType[] = ["firstName", "surname", "email"];
    const filtered = bookings.filter((booking) =>
      keys.some((key) =>
        booking[key]
          .toLowerCase()
          .includes(req.query.term!.toString().toLowerCase())
      )
    );
    return res.send(filtered);
  }
  if (moment(req.query.date as string, "YYYY-MM-DD").isValid()) {
    const filtered = bookings.filter(
      ({ checkInDate, checkOutDate }) =>
        checkInDate <= (req.query.date as string) &&
        checkOutDate >= (req.query.date as string)
    );
    return res.send(filtered);
  }
};
export const createBooking = (req: Request, res: Response) => {
  const isValid = validateBook(req.body);
  if (!isValid) {
    return res.status(400).json(`Please enter valid data`);
  }
  bookings.push({
    ...req.body,
    id: bookings[bookings.length - 1].id + 1,
  });
  return res.send(bookings);
};
export const updateBooking = (req: Request, res: Response) => {
  const index = bookings.findIndex(
    ({ id }) => id === Number(req.params.bookingsId)
  );
  const isValid = validateBook(req.body);
  if (!isValid) {
    return res.status(400).json(`Please enter valid data`);
  }
  if (index === -1) {
    return res.status(404).json(`no booking with id ${req.params.bookingsId}`);
  }
  bookings[index] = { ...bookings[index], ...req.body };
  return res.send(bookings);
};

export const deleteBooking = (req: Request, res: Response) => {
  const haveBooking = bookings.find(
    ({ id }) => id === Number(req.params.bookingsId)
  );
  if (!haveBooking) {
    return res.status(404).json(`no booking with id ${req.params.bookingsId}`);
  }
  bookings = bookings.filter(({ id }) => id !== Number(req.params.bookingsId));
  return res.send(bookings);
};
