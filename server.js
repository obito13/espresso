const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity
  },
});

app.use(cors());
app.use(express.json());

const chatRooms = {}; // In-memory store for chat rooms and messages

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).send('Username is required');
    res.status(200).send({ username });
  });

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a chat room
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    if (!chatRooms[room]) chatRooms[room] = { users: [], messages: [] };
    chatRooms[room].users.push(username);

    // Notify others in the room
    socket.to(room).emit('userJoined', `${username} has joined the room.`);
    io.to(room).emit('roomData', chatRooms[room]);
  });

  // Handle messages
  socket.on('sendMessage', ({ room, username, message }) => {
    const msg = { username, message, timestamp: new Date() };
    chatRooms[room].messages.push(msg);
    io.to(room).emit('newMessage', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server ${PORT} up and running`));