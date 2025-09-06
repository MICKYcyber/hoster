// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow all origins for simplicity
        methods: ["GET", "POST"]
    }
});

// Serve static files (like your HTML)
app.use(express.static(path.join(__dirname, "public")));

// Store messages in memory
let messages = [];

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected");

    // Send all messages to the new client
    socket.emit("allMessages", messages);

    // Receive new messages
    socket.on("newMessage", (msg) => {
        messages.push(msg);
        io.emit("allMessages", messages); // broadcast to all clients
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
