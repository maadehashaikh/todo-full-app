import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DailyTodos from "./components/Pages/DailyTodos";
import Home from "./components/Pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/DailyTodo" element={<DailyTodos />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
