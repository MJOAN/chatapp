var express = require("express")
var bodyParser = require("body-parser")
var app = express()

var http = require("http").createServer(app)
var io = require("socket.io")(http)
var mongoose = require("mongoose")
var port = process.env.PORT || 3000;

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var databaseURL = "mongodb://mjoan:mlab1!@ds131903.mlab.com:31903/heroku_flwg7pn9"

var Message = mongoose.model("Message", {
    name: String,
    message: String
})

app.get("/messages", (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post("/messages", (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if(err) {
            sendStatus(500)
            console.log("error", err)
        } else {
            // messages.push(req.body)
            io.emit("message: ", req.body)
            res.sendStatus(200)
        }
    })

})

io.on("connection", function(socket){
    console.log("user connected")
    // socket.emit('request', /* */); // emit an event to the socket
    // io.emit('broadcast', /* */); // emit an event to all connected sockets
    // socket.on('reply', function(){ /* */ }); // listen to the event
});

mongoose.connect(databaseURL, (err) => {
    console.log("mongodb connection success!")
})


var server = http.listen(port, () => { // or server.address()
    console.log("server is listening on port %d ", port)
})
