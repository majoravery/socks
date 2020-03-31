import React, { Fragment, useState, useRef, forwardRef } from 'react';

import DizzyEffect from './dizzyEffect';
import InfoBoard from './infoBoard';
import Players from './players';
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

  const ibRef = useRef(null);

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
      bgEffectContent = (
        <div className="ib-bg-corona">
          <DizzyEffect ibRef={ibRef} />
          <div className="ib-bg-squiggles">
            {`<!-- Credit: https://codepen.io/davidkpiano/pen/wMqXea -->`}
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
              <defs>
                <filter id="squiggle-0">
                  <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="0"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" id="displacement" />
                </filter>
                <filter id="squiggle-1">
                  <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="1"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
                <filter id="squiggle-2">
                  <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
                <filter id="squiggle-3">
                  <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="3"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
                <filter id="squiggle-4">
                  <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="4"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
                </filter>
              </defs> 
            </svg>
          </div>
        </div>
      );
      break;
    case 'won':
      bgEffectContent = null;
      break;
    case 'lost':
      bgEffectContent = (
        <Fragment>
          {new Array(16).fill(null).map((a, i) => (<div key={`drop-${i}`}  className="ib-bg-rain" />))}
        </Fragment>
      );
      break;
    default: 
      bgEffectContent = null;
      break;
  }

  return (
    <Fragment>
      <div className={`gs ${bgEffect ? bgEffect : ''}`}>
        <Players socket={socket} />
        <Game />
        {bgEffect && bgEffectContent}
      </div>
      {displayInfoBoard && (
        <InfoBoard domRef={ibRef} socket={socket}>
          {infoBoardContent}
        </InfoBoard>
      )}
    </Fragment>
  );
}

export default GameScreen;
