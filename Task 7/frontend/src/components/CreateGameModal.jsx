import React, { useState } from 'react';

const CreateGameModal = ({ isOpen, onClose, onCreate }) => {
  const [selectedGame, setSelectedGame] = useState('Tic Tac Toe');

  const createGame = () => {
    onCreate(selectedGame);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <div className="bg-gray-800 rounded-lg p-4 w-64">
        <h3 className="text-lg font-semibold mb-2 text-white">Выберите игру</h3>
        <select
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
        >
          <option value="Tic Tac Toe">Tic Tac Toe</option>
          <option value="Math Game">Math Game</option>
        </select>
        <div className="mt-2 flex justify-end">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={createGame}
          >
            Создать
          </button>
          <button
            className="ml-2 px-3 py-1 bg-gray-300 text-gray-600 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGameModal;
