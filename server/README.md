# Socks server

WebSockets n stuff, also handles game and countdown logic

## Types of messages broadcasted

| Message type | Description | Data |
|---|---|---|
| game-result | Sends game results including sum of guesses and win status | |
| new-game-starting | New game starting alert for client to prepare | |
| new-game | New game with new target number | |
| new-player | New player to update <Players /> column | |
| player-guessed | Sends `players` array to update column and indicate which players have already guessed | |
| ticker-guess | Ticker for guess | |
| ticker-new-game | Ticker for new game | |