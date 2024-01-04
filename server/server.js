import { Server } from "socket.io";

const io = new Server(5000, {
    /* options */

    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", async (socket) => {
    // ...
    console.log(`${socket.id} connected`);
    socket.emit("message", "from server");

    socket.on("fetchlength", async (roomid) => {
        let len = await socket.in(roomid).fetchSockets();
        socket.emit("length", len.length);
        console.log(len.length);
    });

    socket.on("addRoom", (room_name, name) => {
        socket.join(`${room_name}`);
        console.log(`${name} added to room ${room_name}`);
        // socket.broadcast.in(`${room_name}`).emit("jioned", name);
    });

    socket.on("offer", (sendOffer) => {
        socket.broadcast.to(sendOffer.room).emit("offer", sendOffer.offer);
    });

    socket.on("answer", (sendAnswer) => {
        socket.broadcast.to(sendAnswer.room).emit("answer", sendAnswer.answer);
    });

    socket.on("ice", (sendIce) => {
        socket.broadcast.to(sendIce.room).emit("ice", sendIce.ice);
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} closed`);
    });
});
