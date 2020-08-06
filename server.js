const express = require("express");
const mongodb = require('mongodb');
const cors = require("cors");
const moment = require("moment");
const validator = require("email-validator");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const uri = process.env.DB_URI;

const option = { useUnifiedTopology: true }
const client = new mongodb.MongoClient(uri, option)
client.connect(()=>{
  const db = client.db("hotel-server");
  const collection = db.collection("bookings");

  app.get("/", function (req, res) {
    res.send("Hotel booking server.  Ask for /bookings, etc.");
  });

  // TODO add your routes and helper functions here
app.get("/bookings", (req, res) => {
  collection.find().toArray((err,results)=>{
    if(err){
      res.status(500).send(err)
    }else{
      res.status(200).send(results)
    }
  })
});
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log("Your app is listening on port " + port));
