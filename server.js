const express = require("express");
const cors = require("cors");
const bodyParser=require("body-parser")
const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

// app.get("/", function (request, response) {
//   response.send("Hotel booking server.  Ask for /bookings, etc.");
// });
app.post("/",(req,res)=>{
  const newId=bookings[bookings.length-1].id+1
  const {title, firstName,surname,email,roomId,checkInDate,checkOutDate}=req.body
  const obj={
    id:newId,
    ...req.body
  }
  console.log(obj);
  if( !title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate){
  res.status(400).send("missing value");
  }else{
  res.status(201).json({obj})}
})
app.get("/",(req,res)=>{
  res.json({bookings})
})
app.get("/:id",(req,res)=>{
  const id=req.params.id * 1;
  const findItem=bookings.find(item=>item.id===id)
 if (findItem){
  res.status(200).send(findItem)
 }else{
  res.status(404).send("Could not find this id")
 }
})
app.delete("/:id",(req,res)=>{
  const id=req.params.id * 1;
  const deleteId=bookings.filter((item=>item.id !== id))
  if (deleteId){
    res.status(200).send(deleteId)
   }else{
    res.status(404).send("Could not find this id")
   }
})


// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
