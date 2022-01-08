const { request, response } = require("express");
const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/bookings",(request,response)=>{
  bookings.length >0 
     ? response.status(200).json(bookings)
     :response.status(404);
})

app.get("/bookings/id/:id",(request,response)=>{
  const booking = bookings.find(
    (booking) => booking.id === parseInt(request.params.id)
  );
  booking === undefined
    ? response.status(404).send("Please specify a bookings")
    : response.status(200).json(booking);
})

app.post('/bookings', (request, response) => {
   let newBooking = request.body;
   if(
     request.body.title === "" ||
     request.body.firstName === "" ||
     request.body.surname === "" ||
     request.body.email === "" ||
     request.body.roomId === "" ||
     request.body.checkInDate === "" ||
     request.body.checkOutDate === "" 
   )
     {response.status(400).send(
       {
        result: "failure",
        message: "Booking could not be saved"
       }
      );
     }
   else
     {
     const newId = 1 + Math.max(...bookings.map((booking) => Number(booking.id)));
     Object.assign(newBooking, { id: newId });  
		 bookings.push(newBooking);
		 response.status(200).send({ id: newBooking.id });
     }
   });


app.delete("/bookings/id/:id",(request,response)=>{
  const booking = bookings.find(
    (booking) => booking.id === parseInt(request.params.id)
    );
  booking === undefined
      ? response.status(404).send("Please specify a bookings")
      : bookings.splice(booking,1)
        return response.send(204); //204=No content
})

const listener = app.listen(process.env.PORT || 4002, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
