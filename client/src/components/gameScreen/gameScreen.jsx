import React, { useState } from 'react';

import Players from './players';
import ResultBoard from './resultBoard';
import './gameScreen.scss';

const GUESS_OPTIONS = [];
for(let i = 0; i <=9; i++) {
  GUESS_OPTIONS.push(i);
}

const GameScreen = ({ socket }) => {
  const [target, setTarget] = useState(245);
  const [guess, setGuessed] = useState(false);
  const [result, setResult] = useState(null); // NOTE: change back to null
  const [displayResultBoard, setDisplayResultBoard] = useState(false); // NOTE: change back to false

  const onGuessSubmit = option => {
    // socket.emit('guess', { guess: option });
    setGuessed(option);
  };

  socket.on('new-game', ({ target: incomingTarget }) => {
    setTarget(incomingTarget);
  });

  socket.on('game-result', ({ result: incomingResult }) => {
    setDisplayResultBoard(true);
    setResult(incomingResult);
  });

  socket.on('new-game-starting', () => {
    setDisplayResultBoard(false);
    setGuessed(null);
    setResult(null);
  });

  const Game = () => {
    return (
      <div className="game">
        <div className="game-target">
          <h2>Target:</h2>
          {target && <p className="game-target-number">{target}</p>}
        </div>
        <div className={`game-options ${guess ? 'guessed' : ''}`}>
          {GUESS_OPTIONS.map(option => (
            <button
              className={`game-option ${guess === option ? 'selected' : ''}`}
              id={`option-${option}`}
              key={option}
              onClick={() => onGuessSubmit(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="gs">
      <Players socket={socket} />
      <Game />
      {displayResultBoard && <ResultBoard socket={socket} result={result} />}
    </div>
  );
}

export default GameScreen;
