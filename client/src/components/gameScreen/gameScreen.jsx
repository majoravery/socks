import React, { useState } from 'react';

import Participants from '../participants';
import './gameScreen.scss';

const GameScreen = props => {
  const [target, setTarget] = useState(null);

  const Game = () => {
    return (
      <div className="game">
        <div className="game-target">
          <h2>Target:</h2>
          {target && <p className="game-target-number">{target}</p>}
        </div>
        <div className="game-guess">
          <div className="game-guess-field">
            <label htmlFor="guess">Guess:</label>
            <input htmlFor="guess" />
            <button type="submit">Submit</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="gs">
      <Participants />
      <Game />
    </div>
  );
}

export default GameScreen;
