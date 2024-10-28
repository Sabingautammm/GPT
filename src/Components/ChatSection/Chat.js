import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faSpinner } from '@fortawesome/free-solid-svg-icons';

const Message = ({ message, darkMode }) => {
  return (
    <div className={`flex items-end ${message.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'GPT' && (
        <div className="flex items-center mr-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 ${darkMode ? 'bg-gradient-to-r from-blue-700 to-blue-800' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
            <div className='rounded-full'> 
              <i className="fa-duotone fa-solid fa-robot"></i>
            </div>
          </div>
        </div>
      )}
      <div className={`p-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 max-w-[70%] break-words ${message.sender === 'USER' ? darkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-gray-200' : 'bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800' : darkMode ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-blue-200' : 'bg-gradient-to-r from-gray-200 to-gray-300 text-blue-800'}`}>
        {message.text && <p className="text-sm">{message.text}</p>}
        {message.image && (
          <img src={message.image.url} alt="User upload" className="max-h-48 rounded-md shadow-md mt-2" />
        )}
      </div>
      {message.sender === 'USER' && (
        <div className="flex items-center ml-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 ${darkMode ? 'bg-gradient-to-r from-green-700 to-green-800' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
            <div className='rounded-full'> 
              <i className="fa-solid fa-user"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Chat({ messages = [], darkMode }) {
  const [userInput, setUserInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const messagesEndRef = useRef(null);
  const [loadingVoices, setLoadingVoices] = useState(true);

  const isSpeechSynthesisSupported = window.speechSynthesis !== undefined;

  useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      setVoices(synth.getVoices());
      setLoadingVoices(false);
    };
    
    synth.addEventListener('voiceschanged', updateVoices);
    updateVoices();
    return () => synth.removeEventListener('voiceschanged', updateVoices);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakMessage = (text) => {
    if (isSpeaking || !text || !isSpeechSynthesisSupported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectedVoice || voices.find((v) => v.name.includes('Google')) || voices[0];
    
    if (!voice) {
      console.error("No voice found.");
      return; 
    }

    utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error('Speech synthesis error:', event.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (event) => {
    const selected = voices.find((v) => v.name === event.target.value);
    setSelectedVoice(selected);
  };

  // Function to simulate the bot sending a photo
  const sendPhotoMessage = () => {
    const photoMessage = {
      sender: 'GPT',
      image: { url: 'https://media.istockphoto.com/id/2149530993/photo/digital-human-head-concept-for-ai-metaverse-and-facial-recognition-technology.jpg?s=2048x2048&w=is&k=20&c=d23fZUtTjXCYd5V6wRB4-tdRzg7I7MWDQTTp8nHkl08=' }
    };
    
    // Add the photo message to the messages array
    messages.push(photoMessage);
  };

  const handleSendMessage = () => {
    // Check if the user's message is "send me a photo"
    if (userInput.toLowerCase() === 'send me a photo') {
      sendPhotoMessage();
    }

    // Clear the input field
    setUserInput('');
  };

  return (
    <div className={`h-[670px] w-full rounded-lg overflow-auto p-4 space-y-4 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-gray-200 scrollbar-thumb-gray-700 scrollbar-track-gray-600' : 'bg-gray-100 text-gray-900 scrollbar-thumb-gray-300 scrollbar-track-gray-200'} scrollbar-thin`}>
      {loadingVoices ? (
        <div className="flex items-center justify-center h-full">
          <p className={`text-xl font-bold text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading voices...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className={`text-3xl font-bold text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Start a conversation to get started...</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message key={index} message={message} darkMode={darkMode} />
        ))
      )}
      {isSpeaking && (
        <div className="flex items-center justify-center mt-4">
          <FontAwesomeIcon icon={faSpinner} spin size="sm" className={`mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Speaking...</p>
        </div>
      )}
      
    </div>
  );
}
