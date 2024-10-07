import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */
    cors: {
        // origin: "http://localhost:3000",
        origin: "*",
    },
});

app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
    console.log("Cron job hit");
});

io.on("connection", async (socket) => {
    // ...
    console.log(`${socket.id} connected`);
    socket.emit("message", "from server");

    socket.on("addRoom", (room_name, name) => {
        socket.join(`${room_name}`);
        console.log(`${name} added to room ${room_name}`);
        socket.to(room_name).emit("newChannel", socket.id);
    });

    socket.on("recieved", (data) => {
        socket.to(data.sender).emit("sender_joined", data.name);
    });

    socket.on("offer", (sendOffer, reciever, sender) => {
        socket.to(reciever).emit("offer", sendOffer.offer, sender, reciever);
    });

    socket.on("answer", (sendAnswer, reciever, sender) => {
        socket.to(reciever).emit("answer", sendAnswer.answer, sender, reciever);
    });

    socket.on("ice", (sendIce, reciever, sender) => {
        socket.to(reciever).emit("ice", sendIce.ice, sender, reciever);
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} closed`);
        io.emit("disconnected_user", socket.id);
    });
});

httpServer.listen(process.env.PORT || 5000);
