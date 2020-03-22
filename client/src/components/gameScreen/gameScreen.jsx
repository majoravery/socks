import React, { useState } from 'react';

import Players from '../players';
import './gameScreen.scss';

const GUESS_OPTIONS = [];
for(let i = 0; i <=9; i++) {
  GUESS_OPTIONS.push(i);
}

const GameScreen = ({ socket, username }) => {
  console.log(username);
  const [target, setTarget] = useState(null);
  const [guessed, setGuessed] = useState(false);

  const onGuessSubmit = guess => {
    console.log(guess);
    socket.emit('guess', { guess });
    setGuessed(true);
  };

  socket.on('new-game', ({ target: incomingTarget }) => {
    setTarget(incomingTarget);
    setGuessed(false);
  });

  const Game = () => {
    return (
      <div className="game">
        <div className="game-target">
          <h2>Target:</h2>
          {target && <p className="game-target-number">{target}</p>}
        </div>
        <div className={`game-options ${guessed ? 'guessed' : ''}`}>
          {GUESS_OPTIONS.map(option => (
            <button key={option} id={option} className="game-option" onClick={() => onGuessSubmit(option)}>{option}</button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="gs">
      <Players socket={socket} />
      <Game />
    </div>
  );
}

export default GameScreen;
