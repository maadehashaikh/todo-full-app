import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DailyTodos from "./components/Todo/DailyTodo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Profile from "./components/Auth/Profile";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<DailyTodos />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
