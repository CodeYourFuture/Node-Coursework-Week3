const router = require("express").Router();
const { request, response } = require("express");

router.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

module.exports = router;
