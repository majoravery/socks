# Socks client

React n WebSockets mainly
Runs on port **3013**

## Messages sent

These are the different types of messages and their accompanying data object (if any) sent to the WebSockets server.

### `guess`

Guess number from a player

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `guess` | integer | Guess number |

### `register`

Registers user to game

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `username` | string | Consists of user's player name that will be displayed in the Players panel |

## Credits

Dizzy effect inspired by [Takane Ichinose](https://codepen.io/takaneichinose/pen/jONdGxM?editors=0010)