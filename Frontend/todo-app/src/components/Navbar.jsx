import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="bg-purple-500 flex items-center justify-between py-3">
      <div>
        <h2 className="text-4xl text-white font-sans font-bold ml-5">
          Doingly
        </h2>
      </div>
      <div>
        <nav className="flex gap-4 text-white font-sans font-semibold">
          <Link to={"/"}>Home</Link>
          <Link to="/DailyTodo">SetGoals</Link>
          <Link to="/TodoHistory">TodoHistory</Link>
          <Link>WeeklyGoals</Link>
          <Link>YearlyGoals</Link>
        </nav>
      </div>
      <div>
        <button>Sign Up </button>
        <button>Login</button>
      </div>
    </div>
  );
};

export default Navbar;
