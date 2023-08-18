const lobbyStore = require('../lobbyStore');

const createLobby = (req, res) => {
  const { id, creator, game, state } = req.body;
  if (!lobbyStore.rooms[id]) {
    if(game === 'Tic Tac Toe'){
    lobbyStore.rooms[id] = { players: [], board: Array(9).fill(null) };
    lobbyStore.lobbies.push({ id: id, creator: creator, game: game, state: state });
    }
  else if (game === 'Math Game'){
    lobbyStore.rooms[id] = { players: [], equations: [], scores: {} };
    lobbyStore.lobbies.push({ id: id, creator: creator, game: game, state: state });
  }
  }

  res.send('Lobby created successfully');
};

const getLobbies = (req, res) => {
  res.json(lobbyStore.lobbies);
};

module.exports = {
  createLobby,
  getLobbies
};
