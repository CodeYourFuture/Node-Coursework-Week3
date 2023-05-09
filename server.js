const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
const { isAfter } = require("date-fns");
const { v4: uuid } = require("uuid");
app.use(express.json());
app.use(cors());

const data = {
  bookings: require("./bookings.json"),
  setBookings: function (data) {
    this.bookings = data;
  },
};
app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

// TODO add your routes and helper functions here
app.get("/bookings", function (req, res) {
  res.json(data.bookings);
});

app.post("/bookings", function (req, res) {
  const dateOne = new Date(request.body.checkOutDate);
  const dateTwo = new Date(request.body.checkInDate);
  if (!isAfter(dateOne, dateTwo)) {
    return errorResponse("The Check-out date must be after check-in date");
  }
  const assignedObject = {};
  const allowedProperties = [
    "title",
    "firstName",
    "surname",
    "email",
    "roomId",
    "checkInDate",
    "checkOutDate",
  ];

  const requiredProperties = [
    "title",
    "firstName",
    "surname",
    "email",
    "roomId",
    "checkInDate",
    "checkOutDate",
  ];

  const errorResponse = (Booking) => {
    response.status(400).json({ error: Booking });
  };

  const sanitizeString = (value) => {
    return value.trim().replace(/<[^>]*>?/gm, "");
  };

  if (!requiredProperties.every((prop) => request.body[prop])) {
    return errorResponse("All fields are required");
  }

  for (const prop in request.body) {
    if (allowedProperties.includes(prop)) {
      let value = request.body[prop];

      if (typeof value === "string") {
        value = sanitizeString(value);
      }

      if (prop === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return errorResponse("Invalid email address");
        }
      }

      if (["title", "firstName", "surname"].includes(prop)) {
        value = value.replace(/[^\w\s@#$]/gi, "");
      }

      assignedObject[prop] = deepClone(value);
    }
  }

  if (!assignedObject.id) {
    assignedObject.id = uniqueId(allIds);
  }

  return assignedObject;
});

// using Object.prototype.hasOwnProperty.call()
// instead of Object.hasOwn(objectToTest, 'objectProperty')
// because of legacy support for older browsers and
// using the hasOwnProperty of another object will .call()
// solves the problematic cases that hasOwn solves
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const clone = Array.isArray(obj) ? [] : {};

  if (Array.isArray(clone)) {
    for (let [index, val] of obj.entries()) {
      if (Object.prototype.hasOwnProperty.call(obj, index)) {
        clone[index] = deepClone(obj[index]);
      }
    }
  }

  if (!Array.isArray(clone)) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clone[key] = deepClone(obj[key]);
      }
    }
  }

  return clone;
}

function uniqueId(array) {
  let checkedId;
  do {
    checkedId = uuid();
  } while (array.some((obj) => obj.id === checkedId));
  // assign value to the array
  // if and while it already exists
  // re assign value till no match found
  return checkedId;
}
app.get("/bookings/:id", function (req, res) {
  const id = req.params.id;

  const booking = data.bookings.find((booking) => booking.id === parseInt(id));
  if (!booking) {
    return res.status(400).json({ booking: `no booking found` });
  }

  res.status(200).json(booking);
});

app.delete("/bookings/:id", function (req, res) {
  const id = req.params.id;
  const booking = data.bookings.find((msg) => msg.id === parseInt(id));
  if (!booking) {
    return res.status(404).json({ booking: `booking ID ${id} not found` });
  }
  const filteredBookings = data.bookings.filter(
    (booking) => booking.id !== parseInt(req.params.id)
  );
  data.setBookings([...filteredBookings]);
  res.json(data.bookings);
});

/* const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
}); */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
