const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.json());

// SQLite setup
const db = new sqlite3.Database('./chat.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

// Create messages table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL
)`);

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // Load all messages from DB
    db.all('SELECT name, description FROM messages ORDER BY id ASC', [], (err, rows) => {
        if (!err) socket.emit('allMessages', rows);
    });

    socket.on('newMessage', (msg) => {
        if (msg.name && msg.description &&
            msg.name.length <= 5 &&
            msg.description.length <= 20) {
            
            // Insert into DB
            db.run(`INSERT INTO messages(name, description) VALUES(?, ?)`, [msg.name, msg.description], function(err){
                if (!err) {
                    // Send updated messages to everyone
                    db.all('SELECT name, description FROM messages ORDER BY id ASC', [], (err, rows) => {
                        if (!err) io.emit('allMessages', rows);
                    });
                }
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
