const express=require('express')
const bodyParser=require('body-parser')
const moment=require('moment')
const validator = require("email-validator");

const app=express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
const booking=require('./bookings.json')

app.get('/booking',(req,res)=>{
    res.json(booking)
})
app.get('/bookings/search',(req,res)=>{
  const searchitem=req.query.date
  let checkDiff = (InDate, OutDate) => {
    const checkInDate = moment(InDate, "YYYY-MM-DD");
    const checkOutDate = moment(OutDate, "YYYY-MM-DD");
    const diff = checkOutDate.diff(checkInDate, "days");
    return diff;
  };
  
  const filterbooking=booking.filter(item=>checkDiff(item.checkInDate,searchitem)>=0 
  && checkDiff(item.checkOutDate,searchitem)<=0 )
  console.log(filterbooking);

if(filterbooking.length!==0)
{res.status(200).send(filterbooking)}
else{res.status(400).send('no one found')}

})



app.get('/booking/:id',(req,res)=>{
    const inputID=+req.params.id
    const searchedItembyID=booking.filter(item=>item.id===inputID)
    res.send(searchedItembyID)
})
app.delete('/booking/:id',(req,res)=>{
    const deletedId=+req.params.id
    const notDeleteditem=booking.filter(item=>item.id!==deletedId)
    if(deletedId>booking.length) return res.status(404).send('It is not exist')
    res.send(notDeleteditem)
})
app.post("/booking",(req,res)=>{
    const newId=booking[booking.length-1].id+1
    const {title, firstName,surname,email,roomId,checkInDate,checkOutDate}=req.body
    const obj={
      id:newId,
      ...req.body
    }
    
    if( !title || !firstName || !surname || !email || !roomId || !checkInDate || !checkOutDate){
    res.status(400).send("missing value");
    }
    if(!validator.validate(email)){
      return res.status(400).send(`Please check your email,${email } is not valid. `)
    } 
    else{
      booking.push(obj)
    res.status(201).json(booking)}
  })
  app.get("/",(req,res)=>{
    res.json({booking})
  })







app.listen(4500,(req,res)=>{
    console.log('The Server is listening 4500')
})
