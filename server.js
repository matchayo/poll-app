const express = require("express");
let path = require("path");
const teamsObj = require("./data.js");

const app = express();

const server = require("http").Server(app);

const io = require("socket.io")(server);

server.listen(8080);

app.use("/", express.static(path.join(__dirname, "dist/PollApp")));

// Listens to all conenctions from all clients
io.on("connection", (socket) => {
    socket.emit("getTeamsObj", teamsObj);

    socket.on("newPurchase", (purchasedObj) => {
        console.log(purchasedObj);
        teamsObj.teams[purchasedObj.value].count += purchasedObj.quantity;
        teamsObj.total += purchasedObj.quantity;
        io.emit("getTeamsObj", teamsObj);
    });
});