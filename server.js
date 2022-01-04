const express = require("express");
const cors = require("cors");
const cl = console.log;
const app = express();

app.use(express.json());
app.use(cors());

//Use this array as your (in-memory) data store.
const bookings = require("./bookings.json");

app.get("/", function (request, response) {
  response.send("Hotel booking server.  Ask for /bookings, etc.");
});

app.get("/bookings", function (request, response) {
  if (bookings.length < 1){
    res.status(400);
    res.send('None shall pass');
  } else {
    response.send(bookings);
  }
});


app.get("/bookings/:id", function(request, response){
  console.log("/messages/:id run");
  console.log(request.params.id);
  console.log(request.query.term);

  
  // Functionality for search by ID : 
  //http://localhost:6000/1

  if ((bookings[request.params.id] != undefined) && (request.query.term != "search")){
    response.json(bookings[request.params.id -1]); 
  } 
  
  // Functionality for a search function : 
  //http://localhost:6000/bookings/search?term=hello
  
  else if (request.query.term != undefined) {
    // response.json(request.query.term)
    const searchTerm = request.query.term.toLowerCase();
    const returnedList = bookings.filter((element,index) =>{
      //  console.log(element);
      // console.log(element.text.includes(searchTerm));
      const lowerElement = element.title.toLowerCase();

      // cl(Object.values(element))
      let valuesArray = Object.values(element);

      let lowerArray = valuesArray.map(elem => {
        if (typeof elem === "string"){
          return elem.toLowerCase();
        } else {
          return elem;
        }
        
      })

      let finalArray = lowerArray.map(e => {
        cl(e)
        if (typeof e === "string"){
          if (e.includes(searchTerm)){
            return true
          } else {
            return false
          }
        } 
      })
      return finalArray.includes(true);
      
    });
    response.json(returnedList); 
  }
});

app.delete("/bookings/:id", function(request, response){
  console.log("DELETE run")
  console.log(request.params.id) // 1 

  let indexToRemove;

  for (let index = 0; index < bookings.length; index++) {
    const element = bookings[index];
    if (element.id == request.params.id){
      console.log(element);
      indexToRemove = index;
    }
  }
  console.log(indexToRemove);
  
  if (indexToRemove > -1) {
    bookings.splice(indexToRemove, 1);
  }
  response.json(bookings); 
});


app.post("/bookings", /*urlencodedParser,*/  function(req, res){
  console.log("LOOK BELOW !!!!!!!!!!!")
  console.log(req.body.from);
  console.log(req.body.text)
  
  if ((req.body.from.length > 0)&&(req.body.text.length > 0)){
    const newBooking = {
      "id":bookings.length,
      "from": req.body.from,
      "text":req.body.text,
      "timeSent" : new Date()
    }
    bookings.push(newBooking); 
    console.log(messages);
  } else {
    return res.status(400).send({
      message: 'Error - The Name or Message fields are empty!' 
    });
  } 

});


// TODO add your routes and helper functions here

//process.env.PORT

const listener = app.listen(6000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
