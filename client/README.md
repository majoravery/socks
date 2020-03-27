# Socks client

React n WebSockets mainly

## Messages sent

These are the different types of messages and their accompanying data object (if any) sent to the WebSockets server.

#### `guess`
Description: Guess number from a player
Data object:
| Key | Type | Description|
|---|---|---|
| `guess` | integer | Guess number |

#### `register`
Description: Registers user to game
Data object:
| Key | Type | Description|
|---|---|---|
| `username` | string | Consists of user's player name that will be displayed in the Players panel |
