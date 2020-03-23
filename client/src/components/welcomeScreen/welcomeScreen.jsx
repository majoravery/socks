import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './welcomeScreen.scss';

const MESSAGE_HIT_ENTER_TO_JOIN = 'Hit -enter- to join';
const MESSAGE_INVALID_NAME = 'Invalid name';

const WelcomeScreen = ({ socket, setUsername }) => {
  const usernameRef = useRef(null);
  const [joinMessage, setJoinMessage] = useState(MESSAGE_HIT_ENTER_TO_JOIN);
  const history = useHistory();

  useEffect(() => {
    root.style.setProperty('--left', '0px');
  }, []);

  useEffect(() => {
    usernameRef.current.focus();
  }, [usernameRef]);

  const onInputChange = () => {
    setJoinMessage(MESSAGE_HIT_ENTER_TO_JOIN);
    const input = usernameRef.current.value;
    if (!input.match("^[A-Za-z0-9]+$")) {
      usernameRef.current.value = input.substr(0, input.length - 1);
    }

    // Get length again
    const letters = usernameRef.current.value.length;
    
    // Width of each letter is 16px, cursor should be beneath letter
    const left = letters === 0 ? '0px' : `${letters * 16 - 16}px`;
    root.style.setProperty('--left', left);
  }

  const onNameSubmit = e => {
    e.preventDefault();
    const username = usernameRef.current.value;

    if (!username || !username.length) {
      setJoinMessage(MESSAGE_INVALID_NAME);
      return;
    }

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
        <h2>How to play:</h2>
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
            <span className="ws-input-wrap">
              <input
                id="username"
                name="username"
                type="text"
                ref={usernameRef}
                onChange={onInputChange}
                autoComplete="off"
                maxLength={15}
              />
              <span className="ws-cursor"></span>
            </span>
          </form>
          <p>{joinMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
