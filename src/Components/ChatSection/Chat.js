import React from 'react';

export default function Chat({ messages = [] }) {
  return (
    <div className="w-full h-full overflow-auto p-4 bg-gray-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600 text-3xl font-bold">Start a conversation to get started!</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {message.sender === 'GPT' && (
              <div className="flex items-center justify-center mr-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl">
                  GPT
                </div>
              </div>
            )}

            <div
              className={`p-4 rounded-lg shadow-lg max-w-[60%] ${
                message.sender === 'USER' ? 'bg-gradient-to-r from-blue-200 to-blue-300 text-gray-800' : 'bg-gradient-to-r from-gray-200 to-gray-300 text-blue-800'
              } break-words whitespace-normal`}
            >
              {message.text}
            </div>

            {message.sender === 'USER' && (
              <div className="flex items-center justify-center ml-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl">
                  USER
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
