const express = require('express');
const router = express.Router();
const { createLobby, getLobbies } = require('../controllers/lobbyController')

router.post('/create', createLobby);
router.get('/lobbies', getLobbies);

module.exports = router;
