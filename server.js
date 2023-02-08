const express = require("express");
const { Pool } = require("pg");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

let port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/hotels", (req, res) => {
  return pool
    .query("SELECT * FROM hotels")
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

app.get("/customers", (req, res) => {
  return pool
    .query("SELECT * FROM customers ORDER BY name")
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

app.get("/hotels/:hotelId", (req, res) => {
  const hotelId = req.params.hotelId;

  return pool
    .query("SELECT * FROM hotels WHERE id=$1", [hotelId])
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

app.get("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  return pool
    .query("SELECT * FROM customers WHERE id=$1", [customerId])
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

app.get("/customers/:customerId/bookings", (req, res) => {
  const customerId = req.params.customerId;

  return pool
    .query(
      "select bookings.checkin_date, bookings.nights, hotels.name, hotels.postcode From bookings inner join customers on bookings.customer_id = customers.id inner join hotels on bookings.hotel_id = hotels.id where customers.id = $1",
      [customerId]
    )
    .then((result) => res.send(result.rows))
    .catch((err) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

app.post("/hotels", (req, res) => {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send("The number of rooms should be a positive integer.");
  }
  const query = "INSERT INTO hotels (name, rooms, postcode) VALUES($1, $2, $3)";

  pool
    .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
    .then(() => res.send("Hotel Created!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.post("/customers", (req, res) => {
  const newHotelName = req.body.name;
  const newHotelEmail = req.body.email;
  const newHotelAddress = req.body.address;
  const newHotelCity = req.body.city;
  const newHotelPostcode = req.body.postcode;
  const newHotelCountry = req.body.country;

  const query =
    "INSERT INTO customers (name, email, address, city, postcode, country) VALUES($1, $2, $3, $4, $5, $6)";

  pool
    .query(query, [
      newHotelName,
      newHotelEmail,
      newHotelAddress,
      newHotelCity,
      newHotelPostcode,
      newHotelCountry,
    ])
    .then(() => res.send("New Customer Created!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.put("/customers/:customerId", (req, res) => {
  console.log(req.body.city);
  const customerId = req.params.customerId;
  const { email, address, city, postcode, country } = req.body;
  const customerDetails = {};

  if (email) customerDetails.email = email;
  if (address) customerDetails.address = address;
  if (city) customerDetails.city = city;
  if (postcode) customerDetails.postcode = postcode;
  if (country) customerDetails.country = country;

  const { query, variables } = Object.entries(customerDetails).reduce(
    (acc, [key, value], index) => {
      if (index === Object.keys(customerDetails).length - 1) {
        acc.query += ` ${key} = $${index + 2}`;
      } else {
        acc.query += ` ${key} = $${index + 2},`;
      }
      acc.variables.push(value);
      return acc;
    },
    { query: "UPDATE customers SET", variables: [] }
  );

  pool
    .query(`${query}  WHERE id=$1`, [customerId, ...variables])
    .then(() => res.send(`Customer ${customerId} updated!`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.delete("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  pool
    .query("DELETE * FROM customers WHERE customer.id = 1", [customerId])
    .then(() => res.send(`customer ${customerId} deleted`))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

app.listen(port, function () {
  console.log("server is listening on port 3000. ready to accept requests!");
});