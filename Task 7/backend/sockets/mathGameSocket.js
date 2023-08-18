const lobbyStore = require('../lobbyStore');

const generateEquation = () => {
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let a, b, answer;

  switch (operator) {
    case '+':
      a = Math.floor(Math.random() * 100);
      b = Math.floor(Math.random() * 100);
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 100);
      b = Math.floor(Math.random() * a);
      answer = a - b;
      break;
    case '*':
      a = Math.floor(Math.random() * 10);
      b = Math.floor(Math.random() * 10);
      answer = a * b;
      break;
    default:
      a = 0;
      b = 0;
      answer = 0;
      break;
  }

  return { question: `${a} ${operator} ${b}`, answer };
};


const mathGameSocket = (socket, io) => {

  socket.on('joinMathGameRoom', ({ roomId, nickname }) => {
    if (!lobbyStore.rooms[roomId]) {
      lobbyStore.rooms[roomId] = { players: [], equations: [], scores: {} };
    }

    const room = lobbyStore.rooms[roomId];

    socket.join(roomId);
    room.players.push(socket.id);
    room.scores[socket.id] = { nickname, score: 0 };

    if (room.players.length === 2) {
      startMathGame(roomId);
    }
  });

  const startMathGame = (roomId) => {
    const room = lobbyStore.rooms[roomId];

    for (let i = 0; i < 10; i++) {
      const equation = generateEquation();
      room.equations.push(equation);
    }

    sendNextEquation(roomId);
    const lobby = lobbyStore.lobbies.find((lobby) => lobby.id === roomId);
    lobby.state = true;


  };

  const sendNextEquation = (roomId) => {
    const room = lobbyStore.rooms[roomId];

    if (room.equations.length > 0) {
      const equation = room.equations[0];
      io.to(roomId).emit('nextMathEquation', { equation, scores: room.scores });
    } else {
      const lobbyIndex = lobbyStore.lobbies.findIndex((lobby) => lobby.id === roomId);
      lobbyStore.lobbies.splice(lobbyIndex, 1);
      delete lobbyStore.rooms[roomId];
      io.to(roomId).emit('endMathGame', { scores: room.scores });
      io.socketsLeave(roomId);

    }
  };


  socket.on('answerMathEquation', ({ roomId, answer }) => {
    const room = lobbyStore.rooms[roomId];
    if (room.equations.length > 0 && room.equations[0].answer == answer) {
      const currentPlayer = room.scores[socket.id];
      room.equations.shift();
      currentPlayer.score += 1;

      io.to(roomId).emit('updateMathScores', room.scores);

      sendNextEquation(roomId);
    }
  });


  socket.on('leaveMathGameRoom', (roomId) => {
    const room = lobbyStore.rooms[roomId];
    const playerIndex = room.players.indexOf(socket.id);
    const lobbyIndex = lobbyStore.lobbies.findIndex((lobby) => lobby.id === roomId);


    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);
      delete room.scores[socket.id];
      room.equations = []
      if (room.players.length === 0) {
        delete lobbyStore.rooms[roomId];
        lobbyStore.lobbies.splice(lobbyIndex, 1);

      } else {
        io.to(roomId).emit('playerHasLeft')
      }
    }

    socket.leave(roomId);
  });
};

module.exports = mathGameSocket;
