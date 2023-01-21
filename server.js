const express = require("express");
const app =expressO();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request, response } = require("express");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings" , (request,response) => {
  response.json({ bookings });
});

app.get("/bookings/:id" , (request ,response) =>{
  const id = Number(request.params.id);
  const findId = bookings.find((bookings) => bookings.id ===id);
  if (!findId) {
    return response
    .status(404)
      .json({ message: `booking with the ${id} not found`});
  }
  response.status(200).json({ findId})
});
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
