import { Server } from "socket.io";

const io = new Server(5000, {
    /* options */

    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    // ...
    console.log("a user connected");
    io.emit("message", "hello world");
    socket.on("addRoom", (socket) => {
        console.log(socket);
    });
});
