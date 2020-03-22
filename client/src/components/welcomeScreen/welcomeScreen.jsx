import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './welcomeScreen.scss';

const WelcomeScreen = ({ socket, setUsername }) => {
  const usernameRef = useRef(null);
  const history = useHistory();

  const onNameSubmit = e => {
    e.preventDefault();
    const username = usernameRef.current.value;

    if (!username) {
      // TODO: handle bad username;
      return;
    }

    // TODO: validate username - no spaces, no weird characters

    socket.emit('register', { username });
    setUsername(username);
    history.push('/game');
  };

  return (
    <div className="ws">
      <h1 className="ws-title">
        COVID-19 Game
      </h1>
      <div className="ws-instructions">
        <h2>Instructions:</h2>
        <ol>
          <li>The goal of the game is to match the input sum of all participants to the target number displayed.</li>
          <li>When a new game starts, enter your guess before the countdown ends.</li>
          <li>Valid input numbers are between 0 and 9, inclusive.</li>
          <li>If the sum of input from all participants match the target number displayed, everyone wins. Otherwise, everyone loses.</li>
          <li>If the sum is 19, everyone gets corona!!!!</li>
        </ol>
      </div>
      <div className="ws-join">
        <div className="ws-name-field">
          <form onSubmit={onNameSubmit}>
            <label htmlFor="username">Name:</label>
            <input id="username" name="username" type="text" ref={usernameRef} autoFocus />
          </form>
          <p>Hit -enter- to join</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
