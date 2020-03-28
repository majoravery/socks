# Socks server

WebSockets n stuff, also handles game and countdown logic
Runs on port **8002**

## Messages sent

These are the different types of messages and their accompanying data object (if any) broadcasted to all connected client sockets.

### `game-result`

Sends game results including sum of guesses and win status

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `sum` | integer | Sum of players' guesses |
| `win` | boolean | Indicates whether everyone has won the game or not |
| `corona` | boolean | Indicates whether the sum is exactly 19 or not |


### `invalid-game`

Broadcasts to room that there are now insufficient players to reach the target

#### **Data object:** `null`

### `new-game-starting`

New game starting alert for client to prepare

#### **Data object:** `null`

### `new-game`

New game with new target number

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `target` | integer | Target number for new game |

### `new-player`

New player to update `<Players />` column

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `players` | array | Array of player objects (ie socket id, name) |

### `player-guessed`

Sends `players` array to update column and indicate which players have already guessed

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `players` | array | Array of player objects (ie socket id, name, guessed) |

### `ticker-guess`

Ticker for guess

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `tick` | integer | Ticker counter in milliseconds |

### `ticker-new-game`

Ticker for new game

#### **Data object:**

| Key | Type | Description|
|---|---|---|
| `tick` | integer | Ticker counter in milliseconds |
