const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send(
    "Hotel booking server.  Ask for /bookings, etc."
  );
});

//return all bookings
app.get("/bookings", (request, response) => {
  response.send(bookings);
});
//get one booking by id
app.get("/bookings/:id", (request, response) => {
  const customerId = +request.params.id;
  const customerWithId = bookings.find(
    (booking) => booking.id === customerId
  );
  customerWithId
    ? response.send(customerWithId)
    : response.status(404).send({
        msg: `Custumer doesn't exist with id: ${customerId} `,
      });
});

const listener = app.listen(PORT, () => {
  console.log(
    "Your app is listening on port " +
      listener.address().port
  );
});
