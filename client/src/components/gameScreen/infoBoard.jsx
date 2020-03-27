import React, { useState } from 'react';

const InfoBoard = ({ socket, children }) => {
  const [tick, setTick] = useState(3);


  socket.on('ticker-new-game', ({ tick: incomingTick }) => {
    setTick(incomingTick);
  });

  return (
    <div className="ib">
      {children}
      <p className="ib-new-game">New game starting in: {tick}</p>
    </div>
  );
}

export default InfoBoard;
