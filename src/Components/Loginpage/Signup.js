import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Signup({ darkMode }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullname || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      console.log('Signing up with:', { fullname, email, password });
      setLoading(false);
      setError('');
    }, 2000);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Signing up with ${provider}`);
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
      <motion.div
        className={`w-full max-w-lg p-10 rounded-2xl shadow-2xl border border-gray-300 transition-transform transform hover:scale-105 duration-300 ease-in-out ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
         <Link to='/'>
          <button className='ms-2 text-2xl'>
          <i class="fa fa-arrow-left" aria-hidden="true" ></i>
          </button>
          </Link>
         </div>
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sign Up
        </motion.h2>

        {error && (
          <motion.p
            className="text-red-500 text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullname" className="block mb-2 text-lg font-semibold">Full Name</label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out`}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-lg font-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out`}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-lg font-semibold">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out`}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-lg font-semibold">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out`}
              placeholder="Confirm your password"
              required
            />
          </div>
          <motion.button
            type="submit"
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Sign Up'}
          </motion.button>
        </form>

        <div className="flex justify-center gap-6 mt-8">
          {[
            { icon: faGoogle, color: 'from-red-500 to-red-600', label: 'Google' },
            { icon: faFacebook, color: 'from-blue-600 to-blue-700', label: 'Facebook' },
            { icon: faTwitter, color: 'from-blue-400 to-blue-500', label: 'Twitter' },
            { icon: faLinkedin, color: 'from-blue-800 to-blue-900', label: 'LinkedIn' }
          ].map(({ icon, color, label }) => (
            <motion.button
              key={label}
              onClick={() => handleSocialLogin(label)}
              className={`p-2 bg-gradient-to-r ${color} text-white rounded-full shadow-lg hover:from-${color.split(' ')[1]} hover:to-${color.split(' ')[2]} focus:outline-none focus:ring-4 focus:ring-${color.split('-')[1]}-300 transition duration-300 ease-in-out`}
              aria-label={`Sign up with ${label}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={icon} size='2xl' />
            </motion.button>
          ))}
        </div>
        <div className="flex items-center justify-center my-2">
          <hr className='border-black border-2 bg-black w-full' />
          <span className="text-gray-600 mx-2">or</span>
          <hr className='border-black border-2 bg-black w-full' />
        </div>
        <div className="items-center flex flex-col justify-center">
          <Link to='/login'>
            <button className='px-10 py-3 text-lg font-semibold text-white rounded-full shadow-lg bg-red-500 hover:scale-105 hover:shadow-xl transition'>
              Log In
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
