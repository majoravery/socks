import React, { useState, useEffect } from 'react';

import './participants.scss';

const Participants = props => {
  const [participants, setParticipants] = useState([]);

  return (
    <div className="participants">
      <h2>Participants</h2>
      <ul>
        {participants.map(p => <li>{p.username}</li>)}
      </ul>
    </div>
  );
}

export default Participants;
