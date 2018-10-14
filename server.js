var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var http = require("http").createServer(app)
var io = require("socket.io")(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var messages = [
    {name: "john", message: "hi!"},
    {name: "jame", message: "how are you?!"}
]

app.get("/messages", (req, res) => {
    res.send(messages)
})

app.post("/messages", (req, res) => {
    messages.push(req.body)
    io.emit("message: ", req.body)
    res.sendStatus(200)
})

io.on("connection", function(socket){
    console.log("user connected")
    socket.emit('request', /* */); // emit an event to the socket
    io.emit('broadcast', /* */); // emit an event to all connected sockets
    socket.on('reply', function(){ /* */ }); // listen to the event
});

var server = http.listen(3010, () => {
    console.log("server is listening on port: ", server.address().port)
})
