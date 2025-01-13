import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust the import path as needed

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 flex items-center justify-around py-3 px-5">
      <div>
        <Link to="/">
          <h2 className="text-2xl text-gray-800 font-sans font-bold">
            Doingly
          </h2>
        </Link>
      </div>
      <div>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {user ? user.name : 'Account'}
          <i className="fa-solid fa-chevron-down ml-2"></i>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fa-solid fa-user mr-2"></i> Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <i className="fa-solid fa-sign-out-alt mr-2"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fa-solid fa-sign-in-alt mr-2"></i> Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fa-solid fa-user-plus mr-2"></i> Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
