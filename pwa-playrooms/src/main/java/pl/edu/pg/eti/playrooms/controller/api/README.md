# How to use playroom API

### Note

<i>The instruction uses the URL `localhost:8080` - <b>it is only dev URL</b>. 
Your code should have a const variable that represents server URL 
(to make future deployment easier).</i>

## Create a new playroom

1. Send POST request `localhost:8080/api/playrooms`
2. Receive playroom ID (e.g.): `"uuid": "1fbfc490-5fd8-4104-83db-bc275bc913dd"`

## Connect with server

1. Open websocket: `ws://localhost:8080/ws-playrooms`

## Join the waiting room

1. Playroom host should have sent you playroom ID
2. Send websocket message (e.g.):
   ```
    {
        "operation": "joinWaitingRoom",
        "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd",
        "player": {
            "id": "1116a8c1-113a-115f-119f-111af1ef19e3",
            "username": "exampleUsrname"
        }
    }
    ```
3. Receive websocket message with welcome info
   ```
   {
      "type": "welcomeInfo",
      "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45"
   }
   ```

4. Receive actual waiting room status (e.g.):
    ```
    {
       "isClosed": false,
       "players": [
           {
               "userId": "1116a8c1-113a-115f-119f-111af1ef19e3",
               "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
               "username": "exampleUsrname"
           }
       ],
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd",
       "hostID": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
       "type": "waitingRoom"
    }
    ```

## Update playroom settings

1. Send PUT request `localhost:8080/api/playrooms/1fbfc490-5fd8-4104-83db-bc275bc913dd` (e.g.):
   ```
   {
      "gameId": "2",
      "game": "name2",
      "isGlobalTimer": false,
      "timer": 500
   }
   ```
   
## Close waiting room and start game

1. Send websocket message (e.g.):
   ```
   {
      "operation": "closeWaitingRoom",
      "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd",
   }
   ```
2. Receive the waiting room status (e.g.):
   ```
   {
      "isClosed": true,
      "players": [
          {
              "userId": "1116a8c1-113a-115f-119f-111af1ef19e3",
              "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
              "username": "exampleUsername"
          }
      ],
      "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd",
      "hostId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
      "type": "waitingRoom"
   }
   ```
3. The waiting room is closed, new players cannot join!
4. Send websocket message (e.g.):
   ```
   {
      "operation": "finishWaitingRoom",
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd",
   }
   ```
5. Receive actual playroom status (e.g.):
   ```
   {
       "timer": null,
       "paused": true,
       "game": {
           "gameID": "2",
           "name": "name2"
       },
       "currentPlayer": 1,
       "players": [
           {
               "timer": 500,
               "name": "exampleUsername",
               "queueNumber": 1,
               "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
               "skipped": false
           }
       ],
       "ended": false,
       "hostId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
       "type": "playroom"
   }
   ```
6. Send websocket message to unpause game
   ```
   {
       "operation": "start",
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd"
   }
   ```
7. Receive actual playroom status
   ```
   {
       "timer": null,
       "paused": false,
       "game": {
           "gameID": "2",
           "name": "name2"
       },
       "currentPlayer": 1,
       "players": [
           {
               "timer": 499.984,
               "name": "exampleUsername",
               "queueNumber": 1,
               "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
               "skipped": false
           }
       ],
       "ended": false,
       "hostId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
       "type": "playroom"
   }
   ```

## Play time!

### End turn

1. Send websocket message to end turn
   ```
   {
       "operation": "endTurn",
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd"
   }
   ```
2. Receive actual playroom status
   ```
   {
       "timer": null,
       "paused": false,
       "game": {
           "gameID": "2",
           "name": "name2"
       },
       "currentPlayer": 1,
       "players": [
           {
               "timer": 360.651,
               "name": "exampleUsername",
               "queueNumber": 1,
               "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
               "skipped": false
           }
       ],
       "ended": false,
       "hostId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
       "type": "playroom"
   }
   ```

### Check status

1. Send websocket message (e.g.):
   ```
   {
       "operation": "status",
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd"
   }
   ```
2. Receive actual playroom status (e.g.):
   ```
   {
       "timer": null,
       "paused": false,
       "game": {
           "gameID": "2",
           "name": "name2"
       },
       "currentPlayer": 1,
       "players": [
           {
               "timer": 39.217,
               "name": "exampleUsername",
               "queueNumber": 1,
               "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
               "skipped": false
           }
       ],
       "ended": false,
       "hostId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
       "type": "playroom"
   }
   ```
   
or (<i>if time is up</i>

   ```
   {
      ...
      "ended": true
      ...
   }
   ```

### End game

1. Send websocket message (e.g.):
   ```
   {
       "operation": "endGame",
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd"
   }
   ```
2. Another player receives message (e.g.):
   ```
   {
       "question": "Please confirm if the game is ended.",
       "operationId": "5db9721e-3b3d-431a-88dc-40e8e02a46e6",
       "type": "confirmOperation"
   }
   ```
3. The player should send confirmation
   ```
   {
       "operation": "confirm",
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd",
       "operationId": "5db9721e-3b3d-431a-88dc-40e8e02a46e6"
   }
   ```
4. The game is ended
   ```
   {
       "timer": null,
       "paused": true,
       "game": {
           "gameID": "2",
           "name": "name2"
       },
       "currentPlayer": 1,
       "players": [
           {
               "timer": 300,
               "name": "exampleUsername",
               "queueNumber": 1,
               "playerId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
               "skipped": false
           },
           {
               "timer": 300,
               "name": "exampleUsername2",
               "queueNumber": 2,
               "playerId": "6b177cc2-0679-4f62-b7a5-3ddb1825be0e",
               "skipped": false
           }
       ],
       "ended": true,
       "hostId": "ce7ffcd6-a2a0-4ae7-a74a-0208acde9c45",
       "type": "playroom"
   }
   ```

### Pause

1. Send websocket message (e.g.):
   ```
   {
       "operation": "pause",
       "playroomId": "1fbfc490-5fd8-4104-83db-bc275bc913dd"
   }
   ```
2. Receive actual playroom status
   ```
      ...
      "paused": true,
      ...
   ```
