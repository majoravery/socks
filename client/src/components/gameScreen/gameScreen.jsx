import React, { useState } from 'react';

import Players from './players';
import ResultBoard from './resultBoard';
import './gameScreen.scss';

const GUESS_OPTIONS = [];
for(let i = 0; i <=9; i++) {
  GUESS_OPTIONS.push(i);
}

const GameScreen = ({ socket }) => {
  const [displayResultBoard, setDisplayResultBoard] = useState(false);
  const [guess, setGuessed] = useState(false);
  const [result, setResult] = useState(null);
  const [target, setTarget] = useState(null);
  const [tick, setTick] = useState(null);

  const onGuessSubmit = option => {
    socket.emit('guess', { guess: option });
    setGuessed(option);
  };

  socket.on('new-game', ({ target: incomingTarget }) => {
    setDisplayResultBoard(false);
    setGuessed(null);
    setResult(null);
    setTarget(incomingTarget);
  });

  socket.on('game-result', ({ result: incomingResult }) => {
    setDisplayResultBoard(true);
    setResult(incomingResult);
    setTick(null);
  });

  socket.on('new-game-starting', () => {
  });

  socket.on('ticker-guess', ({ tick: incomingTick }) => {
    setTick(incomingTick);
  });

  const Game = () => {
    return (
      <div className="game">
        <div className="game-target">
          <h2>Target:</h2>
          {target
            ? (<p className="game-target-number">{target}</p>)
            : (<p className="game-waiting">Waiting for more players</p>)
          }
        </div>
        {tick && <div className="game-countdown">{tick}</div>}
        <div className={`game-options ${(target && !guess) ? 'ready' : ''}`}>
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
