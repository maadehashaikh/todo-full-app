// src/pages/Profile.js

import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Adjust the path if necessary
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl text-center relative">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <span className="text-5xl font-bold text-white uppercase">
              {user.name.charAt(0)}
            </span>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mt-16">
          Welcome, {user.name}!
        </h2>
        <p className="text-gray-600 text-lg mt-4">
          Email: <span className="font-medium">{user.email}</span>
        </p>
        <div className="mt-8 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 shadow-md transition duration-300 text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
