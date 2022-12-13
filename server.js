const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;

const app = express();

app.use(cors());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

// Create a new message
app.post("/messages", function (req, res) {
  console.log("POST /messages route");
  let newMessage = req.body;
  messages.push(newMessage);
  res.status(200).send(messages);
  console.log(req.body);
});

// Read all messages
app.get("/messages", (req, res) => {
  res.status(200).send(messages);
});

//  Read one message specified by an ID
app.get("/messages/:id", function (req, res) {
  console.log(req.params.id);
  let id = parseInt(req.params.id);
  res.status(200).send(messages.filter((message) => message[id] === id));
  console.log(messages.filter((message) => message[id] === id));
});
//  Delete a message, by ID
app.delete("/messages/:id", function (req, res) {
  console.log("DELETE /messages route");
  res.status(200).send(messages.filter((message) => message[id] === id));
});

app.listen(port, () => {
  console.log(`Sever is listing at port ${port}`)
});


