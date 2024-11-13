import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DailyTodos = () => {
  const [todo, setTodo] = useState({
    text: "",
    description: "",
    time: "",
    priority: "",
  });
  const { text, description, time, priority } = todo;

  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [hideDoneTasks, setHideDoneTasks] = useState(false);
  const [todayTask, setTodayTask] = useState([]);

  const fetchTodaysTask = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/todayTask");
      console.log(response.data.message);
      if (response.data.success) {
        setTodayTask(response.data.todayTodo);
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching today's tasks:", err);
    }
  };

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8082/api/todo", todo);
      if (response.data.success) {
        setTasks((prevTasks) => [...prevTasks, response.data.todo]);
        setTodo({
          text: "",
          description: "",
          time: "",
          priority: "",
        });
        toast.success(response.data.message);
        fetchTodaysTask();
      }
    } catch (err) {
      toast.error("Failed to add task");
    }
    console.log(todo);
  };

  const deleteItem = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const updateItem = (index) => {
    if (editIndex !== null && todo.text !== "") {
      const updatedTasks = tasks.map((task, i) =>
        i === editIndex
          ? {
              ...task,
              text: text,
              description: description,
              time: time,
              priority: priority,
            }
          : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
      setTodo({ text: "", description: "", time: "", priority: "" });
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
      timeZone: "Asia/Karachi",
    });
  };

  useEffect(() => {
    fetchTodaysTask();
  }, []);

  console.log(todayTask);
  return (
    <>
      <div className={`w-full bg-purple-500`}>
        <div
          className={`todoDiv w-[45%] py-2 ml-3 opacity-85 h-auto
            ${tasks.length === 0 ? "h-auto " : "h-auto"}`}
        >
          <form className="mt-2" onSubmit={onSubmit}>
            <input
              name="text"
              value={text}
              onChange={handleChange}
              type="text"
              placeholder="Enter To Do Here ✍"
              className="pr-52 pl-2 py-3 text-black placeholder:text-black border-4
          border-blue-500 rounded-lg ml-2"
              required
            />
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="pr-56 pl-2 py-3 text-black placeholder:text-black border-4
          border-blue-500 rounded-lg ml-2 mt-2 resize-none"
              required
            ></textarea>
            <br />

            <label
              htmlFor="time"
              className="ml-2 text-base border-4
          border-blue-500 rounded-lg px-3 py-2 bg-white mb-3"
            >
              Set Deadline For Your Task
            </label>
            <input
              type="time"
              name="time"
              defaultValue="12:00"
              id="time"
              onChange={handleChange}
              placeholder="Select Time"
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 px-4 text-black mb-3"
            />
            <br />

            <select
              name="priority"
              value={priority}
              onChange={handleChange}
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 pr-3 pl-1 text-black text-center text-sm"
            >
              <option value="" disabled hidden>
                Select Priority
              </option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
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

      {todayTask.length === 0 ? (
        <div className="h-[42vh] bg-purple-500">
          <p className="bg-purple-500 w-full flex items-center justify-start pl-10 text-xl text-white pt-5 ">
            No tasks Available ❗
          </p>
        </div>
      ) : (
        <div className="bg-purple-500 flex justify-start">
          <ul className="flex flex-row gap-2 flex-wrap items-center ml-2 mt-2 rounded-lg w-1/2">
            {todayTask
              .filter((task) => !hideDoneTasks || !task.done)
              .map((task, index) => (
                <li
                  key={index}
                  className={`my-1 py-3 rounded-lg self-start font-bold w-fit px-6
    shadow-sm shadow-white 
    ${
      task.done
        ? "bg-slate-300 line-through"
        : task.priority === "High"
        ? "bg-red-400"
        : task.priority === "Medium"
        ? "bg-yellow-300"
        : task.priority === "Low"
        ? "bg-green-400"
        : "bg-blue-400"
    }`}
                >
                  <div className="flex flex-col justify-center items-start ">
                    <div className="flex flex-col gap-3 items-start">
                      {/* Title of todo is showing */}
                      <p className="text-base">{task.text}</p>

                      {/* Description of todo is showing */}
                      <p className="text-base text-gray-700 ">
                        {task.description}
                      </p>

                      {/* Deadline is showing */}
                      {task.time && task.time != "12:00" ? (
                        <p className="text-base text-gray-600 ">
                          <span className="text-xl">🕐</span>
                          {formatTime(task.time)}
                        </p>
                      ) : (
                        <p className="text-base text-gray-600 ">
                          <span className="text-xl">🕐</span>
                          No dedline set
                        </p>
                      )}
                      {/* Priority is showing */}
                      <p>{task.priority || "No priority set"}</p>
                    </div>

                    <div className=" text-center mt-2">
                      <button
                        className="bg-white px-2 rounded text-blue-400 font-bold text-base"
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
                      <button
                        type="button"
                        className="rounded px-2 bg-white ml-1 text-base text-red-600"
                        onClick={() => startDeadlineAlert(index)} // Pass the index here
                      >
                        <i class="fa-solid fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default DailyTodos;
