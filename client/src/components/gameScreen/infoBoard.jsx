import React, { useState } from 'react';

const InfoBoard = ({ socket, children }) => {
  const [tick, setTick] = useState(null);

  socket.on('ticker-new-game', ({ tick: incomingTick }) => {
    // Avoid displaying 0 or less as counter as the new-game 
    // event will be broadcasted shortly after 0 on the server
    // side, causing a brief flash of the 0 tick
    if (incomingTick < 1) {
      return;
    }

    setTick(incomingTick);
  });

  return (
    <div className="ib">
      {children}
      <p className={`ib-new-game ${!tick && 'hidden'}`}>New game starting in: {tick}</p>
    </div>
  );
}

export default InfoBoard;
