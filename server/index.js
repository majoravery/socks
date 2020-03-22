const express = require('express');
const http = require('http');
const SocketServer = require('socket.io');

const PORT = process.env.PORT;
const GAME_ROOM_ID = 'game-room';

let players = [];
let sum = 0;
let target;

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
  serveClient: false, // whether to serve the client files
  // transports: ['websocket'],
});
io.use(function(socket, next) {
  handshake = socket.request;
  next();
});

const updateUsername = (id, username) => {
  const player = players.find(player => player.id === id);
  player.username = username;
  players = [
    ...players.filter(player => player.id !== id),
    player,
  ];
}

const removeUserFromPlayers = id => {
  players = players.filter(player => player.id !== id);
}

const startGame = () => {
  io.to(GAME_ROOM_ID).emit('new-game-starting');

  sum = 0;
  const min = 1;
  const max = players.length * 9 - 1;
  let generated;
  while (!generated || generated === 19) {
    generated = Math.floor(Math.random() * (max - min + 1) + min);
  }
  target = generated;

  // createTicker(COUNTDOWN_LENGTH, tallyResults, connection);
  console.log(`New target ${target}`);
  io.to(GAME_ROOM_ID).emit('new-game', { target });
}

io.on('connection', (socket) => {
  socket.join(GAME_ROOM_ID, () => {
    let rooms = Object.keys(socket.rooms);
    players.push({ id: socket.id });
    console.log(`${players.length} players: ${players.map(player => player.id).join(' ')}`)
  });

  socket.on('register', ({ username }) => {
    console.log(`Registered as ${username}`);
    updateUsername(socket.id, username);
    io.to(GAME_ROOM_ID).emit('new-player', { players });
    if (players.length >= 3) {
      startGame();
    }
  });

  socket.on('guess', ({ guess }) => {
    console.log(`Sum = ${sum} + ${guess}`);
    sum += parseInt(guess, 10);
  });

  socket.on('leave', () => {
    socket.disconnect(true);
  });

  socket.on('disconnect', () => {
    removeUserFromPlayers(socket.id);
    console.log(`Disconnected ${socket.id}`);
    console.log(`${players.length} players: ${players.map(player => player.id).join(' ')}`)
  });
});

httpServer.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});