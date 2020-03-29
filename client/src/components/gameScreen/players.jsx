import React, { useState } from 'react';

const Players = ({ socket }) => {
  const [players, setPlayers] = useState([]);

  const getValidPlayers = ps => ps.filter(p => p.username);

  socket.on('new-player', ({ players: ps }) => {
    setPlayers(getValidPlayers(ps));
  });

  socket.on('player-guessed', ({ players: ps }) => {
    setPlayers(getValidPlayers(ps));
  });

  socket.on('new-game-starting', ({ players: ps }) => {
    setPlayers(getValidPlayers(ps));
  })

  return (
    <div className="players">
      <h2>Players: ({players.length})</h2>
      <ul>
        {players.map(p => (
          <li key={p.id} className={p.guessed ? 'guessed' : ''}>{p.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Players;
