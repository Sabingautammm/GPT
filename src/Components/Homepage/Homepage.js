import React, { useState, useRef, useEffect, useCallback } from 'react';
import Chat from '../ChatSection/Chat';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMicrophoneLines, faRightLong, faPaperclip } from '@fortawesome/free-solid-svg-icons';

export default function Homepage() {
  const [textareaValue, setTextareaValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('General');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 300);
      textareaRef.current.style.height = `${newHeight}px`;
      setExpanded(newHeight > 50);
    }
  }, [textareaValue]);

  // Clean up URL object when component unmounts
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.url) {
        URL.revokeObjectURL(filePreview.url);
      }
    };
  }, [filePreview]);

  // Handlers using useCallback for optimized re-renders
  const handleChange = useCallback((e) => setTextareaValue(e.target.value), []);
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  }, [textareaValue, filePreview]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(file);
      setFilePreview({ url: fileURL, type: file.type });
    }
  }, []);

  const handleSendClick = useCallback(async () => {
    if (textareaValue.trim() || filePreview) {
      const newMessage = {
        sender: 'USER',
        text: textareaValue,
        image: filePreview ? { url: filePreview.url, type: filePreview.type } : null,
      };

      // Update messages state
      setMessages((prev) => [...prev, newMessage]);

      // Clear input and file preview
      setTextareaValue('');
      setFilePreview(null);
      setSelectedFile(null);

      // Send the message to the backend
      try {
        const response = await fetch('https://your-backend-url/api/chat', {  // Replace with your actual backend URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: newMessage.text }),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Add the bot response to the messages
        const botMessage = {
          sender: 'GPT',
          text: data.response,  // Assuming the backend returns { response: "..." }
          image: null,
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = {
          sender: 'GPT',
          text: 'Sorry, I could not process your request.',
          image: null,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  }, [textareaValue, filePreview]);

  const handleMicClick = () => setRecording((prev) => !prev);

  const handleNewChatClick = useCallback(() => {
    if (messages.length > 0) {
      setChatHistory((prev) => [...prev, { type: activeSection, messages }]);
    }
    setMessages([]);
    setTextareaValue('');
    setActiveChatIndex(null);
  }, [messages, activeSection]);

  const handleViewChatClick = useCallback((index) => {
    setMessages(chatHistory[index].messages);
    setActiveChatIndex(index);
  }, [chatHistory]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleSectionChange = useCallback((section) => {
    if (messages.length > 0) {
      setChatHistory((prev) => [...prev, { type: activeSection, messages }]);
    }
    setMessages([]);
    setTextareaValue('');
    setActiveSection(section);
    setActiveChatIndex(null);
  }, [messages, activeSection]);

  return (
    <div className={`flex flex-row h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'} transition-colors duration-500`}>
      {/* Sidebar */}
      <div className={`col-md-2 p-6 shadow-lg rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} flex flex-col`}>
        <button className='text-lg font-semibold px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300' onClick={handleNewChatClick}>
          New Chat
        </button>
        {isLoggedIn && (
          <div className='mt-8'>
            <h2 className='text-lg font-bold mb-4'>Previous Chats</h2>
            <ul className='flex flex-col gap-2 overflow-y-auto max-h-64'>
              {chatHistory.map((chat, index) => (
                <li key={index}>
                  <button className='text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition-all duration-300 py-2 px-3 shadow-md' onClick={() => handleViewChatClick(index)}>
                    Chat {index + 1} - {new Date().toLocaleDateString()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Chat Section */}
      <div className='col-md-10 relative flex flex-col'>
        <div className='flex justify-between px-6 pt-6'>
          <h1 className={`text-4xl font-bold mb-6 transition ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>CHAT BOT</h1>
          <div className='flex items-center gap-4'>
            <button onClick={toggleDarkMode} className='px-4 py-2 text-lg font-semibold rounded-full bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:scale-105 transition'>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link to="/login">
              <button className='px-4 py-2 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105 transition'>
                Log In
              </button>
            </Link>
          </div>
        </div>

        {/* Chat Messages */}
        <div className='flex-grow flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg p-6 m-8'>
          <Chat messages={messages} darkMode={darkMode} />
        </div>

        {/* Message Input Section */}
        <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-3 transition-all duration-300 ${expanded ? 'rounded-lg' : 'rounded-full'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border p-2 w-[90%] max-w-[700px]`}>
          <input type='file' className='hidden' id='file-input' onChange={handleFileChange} />
          <label htmlFor='file-input' className='p-2 text-gray-600 hover:text-gray-900 cursor-pointer absolute bottom-1 left-2'>
            <FontAwesomeIcon icon={faPaperclip} size='lg' />
          </label>
          <div className='flex flex-col'>
            {/* File Preview */}
            {filePreview && (
              <div className='flex items-center'>
                <img src={filePreview.url} alt='preview' className='w-10 h-10 object-cover rounded-md mr-2' />
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={textareaValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              rows={1}
              className={`resize-none border border-gray-300 rounded-lg p-2 focus:outline-none ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}
              placeholder='Type your message...'
            />
          </div>
          <button onClick={handleSendClick} className={`p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:scale-105 transition ${textareaValue.trim() || filePreview ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`} disabled={!textareaValue.trim() && !filePreview}>
            <FontAwesomeIcon icon={faRightLong} />
          </button>
          <button onClick={handleMicClick} className='p-2 text-gray-600 hover:text-gray-900'>
            <FontAwesomeIcon icon={faMicrophoneLines} size='lg' />
          </button>
        </div>
      </div>
    </div>
  );
}
