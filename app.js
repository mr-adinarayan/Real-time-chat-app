const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle connection from clients
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Receive a message and broadcast it to all clients
  socket.on("send_message", (msg) => {
    io.emit("receive_message", msg);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

io.on("connection", (socket) => {
    let username = "";
  
    socket.on("set_username", (name) => {
      username = name;
      socket.emit("welcome_message", `Welcome to the chat, ${username}!`);
    });
  
    socket.on("send_message", (msg) => {
      if (username) {
        io.emit("receive_message", `${username}: ${msg}`);
      } else {
        io.emit("receive_message", msg);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  