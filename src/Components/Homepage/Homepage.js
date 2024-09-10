import React, { useState, useRef, useEffect } from 'react';
import Chat from '../ChatSection/Chat';
import Coding from '../ChatSection/Coding'; // Assuming you have a similar component for Coding
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMicrophoneLines, faRightLong, faPaperclip } from '@fortawesome/free-solid-svg-icons';

export default function Homepage() {
  const [textareaValue, setTextareaValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // State for file preview
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [activeSection, setActiveSection] = useState('General'); // State for active section
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State for login status

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 300);
      textareaRef.current.style.height = `${newHeight}px`;
      setExpanded(newHeight > 50);
    }
  }, [textareaValue]);

  useEffect(() => {
    // Cleanup file preview URL when component unmounts or file changes
    return () => {
      if (filePreview && filePreview.url) {
        URL.revokeObjectURL(filePreview.url);
      }
    };
  }, [filePreview]);

  const handleChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the file
      const fileURL = URL.createObjectURL(file);
      setSelectedFile(file);
      setFilePreview({
        url: fileURL,
        type: file.type
      });
      console.log('File selected:', file);
    }
  };

  const handleSendClick = () => {
    if (textareaValue.trim()) {
      const newMessage = { sender: 'USER', text: textareaValue };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setTimeout(() => {
        const botMessage = { sender: 'GPT', text: 'This is a bot response.' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000);

      setTextareaValue('');
    } else {
      console.log('Cannot send an empty message');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleMicClick = () => {
    if (recording) {
      console.log('Stopping recording...');
    } else {
      console.log('Starting recording...');
    }
    setRecording(!recording);
  };

  const handleNewChatClick = () => {
    if (messages.length > 0) {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: activeSection, messages }
      ]);
    }
    setMessages([]);
    setTextareaValue('');
    setActiveChatIndex(null);
  };

  const handleViewChatClick = (index) => {
    setMessages(chatHistory[index].messages);
    setActiveChatIndex(index);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSectionChange = (section) => {
    if (messages.length > 0) {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: activeSection, messages }
      ]);
    }

    setMessages([]);
    setTextareaValue('');
    setActiveSection(section);
    setActiveChatIndex(null);
  };

  return (
    <div className={`flex flex-row h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`col-md-2 bg-gradient-to-b ${darkMode ? 'from-gray-800 to-gray-900' : 'from-gray-300 to-gray-400'} p-6 shadow-2xl`}>
        <div className='flex flex-col items-start'>
          <button
            className='text-lg font-semibold px-4 py-2 font-bold bg-gradient-to-r text-white from-gray-500 to-slate-800 rounded-md shadow-lg hover:shadow-xl transition'
            onClick={handleNewChatClick}
          >
            New Chat
          </button>
          {isLoggedIn && (
            <div className='mt-8'>
              <h2 className='text-lg font-bold mb-4'>Previous Chats</h2>
              <ul className='flex flex-col gap-2'>
                {chatHistory.map((chat, index) => (
                  <li key={index}>
                    <button
                      className='text-sm font-medium bg-gradient-to-r from-gray-600 text-white to-gray-700/50 backdrop:xl font-bold rounded-lg w-[200px] hover:bg-gray-500 hover:text-white transition py-2 px-3'
                      onClick={() => handleViewChatClick(index)}
                    >
                      {chat.type} Chat {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className='col-md-10 relative flex flex-col'>
        <div className='flex justify-between px-6 pt-6'>
          <div className='flex items-center ms-3'>
            <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              CHAT BOT
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <div className='relative flex justify-center'>
              <button
                className='px-4 py-2 bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition'
                type='button'
                id='dropdownMenuButton'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                MODE <FontAwesomeIcon icon={faChevronDown} />
              </button>
              <ul
                className='dropdown-menu absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg'
                aria-labelledby='dropdownMenuButton'
              >
                <li>
                  <button
                    onClick={() => handleSectionChange('General')}
                    className='block px-4 py-2 text-lg text-center font-semibold text-gray-900 dark:text-gray-800 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition'
                  >
                    General
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange('Coding')}
                    className='block px-4 py-2 text-lg font-semibold text-gray-900 dark:text-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition'
                  >
                    Coding
                  </button>
                </li>
              </ul>
            </div>

            <button
              onClick={toggleDarkMode}
              className='px-4 py-2 text-lg font-semibold rounded-full shadow-lg bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:scale-105 hover:shadow-xl transition'
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link to="/login">
              <button className='px-4 py-2 text-lg font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:scale-105 hover:shadow-xl transition'>
                Log In
              </button>
            </Link>
          </div>
        </div>

        <div className='flex items-center justify-center flex-grow bg-gradient-to-r from-gray-100 to-gray-300 shadow-lg pt-5 rounded-lg m-8 p-8 h-[500px] overflow-y-auto'>
          {activeSection === 'General' ? (
            <Chat messages={messages} darkMode={darkMode} />
          ) : (
            <Coding messages={messages} darkMode={darkMode} />
          )}
        </div>

        <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3 transition-all duration-300 ${expanded ? 'rounded-lg' : 'rounded-full'} ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border border-gray-300 p-2 w-[700px]`}>
          <input
            type='file'
            className='hidden'
            id='file-input'
            onChange={handleFileChange}
          />
          <label htmlFor='file-input' className='p-2 text-gray-600 hover:text-gray-900 transition absolute bottom-2 start-2 cursor-pointer'>
            <FontAwesomeIcon icon={faPaperclip} size='lg' />
          </label>

          {filePreview && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              {filePreview.type.startsWith('image/') ? (
                <img
                  src={filePreview.url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                  style={{ maxHeight: '200px' }}
                />
              ) : filePreview.type === 'application/pdf' ? (
                <embed
                  src={filePreview.url}
                  type="application/pdf"
                  className="w-full h-full"
                  style={{ maxHeight: '200px' }}
                />
              ) : (
                <div className="text-gray-600">
                  File: {filePreview.url.split('/').pop()}
                </div>
              )}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={textareaValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`w-[570px] py-2 ${darkMode ? 'text-gray-200 bg-transparent' : 'text-gray-800 bg-transparent'} border-none me-2 outline-none resize-none focus:ring-0 transition-all duration-300`}
            rows='1'
            placeholder='Type your message...'
            style={{ maxHeight: '200px' }}
          />

          <button
            onClick={handleSendClick}
            className={`md:h-[40px] absolute flex items-center justify-center end-2 bottom-2 md:w-[40px] ${darkMode ? 'bg-gradient-to-r from-gray-400 to-gray-700' : 'bg-gradient-to-r from-gray-400 to-gray-700'} text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition`}
          >
            <FontAwesomeIcon icon={faRightLong} size='lg' />
          </button>

          <button
            onClick={handleMicClick}
            className={`md:w-[50px] md:h-[50px] absolute end-[-60px] bottom-0.5 ${recording ? 'bg-red-500 hover:bg-red-600' : (darkMode ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-green-400 to-green-500')} text-white rounded-full shadow-lg hover:scale-105 transition`}
          >
            <FontAwesomeIcon icon={faMicrophoneLines} size='lg' />
          </button>
        </div>
      </div>
    </div>
  );
}
