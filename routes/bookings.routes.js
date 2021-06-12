const express = require("express");
const router = express.Router();
const bookingsController = require("../controllers/bookings");

//Read all bookings
router.get("/", bookingsController.fetchAll);

// Read bookings, specified by an date
router.get("/search", bookingsController.fetchBySearch);

// Read bookings by search in name and email
// router.get("/search", bookingsController.searchByWord);

// Read one booking, specified by an ID
router.get("/:id", bookingsController.fetchById);

//Delete a booking, specified by an ID
router.delete("/:id", bookingsController.delete);

//Create a new booking
router.post("/", bookingsController.create);

module.exports = router;
