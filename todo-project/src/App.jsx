import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [todo, setTodo] = useState({
    text: "",
    description: "",
  });
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (todo.text === "" || todo.description === "") {
      alert("Write both your todo and description first");
    } else {
      setTasks([
        ...tasks,
        { text: todo.text, description: todo.description, done: false },
      ]);
      setTodo({ text: "", description: "" });
    }
  };

  const deleteItem = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const updateItem = (index) => {
    if (editIndex !== null && todo.text !== "") {
      const updatedTasks = tasks.map((task, i) =>
        i === editIndex
          ? { ...task, text: todo.text, description: todo.description }
          : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
      setTodo({ text: "", description: "" });
    } else {
      setEditIndex(index);
      setTodo(tasks[index]);
    }
  };

  const markAsDone = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  return (
    <div className="w-screen h-screen bg-violet-400">
      <h2 className="font-serif text-xl text-center text-black py-4">
        <span className="text-5xl">DOINGLY</span> WILL MANAGE YOUR DAILY TASKS
      </h2>
      <div className="todoDiv w-[45%] h-auto py-2 mt-6 ml-3 opacity-85">
        <form className="mt-2" onSubmit={addTask}>
          <input
            name="text"
            value={todo.text}
            onChange={handleChange}
            type="text"
            placeholder="Enter To Do Here ✍"
            className="pr-52 pl-2 py-3 text-black placeholder:text-black border-2
            border-blue-400 rounded-lg ml-2"
            required
          />
          <textarea
            name="description"
            value={todo.description}
            onChange={handleChange}
            placeholder="Enter Description"
            className="pr-56 pl-2 py-3 text-black placeholder:text-black border-2
          border-blue-400 rounded-lg ml-2 mt-2 resize-none"
            required
          ></textarea>
          <br />
          <button
            type="submit"
            className="bg-blue-400 px-6 py-2 border-2 border-white ml-3 rounded-lg text-white mt-3"
          >
            Add
          </button>
          <button
            type="button"
            className="bg-red-400 px-6 py-2 border-2 border-white ml-3 rounded-lg text-white"
            onClick={clearAllTasks}
          >
            Clear All
          </button>

          <input
            type="radio"
            id="hide"
            className="ml-3 "
            style={{ transform: "scale(1.5)" }}
          />
          <label htmlFor="hide" className="ml-2 text-lg">
            Hide Completed Tasks
          </label>
        </form>

        {/* Displaying List Of Tasks */}
        <ul className="flex flex-col">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`bg-white m-3 p-2 inline-block rounded self-start font-bold ${
                task.done ? "line-through " : ""
              }`}
            >
              <h5>{task.text}</h5>
              {task.description}

              <button
                className="bg-white p-2 rounded text-blue-400 font-bold ml-2 text-xl"
                onClick={() => updateItem(index)}
              >
                {editIndex === index ? (
                  <i class="fa-solid fa-check"></i>
                ) : (
                  <i class="fa-regular fa-pen-to-square"></i>
                )}
              </button>
              <button
                className="bg-white p-2 rounded text-red-400 font-bold ml-1 text-xl"
                onClick={() => deleteItem(index)}
              >
                <i class="fa-solid fa-trash"></i>
              </button>
              <button
                className="bg-white p-2 rounded text-green-600 font-bold ml-1 text-xl"
                onClick={() => markAsDone(index)}
              >
                {task.done ? (
                  <i class="fa-solid fa-rotate-left"></i>
                ) : (
                  <i class="fa-regular fa-circle-check"></i>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
