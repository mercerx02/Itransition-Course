import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

const NavBar = ({ onSaveNickname, storedNickname }) => {
  const [inputNickname, setInputNickname] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSaveNickname(inputNickname);
      setInputNickname('');
    }
  };

  return (
    <nav className="bg-black p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="logo.jpg" alt="Company Logo" className="h-10 w-10" />
        <h1 className="text-white text-lg font-semibold">Itransition Game Platform</h1>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Введите никнейм"
          value={inputNickname}
          onChange={(e) => setInputNickname(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-300"
        />
        {storedNickname ? (
          <p className="text-white">{storedNickname}</p>
        ) : (
          <p className="text-white">Unknown player</p>
        )}
        <a
          href="https://github.com/mercerx02"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-300"
        >
          <FaGithub className="h-6 w-6" />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
