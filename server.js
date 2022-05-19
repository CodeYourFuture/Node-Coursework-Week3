const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const { request } = require("express");
const { response } = require("express");
const PORT = process.env.PORT || 3000;


app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

//get a user data by userId
app.get('/bookings/:id', (request, response) => {
  const { id } = request.params;
  const filteredData = bookings.find(
      user => user.id == id
    );
  if (!filteredData) {
    return response.status(404).json('sorry!that id does not exists')
  }
  response.send(filteredData)
  
});

//delete a user data by id
app.delete('/bookings/:id', (request, response) => {
  const { id } = request.params;
  const userIdFound = bookings.find(
      user => user.id == id
    );
  if (!userIdFound) {
    return response.status(404).json('sorry!that id does not exists')
  } else {
      const filteredData = bookings.filter(
        user => user.id !== id
      );
    response.send(filteredData)
  }
 
});

app.get("/bookings", function (request, response) {
  response.json(bookings);
});

app.post("/bookings", function (request, response) {
 
  const { title, firstName, surname, email, roomId, checkInDate, checkOutDate } = request.body;
  
  if(!title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate) {
    const emptyFieldErrorMsg = {
      msg: 'Please fill in all the field and try again'
    };
    return response.status(400).json(emptyFieldErrorMsg)
  }
  bookings.push({
    id:bookings.length,
    title: title,
    firstName:firstName,
    surname:surname,
    email:email,
    roomId:roomId,
    checkInDate:checkInDate,
    checkOutDate:checkOutDate
  })
  console.log(bookings)
  response.send(bookings);
});

// TODO add your routes and helper functions here

const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
