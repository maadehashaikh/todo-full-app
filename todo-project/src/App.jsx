import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [todo, setTodo] = useState({
    text: "",
    description: "",
    time: "",
  });
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [hideDoneTasks, setHideDoneTasks] = useState(false);

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
        {
          text: todo.text,
          description: todo.description,
          time: todo.time,
          done: false,
        },
      ]);
      setTodo({ text: "", description: "", time: "" });
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
      setTodo({ text: "", description: "", time: "" });
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

  const handleCheckboxChange = (event) => {
    console.log(event);
    setHideDoneTasks(event.target.checked);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Karachi", // Pakistan Standard Time
    });
  };

  // Function to start checking deadlines when button is clicked
  function startDeadlineAlert(index) {
    console.log(index);
  }

  return (
    <>
      <div className="w-full h-screen bg-violet-400 ">
        <h2 className="font-serif text-xl text-center text-black py-4">
          <span className="text-5xl">DOINGLY</span> WILL MANAGE YOUR DAILY TASKS
        </h2>
        <div className="todoDiv w-[45%] h-auto py-2 mt-6 ml-3 opacity-85 ">
          <form className="mt-2" onSubmit={addTask}>
            <input
              name="text"
              value={todo.text}
              onChange={handleChange}
              type="text"
              placeholder="Enter To Do Here ✍"
              className="pr-52 pl-2 py-3 text-black placeholder:text-black border-4
          border-blue-500 rounded-lg ml-2"
              required
            />
            <textarea
              name="description"
              value={todo.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="pr-56 pl-2 py-3 text-black placeholder:text-black border-4
          border-blue-500 rounded-lg ml-2 mt-2 resize-none"
              required
            ></textarea>
            <br />

            <label
              htmlFor="time"
              className="ml-3 text-base border-4
          border-blue-500 rounded-lg px-3 py-2 bg-white"
            >
              Set Deadline For Your Task
            </label>
            <input
              type="time"
              name="time"
              id="time"
              value={todo.time}
              onChange={handleChange}
              placeholder="Select Time"
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 px-4 text-black"
            />
            <br />
            <button
              className="ml-3 border-4 border-blue-500 rounded-lg py-2 px-4 text-black bg-white mt-1 "
              onClick={() => startDeadlineAlert(index)}
            >
              Time’s Up Alert ⏰
            </button>
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
              type="checkbox"
              id="hide"
              className="ml-3 "
              style={{ transform: "scale(1.5)" }}
              checked={hideDoneTasks}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="hide" className="ml-2 text-lg">
              Hide Completed Tasks
            </label>
          </form>
        </div>
      </div>

      <div className="bg-violet-400 w-full flex justify-start ">
        <ul className="overflow-y-auto max-h-[400px] w-[45%] flex flex-col items-center px-4 mt-2 rounded-lg">
          {tasks
            .filter((task) => !hideDoneTasks || !task.done)
            .map((task, index) => (
              <li
                key={index}
                className={`m-1 py-3 px-3 rounded-lg self-start font-bold w-full max-w-[90%] bg-blue-300 shadow-sm shadow-white ${
                  task.done ? "bg-yellow-300 line-through " : "bg-blue-400 "
                }`}
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                <div className="flex flex-row justify-center items-center">
                  <div className="flex flex-row gap-3 items-center">
                    <p className="text-base text-center">{task.text}</p>
                    <p className="text-base text-gray-700 text-center">
                      {task.description}
                    </p>
                    {task.time && (
                      <p className="text-base text-gray-600 text-center">
                        🕐{formatTime(task.time)}
                      </p>
                    )}
                  </div>
                  <div className=" text-center">
                    <button
                      className="bg-white px-2 rounded text-blue-400 font-bold ml-2 text-base"
                      onClick={() => updateItem(index)}
                    >
                      {editIndex === index ? (
                        <i class="fa-solid fa-check"></i>
                      ) : (
                        <i class="fa-regular fa-pen-to-square"></i>
                      )}
                    </button>
                    <button
                      className="bg-white px-2 rounded text-red-400 font-bold ml-1 text-base"
                      onClick={() => deleteItem(index)}
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                    <button
                      className="bg-white px-2 rounded text-green-600 font-bold ml-1 text-base"
                      onClick={() => markAsDone(index)}
                    >
                      {task.done ? (
                        <i class="fa-solid fa-rotate-left"></i>
                      ) : (
                        <i class="fa-regular fa-circle-check"></i>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default App;
