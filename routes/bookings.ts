import express from "express";
import {
  getBooking,
  getAllBookings,
  createBooking,
  searchBookings,
  updateBooking,
  deleteBooking,
} from "../contollers/bookings";

const router = express.Router();

router.route("/").get(getAllBookings).post(createBooking);

router.route("/search").get(searchBookings);
router
  .route("/:bookingsId")
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;
