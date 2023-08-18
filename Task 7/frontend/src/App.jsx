import React, { useState } from 'react';
import GameSection from './components/GameSection';
import NavBar from './components/NavBar';
import TicTacToe from './components/TicTacToe';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MathGame from './components/MathGame';

function App() {
  const [roomId, setRoomId] = useState(null);
  const [storedNickname, setStoredNickname] = useState(
    localStorage.getItem('nickname') || ''
  );

  const handleSaveNickname = (newNickname) => {
    setStoredNickname(newNickname);
    localStorage.setItem('nickname', newNickname);
  };

  return (
    <Router>
      <NavBar onSaveNickname={handleSaveNickname} storedNickname={storedNickname} />
      <Routes>
        <Route
          Route
          path="/"
          element={<GameSection setRoomId={setRoomId} storedNickname={storedNickname} />}
        />
        <Route
          Route
          path="/tictactoe"
          element={<TicTacToe roomId={roomId} storedNickname={storedNickname} />}
        />
        <Route
          Route
          path="/mathgame"
          element={<MathGame roomId={roomId} storedNickname={storedNickname}/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
