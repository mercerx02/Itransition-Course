import React, { useEffect, useState } from 'react';

const ResultDialog = ({ result, timeRemaining, navigateToMain }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(timeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        clearInterval(interval);
        navigateToMain();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [secondsRemaining, navigateToMain]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Game Results</h2>
        <ul className="mb-4">
          {typeof result === 'object' ? (
            Object.entries(result).map(([playerId, playerInfo]) => (
              <li key={playerId} className="mb-2">
                <span className="font-semibold">{playerInfo.nickname}:</span> {playerInfo.score}
              </li>
            ))
          ) : (
            <li>{result}</li>
          )}
        </ul>
        <p className="text-center">
          Returning to the main page in {secondsRemaining} seconds...
        </p>
      </div>
    </div>
  );
};

export default ResultDialog;
