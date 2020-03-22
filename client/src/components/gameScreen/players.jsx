import React, { useState } from 'react';

const Players = ({ socket }) => {
  const [players, setPlayers] = useState(['hello', 'afternoon', 'avery', 'sean', 'nynke', 'harry', 'nina', 'austin']);

  socket.on('new-player', ({ players: connectedPlayers }) => {
    const validPlayers = connectedPlayers.filter(player => player.username);
    setPlayers(validPlayers);
  });

  socket.on('player-guessed', ({ players: connectedPlayers }) => {
    setPlayers(connectedPlayers);
  });

  console.log({players});
  return (
    <div className="players">
      <h2>Players: ({players.length})</h2>
      <ul>
        {players.map(p => (
          <li key={p.id} className={p.guessed ? 'guessed' : ''}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export default Players;
