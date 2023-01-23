const express = require("express");
const cors = require("cors");
const bodyParser=require("body-parser")
const moment=require("moment")
const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});
app.get("/bookings",(req,res)=>{
  res.json({bookings})
})
app.get('/bookings/search',(req,res)=>{
  const searchitem=req.query.date
  let checkDiff = (InDate, OutDate) => {
    const checkInDate = moment(InDate, "YYYY-MM-DD");
    const checkOutDate = moment(OutDate, "YYYY-MM-DD");
    const diff = checkOutDate.diff(checkInDate, "days");
    return diff;
  };
  const filterbooking=bookings.filter(item=>checkDiff(item.checkInDate,searchitem)>=0
  && checkDiff(item.checkOutDate,searchitem)<=0 )
  console.log(filterbooking);
if(filterbooking.length!==0)
{res.status(200).send(filterbooking)}
else{res.status(400).send('no one found')}
})

app.post("/bookings",(req,res)=>{
  const newId=bookings[bookings.length-1].id+1
  const {title, firstName,surname,email,roomId,checkInDate,checkOutDate}=req.body
  const obj={
    id:newId,
    ...req.body
  }
  // bookings.push(obj)
  if( !title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate){
  res.status(400).send("PLEASE FILL THE FORM COMPLETELY");
  }else{
  res.status(201).json({bookings})}
})

app.get("/bookings/:id",(req,res)=>{
  const id=req.params.id * 1;
  const findItem=bookings.find(item=>item.id===id)
 if (findItem){
  res.status(200).send(findItem)
 }else{
  res.status(404).send("Could not find this ${id}")
 }
})
app.delete("bookings/:id",(req,res)=>{
  const id=req.params.id * 1;
  const deleteId=bookings.filter((item=>item.id !== id))
  if (id<0){
    res.status(404).send("Could not find this id")
   }else{
    res.status(200).send(deleteId)
   }
})




// TODO add your routes and helper functions here

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
