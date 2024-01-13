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
    });

    socket.on("recieved", (data) => {
        socket.to(data.sender).emit("sender_joined", data.name);
    });

    socket.on("sender_joined", (name, roomid) => {
        socket.to(roomid).emit("joined", name, socket.id);
    });

    socket.on("offer", (sendOffer) => {
        socket.to(sendOffer.room).emit("offer", sendOffer.offer);
    });

    socket.on("answer", (sendAnswer) => {
        socket.to(sendAnswer.room).emit("answer", sendAnswer.answer);
    });

    socket.on("ice", (sendIce) => {
        socket.to(sendIce.room).emit("ice", sendIce.ice);
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} closed`);
        socket.emit("disconnected_user", socket.id);
    });
});
