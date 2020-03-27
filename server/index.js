const express = require('express');
const http = require('http');
const SocketServer = require('socket.io');

const COUNTDOWN_NEW_GAME = 5000;
const COUNTDOWN_GUESS = 8000;
const GAME_ROOM_ID = 'game-room';
const ONE_SECOND = 1000;
const PORT = process.env.PORT;

let ongoingGame = false;
let players = [];
let sum = 0;
let target;
let ticker;

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
  serveClient: false, // whether to serve the client files
});
// TODO: validate connection
// io.use(function(socket, next) {
//   handshake = socket.request;
//   next();
// });

const broadcast = (type, data) => {
  io.to(GAME_ROOM_ID).emit(type, data);
}

const updatePlayer = (id, updateObj) => {
  const player = players.find(player => player.id === id);
  const playerUpdated = {
    ...player,
    ...updateObj
  };
  players = [
    ...players.filter(player => player.id !== id),
    playerUpdated,
  ]; 
}

const removeUserFromPlayers = id => {
  players = players.filter(player => player.id !== id);
}

const startCountdown = (length, type, callback) => {
  let counter = length;
  ticker = setInterval(() => {
    broadcast(type, { tick: counter });
    counter -= ONE_SECOND;
    console.log(`Counter: ${counter}`);

    if (counter <= 0) {
      clearInterval(ticker);
      callback();
    };
  }, ONE_SECOND);
}

const resetGame = () => {
  sum = 0;
  players = players.map(player => player.guess = false);
}

const canNewGameStart = () => {
  const validPlayers = players.filter(player => player.username).length >= 3;
  return validPlayers && !ongoingGame;
}

const tallyResults = () => {
  const result = {
    sum,
    won: false,
    corona: false,
  };
  let countdown = COUNTDOWN_NEW_GAME;

  if (sum === target) {
    result.won = true;
  } else if (sum === 19) {
    result.corona = true;
    countdown += countdown; // Double countdown time for corona effect
  }

  broadcast('game-result', { result });
  if (canNewGameStart()) {
    broadcast('new-game-starting');
    startCountdown('ticker-new-game', startGame);
  } else {
    ongoingGame = false;
  }
}

const startGame = () => {
  resetGame();
  broadcast('new-game-starting');

  const min = 1; // Setting 0 as minimum would be too easy
  const max = players.length * 9 - 1; // Same goes for the maximum possible value
  let generated;
  while (!generated || generated === 19) {
    generated = Math.floor(Math.random() * (max - min + 1) + min);
  }
  target = generated;

  console.log(`New target ${target}`);
  broadcast('new-game', { target });
  startCountdown('ticker-guess', tallyResults);
}

const stopGame = () => {
  clearInterval(ticker);
}

const isTargetStillValid = () => {
  return players.length * 9 >= target;
}

io.on('connection', (socket) => {
  socket.join(GAME_ROOM_ID, () => {
    let rooms = Object.keys(socket.rooms);
    players.push({ id: socket.id });
    console.log(`${players.length} players: ${players.map(player => player.id).join(' ')}`)
  });

  socket.on('register', ({ username }) => {
    console.log(`Registered as ${username}`);
    updatePlayer(socket.id, { username });
    broadcast('new-player', { players });
    if (canNewGameStart()) {
      startGame();
    }
  });

  socket.on('guess', ({ guess }) => {
    // Set player has guessed
    updatePlayer(socket.id, { guessed: true });

    // Send player guessed data to everyone
    broadcast('player-guessed', players);

    console.log(`Sum = ${sum} + ${guess}`);
    sum += parseInt(guess, 10);
  });

  socket.on('disconnect', () => {
    removeUserFromPlayers(socket.id);
    console.log(`Disconnected ${socket.id}`);
    console.log(`${players.length} players: ${players.map(player => player.id).join(' ')}`)
    const valid = isTargetStillValid();
    if (!valid) {
      ongoingGame = false;
      startCountdown('invalid-game', startGame);
      stopGame();

      if (canNewGameStart()) {
        startCountdown('ticker-new-game', startGame);
      } else {
        
      }
    }
  });
});

httpServer.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});