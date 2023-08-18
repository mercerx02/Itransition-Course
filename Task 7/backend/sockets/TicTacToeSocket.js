const lobbyStore = require('../lobbyStore');


const checkWin = (board, player) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return 'win';
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'draw';
    }

    return false;
  };



const TicTacToeSocket = (socket, io) => {
    socket.on('joinRoom', (roomId) => {
        if (!lobbyStore.rooms[roomId]) {
          lobbyStore.rooms[roomId] = { players: [], board: Array(9).fill(null) };
        }

        const room = lobbyStore.rooms[roomId];

        const player = room.players.length % 2 === 0 ? 'X' : 'O';

        socket.join(roomId);
        room.players.push({ id: socket.id, player });
        const playerInfo = room.players.find((p) => p.id === socket.id);
        socket.emit('playerSymbol', playerInfo.player);
        if (room.players.length === 2) {
          io.to(roomId).emit('startGame', { currentPlayer: 'X', board: room.board });
          const lobby = lobbyStore.lobbies.find((lobby) => lobby.id === roomId);
          if (lobby) {
            lobby.state = true;
          }
        }
      });

      socket.on('makeMove', ({ roomId, index, player }) => {
        const room = lobbyStore.rooms[roomId];

        if (room.players.some((p) => p.id === socket.id) && room.board[index] === null) {
          room.board[index] = player;
          const nextPlayer = player === 'X' ? 'O' : 'X';

          const isWinner = checkWin(room.board, player);
          if (isWinner) {
            delete lobbyStore.rooms[roomId];
            const message = isWinner === 'win' ? `${player} has won!` : 'Draw!';
            io.to(roomId).emit('winner', message);
            io.to(roomId).emit('roomClosed');
            io.socketsLeave(roomId);

            const lobbyIndex = lobbyStore.lobbies.findIndex((lobby) => lobby.id === roomId);
            if (lobbyIndex !== -1) {
              lobbyStore.lobbies.splice(lobbyIndex, 1);

            }
          } else {
            io.to(roomId).emit('updateBoard', { board: room.board, currentPlayer: nextPlayer });
          }
        }
      });

      socket.on('leaveRoom', (roomId) => {
          const room = lobbyStore.rooms[roomId];
          const lobbyIndex = lobbyStore.lobbies.findIndex((lobby) => lobby.id === roomId);

          if (room) {
            const playerIndex = room.players.findIndex((p) => p.id === socket.id);
            if (playerIndex !== -1) {
              room.players.splice(playerIndex, 1);

              if (room.players.length === 0) {
                delete lobbyStore.rooms[roomId];
                if (lobbyIndex !== -1) {
                  lobbyStore.lobbies.splice(lobbyIndex, 1);
                }
                io.socketsLeave(roomId);

              } else {
                if (lobbyIndex !== -1) {
                  lobbyStore.lobbies[lobbyIndex].state = false;
                }
                room.board = Array(9).fill(null)
                io.to(roomId).emit('playerHasLeft', null)
                socket.leave(roomId)

              }
            }
          }
        });

}

module.exports = TicTacToeSocket;
