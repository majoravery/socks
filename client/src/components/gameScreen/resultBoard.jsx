import React, { useState } from 'react';

const ResultBoard = ({ socket, result }) => {
  const [tick, setTick] = useState(3);

  const { corona, sum, won } = result;

  socket.on('ticker', ({ tick: incomingTick }) => {
    setTick(incomingTick);
  });

  return (
    <div className="rb">
      <p className="rb-sum">Sum: {sum}</p>
      {corona
        ? (<h3 className="rb-corona">Everyone gets corona<br />!!!!!!</h3>)
        : (<h3>You {won ? 'won' : 'lost'}</h3>)
      }
      <p className="rb-new-game">New game starting in: {tick}</p>
    </div>
  );
}

export default ResultBoard;
