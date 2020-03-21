import React, { useState } from 'react';

import './resultBoard.scss';

const ResultBoard = props => {
  const [sum, setSum] = useState(null);
  const [won, setWon] = useState(null);
  const [corona, setCorona] = useState(null);
  const [ticker, setTicker] = useState(null);
  
  return (
    <div className="rb">
      <p className="rb-sum">Sum: {sum}</p>
      {corona
        ? (<h3>Everyone gets corona!!!!!!</h3>)
        : (<h3>You {won ? 'won' : 'lost'}!</h3>)
      }
      <p className="rb-new-game">New game starting in: {ticker}</p>
    </div>
  );
}

export default ResultBoard;
