import React, { useState, useRef, useEffect } from 'react';
import Chat from '../ChatSection/Chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneLines, faRightLong, faPaperclip } from '@fortawesome/free-solid-svg-icons';

export default function Homepage() {
  const [textareaValue, setTextareaValue] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // For file attachment
  const [recording, setRecording] = useState(false); // For mic button
  const [messages, setMessages] = useState([]); // Current chat messages
  const [chatHistory, setChatHistory] = useState([]); // Array to store all chat sessions
  const [activeChatIndex, setActiveChatIndex] = useState(null); // For viewing previous chats
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const newHeight = Math.min(textareaRef.current.scrollHeight, 300); // Limit to max height of 300px
      textareaRef.current.style.height = `${newHeight}px`; // Set new height
      setExpanded(newHeight > 50); // Adjust threshold as needed
    }
  }, [textareaValue]);

  const handleChange = (e) => {
    setTextareaValue(e.target.value);
  };

  // Handle file attachment
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log('File selected:', file);
  };

  // Handle send chat button click
  const handleSendClick = () => {
    if (textareaValue.trim()) {
      const newMessage = { sender: 'USER', text: textareaValue };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Simulate bot response
      setTimeout(() => {
        const botMessage = { sender: 'GPT', text: 'This is a bot response.' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000);

      setTextareaValue('');
    } else {
      console.log('Cannot send an empty message');
    }
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter is pressed and Shift is not held
      e.preventDefault(); // Prevent the default newline behavior
      handleSendClick(); // Trigger the send message logic
    }
  };

  // Handle microphone button click
  const handleMicClick = () => {
    if (recording) {
      console.log('Stopping recording...');
    } else {
      console.log('Starting recording...');
    }
    setRecording(!recording);
  };

  // Handle new chat button click
  const handleNewChatClick = () => {
    if (messages.length > 0) {
      // Save current chat session to chat history
      setChatHistory((prevChatHistory) => [...prevChatHistory, messages]);
    }
    setMessages([]); // Clear the current messages for a new chat
    setTextareaValue(''); // Clear the textarea
    setActiveChatIndex(null); // Reset active chat view
  };

  // Handle view chat history
  const handleViewChatClick = (index) => {
    setMessages(chatHistory[index]); // Load the selected chat
    setActiveChatIndex(index); // Set the active chat index
  };

  return (
    <div className='flex flex-row h-screen'>
      {/* Sidebar */}
      <div className='col-md-2 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 shadow-2xl'>
        <div className='flex flex-col items-start'>
          <button
            className='text-lg font-semibold px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 rounded-md shadow-lg hover:shadow-xl transition'
            onClick={handleNewChatClick}
          >
            New Chat
          </button>
          <div className='mt-8'>
            <h2 className='text-lg font-semibold mb-4'>Previous Chats</h2>
            <ul className='flex flex-col gap-2'>
              {chatHistory.map((chat, index) => (
                <li key={index}>
                  <button
                    className='text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg w-[200px] hover:bg-gray-500 hover:text-white transition py-2 px-3'
                    onClick={() => handleViewChatClick(index)}
                  >
                    Chat {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex gap-2 position-absolute bottom-4'>
            <button
              className='text-lg font-semibold px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 rounded-md shadow-lg hover:shadow-xl transition'
            >
              About
            </button>
            <button
              className='text-lg font-semibold px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-md shadow-lg hover:shadow-xl transition'
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className='col-md-10 relative flex flex-col'>
        {/* Header Section */}
        <div className='flex justify-between'>
          <div className='flex justify-center items-center ms-3'>
            <h1 className='text-4xl font-bold text-gray-800 mb-6'>GPT</h1>
          </div>
          <div className='flex items-center justify-end p-6'>
            <div className='flex gap-6 justify-end'>
              <button className='px-6 py-2 text-lg font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 hover:shadow-xl transition'>
                Log In
              </button>
              <button className='px-6 py-2 text-lg font-semibold text-gray-800 rounded-full shadow-lg bg-gray-200 hover:scale-105 hover:shadow-xl transition'>
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section with fixed height and scrollbar */}
        <div className='flex items-center justify-center flex-grow bg-gradient-to-r from-gray-100 to-gray-300 shadow-lg pt-5 rounded-lg m-8 p-8 h-[500px] overflow-y-auto'>
          <Chat messages={messages} />
        </div>

        {/* Chat Input Section */}
        <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-3 transition-all duration-300 ${expanded ? 'rounded-lg' : 'rounded-full'} bg-white shadow-lg border border-gray-300 p-2 w-[700px]`}>
          <input
            type='file'
            className='hidden' // Hides the file input
            id='file-input'
            onChange={handleFileChange}
          />
          <label htmlFor='file-input' className='p-2 text-gray-600 hover:text-gray-900 transition cursor-pointer'>
            <FontAwesomeIcon icon={faPaperclip} size='lg' />
          </label>

          <textarea
            ref={textareaRef}
            value={textareaValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Add this event handler
            className='w-[590px] py-2 text-gray-800 border-none outline-none resize-none bg-transparent focus:ring-0 transition-all duration-300'
            rows='1'
            placeholder='Type your message...'
            style={{ maxHeight: '200px' }}
          />

          <button
            onClick={handleSendClick}
            className='md:h-[40px] absolute flex items-center justify-center end-2 bottom-2 md:w-[40px] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition'
          >
            <FontAwesomeIcon icon={faRightLong} size='lg' />
          </button>

          <button
            onClick={handleMicClick}
            className={`md:w-[50px] md:h-[50px] absolute end-[-60px] bottom-0 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition ${
              recording ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
          >
            <FontAwesomeIcon icon={faMicrophoneLines} size='lg' />
          </button>
        </div>
      </div>
    </div>
  );
}
