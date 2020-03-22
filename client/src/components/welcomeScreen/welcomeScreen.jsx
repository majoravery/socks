import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './welcomeScreen.scss';

const WelcomeScreen = ({ socket, setUsername }) => {
  const usernameRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    root.style.setProperty('--left', '0px');
  }, []);

  const onInputChange = () => {
    const letters = usernameRef.current.value.length;
    // Width of each letter is 16px, cursor should be beneath letter
    root.style.setProperty('--left', `${letters * 16 - 16}px`);
  }

  const onNameSubmit = e => {
    e.preventDefault();
    const username = usernameRef.current.value;

    if (!username || !username.length) {
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
          <li>Minimum number of players: 3</li>
          <li>When a new game starts, enter your guess before the countdown ends.</li>
          <li>Valid input numbers are between 0 and 9, inclusive.</li>
          <li>If the sum of input from all players match the target number, everyone wins. Otherwise, everyone loses.</li>
          <li>If the sum is exactly 19, everyone gets corona!!!!</li>
        </ol>
        <p>Best played on<br />a mobile device</p>
      </div>
      <div className="ws-join">
        <div className="ws-name-field">
          <form onSubmit={onNameSubmit}>
            <label htmlFor="username">Name:</label>
            <span>
              <input
                id="username"
                name="username"
                type="text"
                ref={usernameRef}
                onChange={onInputChange}
                autoComplete="off"
                autoFocus
                maxLength={15}
              />
            </span>
          </form>
          <p>Hit -enter- to join</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
