import React, { useState, useEffect } from 'react';

import './players.scss';

const Players = ({ socket }) => {
  const [players, setPlayers] = useState([]);

  socket.on('new-player', ({ players: connectedPlayers }) => {
    const validPlayers = connectedPlayers.filter(player => player.username);
    setPlayers(validPlayers);
  });

  return (
    <div className="players">
      <h2>Players ({players.length})</h2>
      <ul>
        {players.map(p => <li key={p.id}>{p.username}</li>)}
      </ul>
    </div>
  );
}

export default Players;
