const express = require("express");
const bodyParser = require('body-parser')
const socket = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
    // res.redirect(`/${uuidv4()}`)
});

app.post("/authorization", (req, res) => {

    console.log(req);
    res.send('POST request to the homepage')


}) 

app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});

const server = app.listen(port, () => {
    console.log("listening...");
});


const io = socket(server, {
    perMessageDeflate :false
});

io.on("connection", socket => {
    /* console.log(`connected ${socket.id}`); */

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
    });

    socket.on("sound-effect", roomId => {
        io.sockets.to(roomId).emit("sound-effect")
    });
});