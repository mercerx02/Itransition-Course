import React, { useEffect, useState } from 'react';
import CreateGameModal from './CreateGameModal';
import { useNavigate } from 'react-router-dom';

const GameSection = ({setRoomId, storedNickname}) => {

  const [gameLobbies, setGameLobbies] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/lobbies`);
        if (response.ok) {
          const lobbiesData = await response.json();
          setGameLobbies(lobbiesData);
        }
      } catch (error) {
        console.error('Error fetching lobbies:', error);
      }
    };

    const intervalId = setInterval(fetchLobbies, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createGame = async (selectedGame) => {
    const room_id = Date.now()
    setRoomId(room_id)
    const newLobby = {
      id: room_id,
      creator: storedNickname,
      game: selectedGame,
      state: false
    };

    try {
      const response = await fetch(`${process.env.API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLobby),
      });

      if (response.ok) {
        console.log('Lobby created successfully');
        if(selectedGame === 'Tic Tac Toe'){
          navigate('/tictactoe')
        }
        else{
          navigate('/mathgame')
        }
      } else {
        console.error('Failed to create lobby');
      }
    } catch (error) {
      console.error('Error creating lobby:', error);
    }


    closeModal();
  };
  const joinGame = (roomId, game) =>{

    setRoomId(roomId)
    if(game ==='Tic Tac Toe'){
    navigate('/tictactoe')
    }
    else{
      navigate('/mathgame')
    }


  }

  return (
    <div className="bg-white p-4 mt-4 shadow-lg rounded-lg">
      <h2 className="text-black text-lg font-semibold mb-2">Игровые лобби</h2>
      <button
  className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
  onClick={openModal}
>
  <span className="flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="h-5 w-5 mr-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
    Создать игру
    </span>
    </button>
      <CreateGameModal isOpen={isModalOpen} onClose={closeModal} onCreate={createGame} />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Никнейм создателя</th>
              <th className="p-2 text-left">Игра</th>
              <th className="p-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {gameLobbies.map((lobby) => (
              <tr key={lobby.id} className="hover:bg-gray-200">
                <td className="p-2">{lobby.id}</td>
                <td className="p-2">{lobby.creator}</td>
                <td className="p-2 flex items-center">
                {lobby.game === 'Tic Tac Toe' ? (
                  <img
                    src="tictactoe.png"
                    alt="Tic Tac Toe Icon"
                    className="h-8 w-8 mr-1"
                  />
                ) : (
                  <img
                    src="mathgame.png"
                    alt="Math Game Icon"
                    className="h-8 w-8 mr-1"
                />
                )}
                {lobby.game}
              </td>
                <td className="p-2">
                <button
                    disabled={lobby.state}
                    className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={() => joinGame(lobby.id, lobby.game)}
                  >
                    Войти
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameSection;
