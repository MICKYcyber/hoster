const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // allow cross-origin (front-end can be anywhere)
});

const PORT = process.env.PORT || 3000;

// Store messages per chat room
const messagesByRoom = { chat1: [], chat2: [], chat3: [], chat4: [], chat5: [] };

io.on("connection", (socket) => {

    // Join a chat room
    socket.on("joinRoom", (room) => {
        socket.join(room);
        // Send existing messages in that room
        if(messagesByRoom[room]) {
            socket.emit("allMessages", messagesByRoom[room]);
        }
    });

    // New message from a client
    socket.on("newMessage", ({ name, room }) => {
        if(!messagesByRoom[room]) messagesByRoom[room] = [];
        const msg = { name, room };
        messagesByRoom[room].push(msg);

        // Broadcast the updated messages to all clients in the same room
        io.to(room).emit("allMessages", messagesByRoom[room]);
    });

    // Disconnect handler (optional)
    socket.on("disconnect", () => {
        // Can handle cleanup if needed
    });
});

// Serve static files if needed
// app.use(express.static("public")); // optional, if you host index.html locally

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
