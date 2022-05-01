const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");
const bookingsDefault = require("./bookings-copy.json")
const { response } = require("express");
const { del } = require("express/lib/application");

app.get("/", function (request, response) {
  response.send(
    "Hotel booking server.  Ask for /bookings, etc.<br>/bookings/:id <br> /bookings/delete/:id <br>  /newbooking/:id/:roomId/:title/:firstName/:surName/:email/:checkInDate/:checkOutDate <br>  <br> "
  );
});
app.get("/bookings", (req, res) => {
  res.send(bookings);
});
app.get("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);
  res.send(bookings.find((book) => book.id === id));
});
app.get("/bookings/delete/:id", (req, res) => {
  const delId = Number(req.params.id);
  const index = bookings.findIndex((object) => {
    return object.id === delId;
  });
  bookings.splice(index, 1);
  const json = JSON.stringify(bookings, null, 2);
  // 3
  fs.writeFile("./bookings.json", json, "utf-8", (error) => {
    // 4
    if (error) {
      console.log(`WRITE ERROR: ${error}`);
    } else {
      // 5
      console.log("FILE WRITTEN TO");
    }
  });

  res.send(bookings);
});
app.get("/bookings/default", (req, res) => {
  
  
  const json = JSON.stringify(bookingsDefault, null, 2);
  // 3
  fs.writeFile("./bookings.json", "./bookings-copy.json", "utf-8", (error) => {
    // 4
    if (error) {
      console.log(`WRITE ERROR: ${error}`);
    } else {
      // 5
      console.log("FILE WRITTEN TO");
    }
  });

  res.send(bookings);
});
app.get(
  "/newbooking/:id/:roomId/:title/:firstName/:surName/:email/:checkInDate/:checkOutDate",
  (req, res) => {
    const newBook = req.params;
    newBook.id = Number(newBook.id);
    // bookings = bookings.concat(newBook);
    const json = JSON.stringify(bookings.concat(newBook), null, 2);

    res.send(json);

    // 2
    const asyncFrameworksData = JSON.stringify(newBook, null, 2);
    // 3
    fs.writeFile("./bookings.json", json, "utf-8", (error) => {
      // 4
      if (error) {
        console.log(`WRITE ERROR: ${error}`);
      } else {
        // 5
        console.log("FILE WRITTEN TO");
      }
    });
  }
);
// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
