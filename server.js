const express=require('express')
const bodyParser=require('body-parser')

const app=express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
const booking=require('./data/fakeBookings.json')

app.get('/booking',(req,res)=>{
    res.json(booking)
})
app.get('/booking/:id',(req,res)=>{
    const inputID=+req.params.id
    const searchedItembyID=booking.filter(item=>item.id===inputID)
    res.send(searchedItembyID)
})
app.delete('/booking/:id',(req,res)=>{
    const deletedId=+req.params.id
    const notDeleteditem=booking.filter(item=>item.id!==deletedId)
    if(notDeleteditem){res.send(notDeleteditem)}
    else{res.status(200).send('It is not exist')}
})
app.post("/booking",(req,res)=>{
    const newId=booking[booking.length-1].id+1
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
    res.json({booking})
  })


app.listen(4500,(req,res)=>{
    console.log('The Server is listening 4500')
})
