import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DailyTodos = () => {
  // All states
  const [todo, setTodo] = useState({
    text: "",
    description: "",
    time: "",
    priority: "",
    category: "daily",
    status: "pending",
  });
  const [todayTodo, setTodayTodo] = useState([]); // to fetch only current date's data
  const [tasks, setTasks] = useState([]); //stores the entire list of tasks fetched from the backend
  const [editIndex, setEditIndex] = useState(null); //keeps track of which specific task you are editing
  const [hideDoneTasks, setHideDoneTasks] = useState(false);

  useEffect(() => {
    CurrentDateTodo();
  }, []);

  // Destructring
  const { text, description, time, priority, category, status } = todo;

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8082/api/todos",
        todo
      );
      if (response.data.success) {
        setTasks((prevTasks) => [...prevTasks, response.data.todo]);
        setTodo({
          text: "",
          description: "",
          time: "",
          priority: "",
          category: "",
          status: "pending",
        });
        CurrentDateTodo();
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to add task");
    }
    console.log(todo);
  };

  const CurrentDateTodo = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/todos/today");
      setTodayTodo(response.data);
    } catch (err) {
      console.log("Error fetching today's todos:", err);
    }
  };
  // console.log(todayTodo.data);

  const deleteItem = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const updateItem = async (index) => {
    const task = tasks[index]; // Current task being edited

    if (editIndex !== null) {
      try {
        // Call the API to update the task in the database
        const response = await axios.put(
          `http://localhost:8082/api/todos/${task._id}`, // Assuming each task has a unique _id
          {
            text: todo.text,
            description: todo.description,
            time: todo.time,
            priority: todo.priority,
            category: todo.category,
            status: todo.status,
          }
        );

        // If the update is successful, update the task list in state
        const updatedTask = response.data.todo; // Get the updated task from API response
        const updatedTasks = tasks.map((task, i) =>
          i === editIndex ? updatedTask : task
        );

        setTasks(updatedTasks); // Update the task list in the state
        setEditIndex(null); // Reset the edit index
        setTodo({ text: "", description: "", time: "", priority: "" }); // Reset the todo input
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      // If not in edit mode, set the task data to edit
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

  const statusCheck = () => {
    console.log(status);
  };

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
              className="ml-2 text-base border-4
          border-blue-500 rounded-lg px-3 py-2 bg-white mb-3"
            >
              Set Deadline For Your Task
            </label>
            <input
              type="time"
              name="time"
              // defaultValue="12:00"
              value={todo.time}
              id="time"
              onChange={handleChange}
              placeholder="Select Time"
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 px-4 text-black mb-3"
            />
            <br />
            {/* Set Priority  */}
            <select
              name="priority"
              value={todo.priority}
              onChange={handleChange}
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 pr-3 pl-2 text-black 
              text-center text-sm"
            >
              <option value="" disabled hidden>
                Select Priority
              </option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Categorize task */}
            <select
              name="category"
              value={todo.category}
              onChange={handleChange}
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 pr-3 pl-1 text-black text-center text-sm"
            >
              <option value="" disabled hidden>
                Categorize task
              </option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
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
              //onClick={clearAllTasks}
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

      {/* Rendering today tasks only  */}
      {todayTodo.length === 0 ? (
        <div className="h-[42vh] bg-purple-500">
          <p className="bg-purple-500 w-full flex items-center justify-start pl-10 text-xl text-white pt-5 ">
            No tasks Available ❗
          </p>
        </div>
      ) : (
        <div className="bg-purple-500 flex justify-start">
          <ul className="flex flex-row gap-2 flex-wrap items-center ml-2 mt-2 rounded-lg w-1/2">
            {todayTodo
              // .filter((task) => !hideDoneTasks || !task.done)
              .map((task, index) => (
                <li
                  key={index}
                  className={`my-1 p-3 rounded-lg self-start font-bold w-fit px-2 shadow-sm shadow-white font-mono
                    ${
                      task.status === "done"
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
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-col gap-2 items-start">
                      {/* Tasl's Text */}
                      <p className="text-xl">{task.text}</p>
                      {/* Tasl's Text */}
                      <p className="text-base text-gray-700">
                        {task.description}
                      </p>
                      {/* Task's deadline */}
                      {task.time ? (
                        <p className="text-base text-gray-600">
                          <span className="text-md mr-1">🕐</span>
                          {formatTime(task.time)}
                        </p>
                      ) : (
                        <p className="text-base text-gray-600">
                          <span className="text-md mr-1">🕐</span>
                          No deadline set
                        </p>
                      )}

                      {/* Task's deadline */}
                      <p className="text-base text-gray-700 mb-1">
                        Priority : {task.priority || "Not set"}
                      </p>
                    </div>

                    {/* Task's deadline */}
                    <p className="text-base text-gray-700 my-1">
                      {" "}
                      Category : {task.category}
                    </p>

                    {/* Task's status */}
                    <p className="bg-white p-2 mt-2 text-center text-gray-700 rounded">
                      Status : {task.status}
                    </p>
                    <div className="text-center mt-3">
                      <button
                        className="bg-white px-2 rounded text-blue-400 font-bold text-base"
                        onClick={() => updateItem(index)}
                      >
                        {editIndex === index ? (
                          <i className="fa-solid fa-check"></i>
                        ) : (
                          <i className="fa-regular fa-pen-to-square"></i>
                        )}
                      </button>
                      <button
                        className="bg-white px-2 rounded text-red-400 font-bold ml-1 text-base"
                        onClick={() => deleteItem(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <button
                        className="bg-white px-2 rounded text-green-600 font-bold ml-1 text-base"
                        onClick={() => markAsDone(index)}
                      >
                        {task.status === "done" ? (
                          <i className="fa-solid fa-rotate-left"></i>
                        ) : (
                          <i className="fa-regular fa-circle-check"></i>
                        )}
                      </button>
                      <button
                        type="button"
                        className="rounded px-2 bg-white ml-1 text-base text-red-600"
                        onClick={() => startDeadlineAlert(index)}
                      >
                        <i className="fa-solid fa-bell"></i>
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
