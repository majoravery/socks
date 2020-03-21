const express = require('express');
const http = require('http');
const SocketServer = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
  serveClient: false, // whether to serve the client files
});

const PORT = process.env.PORT;


io.on('connection', (socket) => {
  socket.join('game-room', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(`Connection received, in rooms: ${rooms}`);
  });

  socket.on('register', data => {
    console.log(`Registered as ${data.username}`);
  })
});

io.on('register', (socket) => {
  console.log('Request received');
});

httpServer.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});