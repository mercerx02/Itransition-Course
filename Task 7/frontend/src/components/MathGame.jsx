import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import ResultDialog from './ResultDialog';

const socket = io(`${process.env.API_URL}`, {
  transports: ['websocket'],
});

const MathGame = ({ roomId , storedNickname}) => {
  const [equation, setEquation] = useState(null);
  const [playerScores, setPlayerScores] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const navigate = useNavigate();
  const [showResultDialog, setShowResultDialog] = useState(false);

  useEffect(() => {
    socket.emit('joinMathGameRoom', { roomId, nickname: storedNickname });


    socket.on('nextMathEquation', ({ equation, scores }) => {
      setEquation(equation);
      setPlayerScores(scores);
      setCurrentAnswer('');
    });

    socket.on('endMathGame', ({ scores }) => {
        setPlayerScores(scores);
        setShowResultDialog(true);
        setTimeout(() => {
          navigate('/');
        }, 5000);
      });

    socket.on('updateMathScores', (scores) => {
      setPlayerScores(scores);
    });


    socket.on('playerHasLeft', ()=>{
        setEquation(null)
        setCurrentAnswer('')
    })

    return () => {
      socket.off('startMathGame');
      socket.off('nextMathEquation');
      socket.off('endMathGame');
      socket.off('updateMathScores');
      socket.off('playerHasLeft')
    };
  }, []);

  const answerEquation = () => {
    socket.emit('answerMathEquation', { roomId, answer: currentAnswer });
  };


  const leaveRoom = () => {
    socket.emit('leaveMathGameRoom', roomId);
    navigate('/');
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        socket.emit('answerMathEquation', { roomId, answer: currentAnswer });
        setCurrentAnswer('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow p-8 rounded-lg w-96">
        <h1 className="text-xl font-semibold mb-4">Math Game Multiplayer</h1>
        {roomId ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Room: {roomId}</h2>
            <button
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={leaveRoom}
                >
                  Leave
            </button>
            {equation === null ? (
              <p>Waiting for the second player...</p>
            ) : (
              <div>
                <div>
                  {equation.question && <p className="text-lg">{equation.question}</p>}
                  <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="mt-2 p-2 border"
                    onKeyPress={handleKeyPress}

                  />

                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Player Scores:</h3>
                    <ul>
                        {Object.entries(playerScores).map(([playerId, playerInfo]) => (
                        <li key={playerId}>
                            {playerInfo.nickname}: {playerInfo.score}
                        </li>
                        ))}
                    </ul>
                </div>

              </div>
            )}
            {showResultDialog && (
              <ResultDialog timeRemaining={5} result={playerScores} navigateToMain={navigate} />
            )}
          </div>
        ) : (
          <p>Joining the room...</p>
        )}
      </div>
    </div>
  );
};

export default MathGame;
