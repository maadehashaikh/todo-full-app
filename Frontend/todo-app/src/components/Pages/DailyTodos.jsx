import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DailyTodos = () => {
  const [todo, setTodo] = useState({
    text: "",
    description: "",
    time: "",
    priority: "",
    category: "daily",
    status: "pending",
  });

  const [todayTodo, setTodayTodo] = useState([]); // Fetch only current date's tasks
  const [tasks, setTasks] = useState([]); // Entire list of tasks from the backend
  const [editIndex, setEditIndex] = useState(null); // Track editing index
  const [hideDoneTasks, setHideDoneTasks] = useState(false); // Hide completed tasks

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/todos");
      console.log(response.data,"From Gere")
      setTasks(response.data); // Initialize tasks
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    CurrentDateTodo();
  }, [tasks]);

  const CurrentDateTodo = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/todos/today");
      setTodayTodo(response.data);
    } catch (err) {
      console.log("Error fetching today's todos:", err);
    }
  };

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
          category: "daily",
          status: "pending",
        });
        CurrentDateTodo();
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8082/api/todos/${id}`
      );
        toast.success("Todo deleted successfully");
        fetchTodos();
    } catch (error) {
      toast.error("An error occurred while deleting the todo");
    }
  };

  const updateItem = async (index) => {
    const task = tasks[index]; // Current task being edited

    if (editIndex !== null) {
      try {
        const response = await axios.put(
          `http://localhost:8082/api/todos/${task._id}`,
          todo
        );
        const updatedTask = response.data.todo;
        const updatedTasks = tasks.map((task, i) =>
          i === editIndex ? updatedTask : task
        );

        setTasks(updatedTasks);
        setEditIndex(null);
        setTodo({
          text: "",
          description: "",
          time: "",
          priority: "",
          category: "daily",
          status: "pending",
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      setEditIndex(index);
      setTodo(tasks[index]);
    }
  };

  const markAsDone = async (index, id, currentStatus) => {
    try {
      const newStatus = currentStatus === "done" ? "pending" : "done";
      const response = await axios.patch(
        `http://localhost:8082/api/todos/${id}/status`,
        {
          status: newStatus,
        }
      );

      if (response.status === 200) {
        const updatedTasks = tasks.map((task, i) =>
          i === index ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);
        toast.success("Task status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const clearAllTasks = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:8082/api/todos/deleteToday"
      );
      if (response.data.success) {
        toast.success(`${response.data.message}`);
        fetchTodos();
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while clearing tasks");
    }
  };

  const handleCheckboxChange = (event) => {
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

  return (
    <>
      <div className="w-full bg-purple-500">
        <div className="todoDiv w-[45%] py-2 ml-3 opacity-85 h-auto">
          <form className="mt-2" onSubmit={onSubmit}>
            <input
              name="text"
              value={todo.text}
              onChange={handleChange}
              type="text"
              placeholder="Enter To Do Here ✍"
              className="pr-52 pl-2 py-3 text-black placeholder:text-black border-4 border-blue-500 rounded-lg ml-2"
              required
            />
            <textarea
              name="description"
              value={todo.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="pr-56 pl-2 py-3 text-black placeholder:text-black border-4 border-blue-500 rounded-lg ml-2 mt-2 resize-none"
              required
            ></textarea>
            <br />
            <label htmlFor="time">Set Deadline:</label>
            <input
              type="time"
              name="time"
              value={todo.time}
              onChange={handleChange}
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 px-4 text-black mb-3"
            />
            <select
              name="priority"
              value={todo.priority}
              onChange={handleChange}
              className="ml-2 border-4 border-blue-500 rounded-lg py-2 pr-3 pl-2 text-black text-center text-sm"
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
              className="ml-3"
              checked={hideDoneTasks}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="hide" className="ml-2 text-lg">
              Hide Completed Tasks
            </label>
          </form>
        </div>
      </div>

      {/* Render today's tasks */}
      {todayTodo.length === 0 ? (
        <div className="h-[42vh] bg-purple-500">
          <p className="bg-purple-500 w-full flex items-center justify-start pl-10 text-xl text-white pt-5">
            No tasks available ❗
          </p>
        </div>
      ) : (
        <div className="bg-purple-500 flex justify-start">
          <ul className="flex flex-row gap-2 flex-wrap items-center ml-2 mt-2 rounded-lg w-full">
            {todayTodo
              .filter((task) => !hideDoneTasks || task.status !== "done")
              .map((task, index) => (
                <li
                  key={index}
                  className={`my-1 p-3 rounded-lg self-start font-bold w-fit px-2 shadow-sm shadow-white font-mono ${
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
                    <p>{task.text}</p>
                    <p>{task.description}</p>
                    <p className="italic text-[12px]">Deadline: {formatTime(task.time)}</p>
                    <button
                      className="bg-green-400 text-black px-4 py-1 rounded-lg text-sm mt-2"
                      onClick={() => markAsDone(index, task._id, task.status)}
                    >
                      Mark as {task.status === "done" ? "Pending" : "Done"}
                    </button>
                    <button
                      className="bg-blue-400 text-white px-4 py-1 rounded-lg text-sm mt-2"
                      onClick={() => updateItem(index)}
                    >
                      {editIndex === index ? "Save" : "Edit"}
                    </button>
                    <button
                      className="bg-red-400 text-white px-4 py-1 rounded-lg text-sm mt-2"
                      onClick={() => deleteItem(task._id)}
                    >
                      Delete
                    </button>
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
