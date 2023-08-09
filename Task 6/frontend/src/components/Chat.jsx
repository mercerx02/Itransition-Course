import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

const Chat = () => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/messages`);
        const data = await response.json();
        setChatMessages(data)
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);



  const handleTagAdd = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');

    }
  };

  const handleTagRemove = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        text: message,
        tags: [...selectedTags],
      };
      fetch(`${process.env.API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      })
      .then(response => response.json())
      .then(result => {
        console.log('Успешный ответ:', result);
      })
      .catch(error => {
        console.error('Ошибка при отправке запроса:', error);
      });


      setChatMessages([...chatMessages, newMessage]);
      setMessage('');
      setSelectedTags([]);
    }
  };

  const handleTagInput = (event) => {
    const inputTag = event.target.value;
    setTagInput(inputTag);
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedTags(newValue ? [...selectedTags, newValue] : selectedTags);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <h4>Панель моих тегов</h4>
          <ul className="list-group">
            {tags.map((tag, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {tag}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleTagRemove(tag)}
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Введите тег"
              value={tagInput}
              onChange={handleTagInput}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleTagAdd}
            >
              Добавить тег
            </button>
          </div>
        </div>
        <div className="col-md-8">
          <h4>Чат</h4>
          <div className="scrollable-div">
        {chatMessages.map((message, index) => {
    const lowerCaseTags = tags.map(tag => tag.toLowerCase());

    const hasMatchingTag = message.tags.length === 0 || message.tags.some(tag => lowerCaseTags.includes(tag.toLowerCase()));

    if (hasMatchingTag) {
      return (
        <div key={index} className="mb-3">
          <p>{message.text}</p>
          <div className="message-tags">
            {message.tags.map((tag, tagIndex) => (
              <Chip
                key={tagIndex}
                label={tag}
                variant="outlined"
                size="small"
                className="message-tag"
              />
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  })}
</div>

          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Введите сообщение"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleSendMessage}
              >
                Отправить
              </button>
            </div>
          </div>
          <div className="mt-3">
            <Autocomplete
              options={tags}
              onChange={handleAutocompleteChange}
              renderInput={(params) => <TextField {...params} label="Tags" />}
            />
          </div>
          <div className="mt-3">
            <h4>Выбранные теги</h4>
            <div>
              {selectedTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => {
                    setSelectedTags(selectedTags.filter((t) => t !== tag));
                  }}
                  className="mr-2"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
