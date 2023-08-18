import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import ResultDialog from './ResultDialog';
const socket = io(`${process.env.API_URL}`, {
  transports: ['websocket'],
});

const TicTacToe = ({roomId}) => {

  const [board, setBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [playerSymbol, setPlayerSymbol] = useState('');
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [result, setResult] = useState(null)

  const navigate = useNavigate()
  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('playerSymbol', (symbol) => {
      setPlayerSymbol(symbol);
      console.log(playerSymbol)
    });

    socket.on('startGame', ({ currentPlayer, board }) => {
      setCurrentPlayer(currentPlayer);
      setBoard(board);
    });

    socket.on('updateBoard', ({ board, currentPlayer }) => {
      setCurrentPlayer(currentPlayer);
      setBoard(board);
    });

    socket.on('winner', (message) => {
      setResult(message)
      setShowResultDialog(true);
      setTimeout(() => {
        navigate('/');
      }, 5000);
    });

    socket.on('playerHasLeft', (board) => {
      setCurrentPlayer('')
      setBoard(board)
    });

    socket.on('roomClosed', () => {
      setBoard(null);
      setCurrentPlayer('');
      setPlayerSymbol('');
    });

    return () => {
      socket.off('playerSymbol');
      socket.off('startGame');
      socket.off('updateBoard');
      socket.off('roomClosed');
      socket.off('playerHasLeft')
    };
  }, []);

  const makeMove = (index) => {
    if (currentPlayer !== playerSymbol || board[index] !== null) return;
    socket.emit('makeMove', { roomId: roomId, index, player: playerSymbol });
  };

  const handleExit = () => {
    socket.emit('leaveRoom', roomId);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow p-8 rounded-lg w-96">
        <h1 className="text-xl font-semibold mb-4">Tic Tac Toe Multiplayer</h1>
        {roomId ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Room: {roomId}</h2>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={handleExit}
            >
              Выйти
            </button>
            {board ? (
              <div>
                <p>Your Symbol: {playerSymbol}</p>
                <div className="grid grid-cols-3 gap-1">
                  {board.map((cell, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 p-8 flex items-center justify-center text-3xl font-semibold cursor-pointer"
                      onClick={() => makeMove(index)}
                      style={{ width: '100px', height: '100px' }}
                    >
                      {cell || ''}
                    </div>
                  ))}
                </div>
                <p className="mt-4">Current Player: {currentPlayer}</p>
              </div>
            ) : (
              <p>Waiting for the other player...</p>
            )}
            {showResultDialog && (
              <ResultDialog timeRemaining={5} result={result} navigateToMain={navigate} />
            )}
          </div>
        ) : (
          <p>Joining the room...</p>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
