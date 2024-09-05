import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneLines, faRightLong, faPaperclip } from '@fortawesome/free-solid-svg-icons';

export default function Homepage() {
  const [textareaValue, setTextareaValue] = useState('');
  const [expanded, setExpanded] = useState(false);
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

  return (
    <>
    <div className=' row'>
      <div className=' col-md-2 bg-slate-400'>
        <div className='flex items-start justify-center md:mt-3'>
        <h1 className='text-5xl font-extrabold '>GPT</h1>
        </div>
        <div className='mt-4 '>
          <button className='text-xl font-bold ms-3'>New Chat</button>
        </div>
    
        <div className='absolute left-0 right-0 flex mt-4 bottom-10'>
          <button className='text-xl font-bold ms-3'>Setting</button>
          <button className='text-xl font-bold ms-3'>about</button>
        </div>

      </div>
   
      <div className='relative mx-auto pe-0 me-0 col-md-10'>
        {/* Header Section */}
        <div className='flex items-center justify-end'>
        
          <div className='flex gap-4 me-[50px] mt-[20px]'>
            <button className='px-8 py-3 text-lg font-semibold text-white transition duration-300 rounded-full shadow-md bg-gradient-to-r from-gray-700 to-gray-900 hover:bg-black'>
              Log In
            </button>
            <button className='px-8 py-3 text-lg font-semibold text-black transition duration-300 rounded-full shadow-md bg-gradient-to-r from-gray-300 to-gray-400 hover:bg-gray-500'>
              Sign Up
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className=' md:h-[685px] md:ms-[100px] md:me-[120px]  rounded-lg shadow-2xl mt-8 flex items-center justify-center'>
          <h1 className='text-3xl font-semibold text-center text-black md:text-4xl'>
            How can I assist you today?
          </h1>
        </div>

        {/* Chat Input Section */}
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-row items-center gap-2 ${expanded ? 'rounded-3' : 'rounded-full'}`}>
          <div className={`relative bg-white border mb-5 border-gray-300 shadow-lg py-3 px-6 flex items-center gap-4 w-full md:w-[750px] ${expanded ? 'rounded-3xl' : 'rounded-full'}`}>
            <button className='absolute left-0 mb-2 ml-3 text-gray-900 transition bottom-1 me-4 hover:text-black hover:scale-125'>
              <FontAwesomeIcon icon={faPaperclip} />
            </button>
            <div className='flex flex-col flex-grow '>
              <textarea
                ref={textareaRef}
                value={textareaValue}
                onChange={handleChange}
                className='w-full md:w-[650px] overflow-auto text-gray-800 border-none outline-none resize-none mx-3  focus:ring-0'
                rows='1'
                placeholder='Type your message here...'
                style={{ maxHeight: '200px' }} // Limit height
              />
            </div>
            <button className='text-gray-700 bg-gray-200 hover:scale-105 md:w-[40px] md:h-[40px] rounded-full hover:bg-gray-300 transition absolute bottom-0 right-0 mr-3 mb-2'>
              <FontAwesomeIcon icon={faRightLong} />
            </button>
          </div>
          <button className='bg-blue-600 absolute bottom-11 right-0 left-[760px] mr-3 mb-2 text-white md:w-[50px] md:h-[50px] rounded-full shadow-lg hover:bg-blue-700 transition'>
            <FontAwesomeIcon icon={faMicrophoneLines} />
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
