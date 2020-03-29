import React, { Fragment, useState } from 'react';

import Players from './players';
import InfoBoard from './infoBoard';
import './gameScreen.scss';

const GUESS_OPTIONS = [];
for(let i = 0; i <=9; i++) {
  GUESS_OPTIONS.push(i);
}

const GameScreen = ({ socket }) => {
  const [displayInfoBoard, setDisplayInfoBoard] = useState(false);
  const [guess, setGuessed] = useState(false);
  const [invalidGame, setInvalidGame] = useState(false);
  const [newGameStarting, setNewGameStarting] = useState(false);
  const [result, setResult] = useState(null);
  const [target, setTarget] = useState(null);
  const [tick, setTick] = useState(null);

  const onGuessSubmit = option => {
    socket.emit('guess', { guess: option });
    setGuessed(option);
  };

  socket.on('game-result', ({ result: incomingResult }) => {
    setResult(incomingResult);
    setDisplayInfoBoard(true);
    setTick(null);
  });

  socket.on('invalid-game', () => {
    setInvalidGame(true);
    setDisplayInfoBoard(true);
    setTick(null);
  });

  socket.on('new-game', ({ target: incomingTarget }) => {
    setDisplayInfoBoard(false);
    setGuessed(null);
    setInvalidGame(false);
    setNewGameStarting(false); // New game has started, value should be false
    setResult(null);
    setTarget(incomingTarget);
  });

  socket.on('new-game-starting', () => {
    setNewGameStarting(true);
  });

  socket.on('ticker-guess', ({ tick: incomingTick }) => {
    // Avoid displaying 0 or less as counter as the new-game 
    // event will be broadcasted shortly after 0 on the server
    // side, causing a brief flash of the 0 tick
    if (incomingTick < 1) {
      return;
    }

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

  let infoBoardContent;
  let bgEffect;
  let bgEffectContent;

  if (newGameStarting) {
    infoBoardContent = (
      <p className="ib-new-game">Get ready!</p>
    );
  }

  if (result) {
    const { sum, won, corona } = result;
    
    if (corona) {
      bgEffect = 'corona';
    } else {
      bgEffect = won ? 'won' : 'lost';
    }

    infoBoardContent = (
      <Fragment>
        <p className="ib-sum">Sum: {sum}</p>
        {corona && <h3 className="ib-corona">Everyone gets corona<br />!!!!!!</h3>}
        {won ? <h3 className="ib-won">You won</h3> : <h3 className="ib-lost">You lost</h3>}
      </Fragment>
    );
  } else {
    bgEffect = null;
  }

  if (invalidGame) {
    infoBoardContent = (
      <p className="ib-invalid-game">
        Insufficient current number of players to reach target.
      </p>
    );
  }

  switch (bgEffect) {
    case 'corona':
      bgEffectContent = null;
      break;
    case 'won':
      bgEffectContent = null;
      break;
    case 'lost':
      bgEffectContent = (
        <>
          {new Array(16).forEach(a => (<div className="ib-bg-rain"></div>))}
        </>
      );
      break;
    default: 
      bgEffectContent = null;
      break;
  }

  return (
    <div className="gs">
      <Players socket={socket} />
      <Game />
      {bgEffectContent} {/* // TODO: delete this */}
      {/* {bgEffect && bgEffectContent} */}
      {displayInfoBoard && (
        <InfoBoard socket={socket}>
          {infoBoardContent}
        </InfoBoard>
      )}
    </div>
  );
}

export default GameScreen;
