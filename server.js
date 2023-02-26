// FIRST COMMIT
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);



//Use this array as your (in-memory) data store.
let bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.json(bookings);
});

// EXPERIMENT #1
app.get("/littleboss", function (request, response) {
  response.redirect("/bigboss");
});


// EXPERIMENT #2
app.get("/big", function (request, response) {
  response.sendFile(__dirname + "/bigboss.html");
});

// EXPERIMENT #3
app.get("/boss", function (request, response) {
  response.render(__dirname + '/bigboss.html', {status: 'good'});
});


// GET SPECIFIC
app.get("/:id", function (request, response) {
  response.json(bookings.filter((booking) => booking.id == request.params.id));
});

app.delete("/:id", function (request, response) {
  bookings.map((booking, index) => {
    if (request.params.id == booking.id) {
      bookings.splice(index, 1);
      console.log("Executing");

    } else {
      console.log("Not executing");
    }
  });
  response.json(bookings);
});

app.post("/", function (request, response) {
  const body = request.body;
  if (body['id'] && body['title'] && body['firstName'] && body['surname'] && body['email'] && body['roomId'] && body['checkInDate'] && body['checkOutDate']) {
    bookings.push(body);
    response.json(bookings[bookings.length-1]);
  } else { 
    response.status(400).json("Incorrect details sent! Check your post method");

  }
});




// TODO add your routes and helper functions here

const listener = app.listen(5000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
