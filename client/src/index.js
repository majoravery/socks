import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import io from 'socket.io-client';

import WelcomeScreen from './components/welcomeScreen';
import GameScreen from './components/gameScreen';

const socket = io('http://localhost:8002', {

});

const PrivateRoute = ({ children, registered }) => {
  return (
    <Route
      render={({ location }) => {
        console.log(location, registered);
        return registered
          ? children
          : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { from: location }
                }}
                state={{ registered }}
                push
              />
            );
        }}
    />
  );
};

const RootContainer = () => {
  const [username, setUsername] = useState(null);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact><WelcomeScreen socket={socket} setUsername={setUsername} /></Route>
        <PrivateRoute path="/game" registered={username}><GameScreen socket={socket} username={username} /></PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<RootContainer />, document.getElementById('root'));