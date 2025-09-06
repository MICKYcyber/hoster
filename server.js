<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Minecraft Hosting</title>
<script src="https://opencraft-erc5.onrender.com/socket.io/socket.io.js"></script>
<style>
    body {
        font-family: Arial;
        background: #f0f0f0;
        margin: 0;
        padding: 20px;
        display: flex;
        justify-content: center;
    }

    .chat-container {
        width: 100%;
        max-width: 600px;
    }

    .tabs {
        display: flex;
        margin-bottom: 10px;
        gap: 5px;
    }

    .tab {
        padding: 10px 20px;
        background: #00796b;
        color: white;
        cursor: pointer;
        border-radius: 5px 5px 0 0;
    }

    .tab.active {
        background: #004d40;
        font-weight: bold;
    }

    .chat, .server {
        border: 1px solid #333;
        border-radius: 8px;
        padding: 10px;
        background: white;
        display: none;
        flex-direction: column;
        gap: 10px;
        height: 400px;
        overflow-y: auto;
    }

    .chat.active, .server.active {
        display: flex;
    }

    .message-card {
        background: #e0f7fa;
        border-radius: 5px;
        padding: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    input, button {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        font-size: 1rem;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    button {
        background: #00796b;
        color: white;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background: #004d40;
    }
</style>
</head>
<body>
<div class="chat-container">
    <div class="tabs">
        <div class="tab active" data-tab="chat1">Chat Room 1</div>
        <div class="tab" data-tab="chat2">Chat Room 2</div>
        <div class="tab" data-tab="chat3">Chat Room 3</div>
        <div class="tab" data-tab="chat4">Chat Room 4</div>
        <div class="tab" data-tab="chat5">Chat Room 5</div>
        <div class="tab" data-tab="server">Minecraft Server Hosting</div>
    </div>

    <!-- Chat Rooms -->
    <div id="chat1" class="chat active"></div>
    <div id="chat2" class="chat"></div>
    <div id="chat3" class="chat"></div>
    <div id="chat4" class="chat"></div>
    <div id="chat5" class="chat"></div>

    <!-- Minecraft Server Hosting -->
    <div id="server" class="server">
        <input type="text" id="joinCode" placeholder="Join Code" maxlength="5">
    </div>

    <!-- Input for chat -->
    <input type="text" id="messageInput" placeholder="Type a message (50 chars max)" maxlength="50">
    <button onclick="sendMessage()">Send</button>
</div>

<script>
    const socket = io("https://opencraft-erc5.onrender.com");
    const tabs = document.querySelectorAll('.tab');
    const chats = document.querySelectorAll('.chat, .server');
    let activeTab = 'chat1';
    const chatInput = document.getElementById('messageInput');

    // Switch tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            chats.forEach(c => c.classList.remove('active'));
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            activeTab = tabId;

            // Adjust input for server tab
            if(activeTab === 'server') {
                chatInput.style.display = 'none';
            } else {
                chatInput.style.display = 'block';
            }
        });
    });

    // Listen for messages
    socket.on('allMessages', (messages) => {
        if(activeTab.startsWith('chat')) {
            const chatDiv = document.getElementById(activeTab);
            chatDiv.innerHTML = '';
            messages.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'message-card';
                div.textContent = msg.name;
                chatDiv.appendChild(div);
            });
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    });

    function sendMessage() {
        if(activeTab === 'server') return; // Don't send messages in server tab

        const name = chatInput.value.trim();
        if(!name) return;
        socket.emit('newMessage', { name, room: activeTab });
        chatInput.value = '';
    }
</script>
</body>
</html>
