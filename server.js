const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

// Store messages per chat room
const messagesByRoom = { chat1: [], chat2: [], chat3: [], chat4: [], chat5: [] };

io.on("connection", (socket) => {

    // Join a chat room
    socket.on("joinRoom", (room) => {
        socket.join(room);
        // Send all previous messages in this room to this client only
        if(messagesByRoom[room]) {
            socket.emit("allMessages", messagesByRoom[room]);
        }
    });

    // New message from a client
    socket.on("newMessage", ({ name, room }) => {
        if(!messagesByRoom[room]) messagesByRoom[room] = [];
        const msg = { name, room };
        messagesByRoom[room].push(msg);

        // Emit only the new message to all clients in the room
        io.to(room).emit("newMessage", msg);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
