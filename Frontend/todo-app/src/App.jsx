import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DailyTodos from "./components/Pages/DailyTodos";
import Home from "./components/Pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TodoHistory from "./components/Pages/TodoHistory";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/DailyTodo" element={<DailyTodos />}></Route>
        <Route path="/TodoHistory" element={<TodoHistory />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
