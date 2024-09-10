import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

export default function Coding({ messages = [], darkMode }) {
  // Function to handle text-to-speech
  const speakMessage = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Google US English'); // Optionally set a specific voice
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`w-full h-full rounded-xl overflow-auto p-4 ${
        darkMode
          ? 'bg-gray-800 text-gray-200 scrollbar-thumb-gray-700 scrollbar-track-gray-600'
          : 'bg-gray-100 text-gray-900 scrollbar-thumb-gray-300 scrollbar-track-gray-200'
      } scrollbar-thin`}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className={`text-3xl font-bold text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            This is the Coding Section!<br/>
            Start a conversation to get started...
          </p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {message.sender === 'GPT' && (
              <div className="flex items-center justify-center mr-3">
                <div
                  className={`${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-700 to-blue-800'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  } text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl`}
                >
                  GPT
                </div>
              </div>
            )}

            <div
              className={`p-2 px-3 rounded-lg shadow-lg max-w-[60%] break-words whitespace-normal ${
                message.sender === 'USER'
                  ? darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-gray-200'
                    : 'bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800'
                  : darkMode
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-blue-200'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-blue-800'
              }`}
            >
              {message.text}
            </div>

            {message.sender === 'USER' && (
              <div className="flex items-center justify-center ml-3">
                <div
                  className={`${
                    darkMode
                      ? 'bg-gradient-to-r from-green-700 to-green-800'
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  } text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl`}
                >
                  USER
                </div>
              </div>
            )}

            {message.sender === 'GPT' && (
              <button
                className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                onClick={() => speakMessage(message.text)}
              >
                <FontAwesomeIcon icon={faVolumeHigh} size="lg" />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
