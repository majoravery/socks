const express = require('express');
const http = require('http');
const SocketServer = require('socket.io');

const COUNTDOWN_NEW_GAME = 5000;
const COUNTDOWN_GUESS = 8000;
const GAME_ROOM_ID = 'game-room';
const MAXIMUM_PLAYERS = 4;
const ONE_SECOND = 1000;
const PORT = process.env.PORT;
const SOCKET_DELAY = ONE_SECOND;

let playersCapReached = false;
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
  console.log({ players });
}

const removeUserFromPlayers = id => {
  players = players.filter(player => player.id !== id);
}

const getNextWaitingPlayerId = () => {
  const index = players.findIndex(p => !p.playing);
  return players[index].id;
}

const startCountdown = (length, type, callback) => {
  let counter = length;
  ticker = setInterval(() => {
    const tick = parseInt(counter / ONE_SECOND, 10);
    broadcast(type, { tick });
    counter -= ONE_SECOND;
    console.log(`Counter: ${counter}`);

    if (counter <= 0 - SOCKET_DELAY) {
      clearInterval(ticker);
      if (callback) {
        callback();
      }
    };
  }, ONE_SECOND);
}

const resetGame = () => {
  sum = 0;
  players = players.map(player => {
    player.guessed = false
    return player;
  });
  console.log(players);
}

const canNewGameStart = () => {
  const validPlayers = players.filter(player => player.username).length >= 3;
  return validPlayers && !ongoingGame;
}

const tallyResults = () => {
  ongoingGame = false;
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
    broadcast('new-game-starting', { players });
    startCountdown(countdown, 'ticker-new-game', startGame);
  }
}

const startGame = () => {
  resetGame();
  broadcast('new-game-starting', { players });
  ongoingGame = true;

  const validPlayers = players.filter(player => player.username);
  const min = 1; // Setting 0 as minimum would be too easy
  const max = validPlayers.length * 9 - 1; // Same goes for the maximum possible value
  let generated;
  while (!generated || generated === 19) {
    generated = Math.floor(Math.random() * (max - min + 1) + min);
  }
  target = generated;

  broadcast('new-game', { target });
  startCountdown(COUNTDOWN_GUESS, 'ticker-guess', tallyResults);
}

const stopGame = () => {
  clearInterval(ticker);
}

const isTargetStillAchievable = () => {
  return players.length * 9 >= target;
}

io.on('connection', (socket) => {
  socket.join(GAME_ROOM_ID, () => {
  });

  socket.on('register', ({ username }) => {
    players.push({ id: socket.id, playing: true });

    if (players.length > MAXIMUM_PLAYERS) {
      playersCapReached = true;
      updatePlayer(socket.id, { playing: false });
    }

    console.log(`\nRegistered as ${username}`);
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
    broadcast('player-guessed', { players });

    console.log(`Sum = ${sum} + ${guess}`);
    sum += parseInt(guess, 10);
  });

  socket.on('disconnect', () => {
    removeUserFromPlayers(socket.id);
    console.log(`\nDisconnected ${socket.id}`);

    // Get next waiting player, if any
    if (playersCapReached) {
      const id = getNextWaitingPlayerId();
      console.log({ id });
      updatePlayer(id, { playing: true });
      playersCapReached = players.length > MAXIMUM_PLAYERS;
    }
    
    const achievable = isTargetStillAchievable();
    if (!achievable) {
      // Current target is higher than players.length * 9
      ongoingGame = false;

      if (canNewGameStart()) {
        // Still enough players to start new round
        startCountdown(COUNTDOWN_NEW_GAME, 'invalid-game', startGame);
      } else {
        // Only 2 or less players left
        stopGame();
      }
    } else {
      // Current target still achievable, let game proceed as usual
    }
  });
});

httpServer.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});