import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TodoForm = ({
    fetchTodos,
    CurrentDateTodo,
    clearAllTasks,
    hideDoneTasks,
    handleCheckboxChange,
}) => {
    const navigate = useNavigate()
    const [todo, setTodo] = useState({
        text: "",
        description: "",
        time: "",
        priority: "",
        category: "daily",
        status: "pending",
    });
    const { user, isAuthenticated } = useContext(AuthContext);
    const { text, description, time, priority, category } = todo;

    const handleChange = (e) => {
        setTodo({ ...todo, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.warning("Please log in to add tasks.");
            navigate("/signup")
            return;
        }
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.post(
                "/todos",
                {
                    ...todo,
                    user: user.id, // Add user ID to the payload
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    },
                }
            );
            if (response.data.success) {
                fetchTodos();
                CurrentDateTodo();
                setTodo({
                    text: "",
                    description: "",
                    time: "",
                    priority: "",
                    category: "daily",
                    status: "pending",
                });
                toast.success(response.data.message);
            }
        } catch (err) {
            toast.error("Failed to add task");
        }
    };

    return (
        <div className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 py-8">

            {isAuthenticated ? (
                <div className=" rounded-lg p-6 mb-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-white">
                        Welcome back, {user?.name || "User"}!
                    </h2>
                </div>
            ) : (
                <div className="bg-red-50 rounded-lg p-6 mb-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-700">
                        Welcome to Todo App
                    </h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Please{" "}
                        <a href="/login" className="text-blue-500 hover:underline font-bold">
                            Log In
                        </a>{" "}
                        or{" "}
                        <a href="/signup" className="text-blue-500 hover:underline font-bold">
                            Sign Up
                        </a>{" "}
                        to create and manage your tasks.
                    </p>
                </div>
            )}
            <div className="todoDiv w-[30%] py-6 ml-3 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
                <form className="mt-2 px-6" onSubmit={onSubmit}>
                    <input
                        name="text"
                        value={text}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter Task Title ✍"
                        className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 bg-white bg-opacity-70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        name="description"
                        value={description}
                        onChange={handleChange}
                        placeholder="Enter Description"
                        className="w-full mt-4 px-4 py-3 text-gray-800 placeholder-gray-500 bg-white bg-opacity-70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="4"
                        required
                    ></textarea>
                    <div className="mt-4">
                        <label
                            htmlFor="time"
                            className="block text-gray-700 font-semibold mb-2"
                        >
                            Set Deadline For Your Task
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={time}
                            id="time"
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-800 bg-white bg-opacity-70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex mt-4">
                        <div className="w-1/2 pr-2">
                            <label
                                htmlFor="priority"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white bg-opacity-70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled hidden>
                                    Select Priority
                                </option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="w-1/2 pl-2">
                            <label
                                htmlFor="category"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Category
                            </label>
                            <select
                                name="category"
                                value={category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white bg-opacity-70 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="hide"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={hideDoneTasks}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="hide" className="ml-2 text-gray-700">
                            Hide Completed Tasks
                        </label>
                    </div>
                    <div className="flex mt-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Add Task
                        </button>
                        <button
                            type="button"
                            className="w-full ml-4 bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition duration-200"
                            onClick={clearAllTasks}
                        >
                            Clear All
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoForm;
