import React, { useState } from "react";
import { toast } from "react-toastify";
import UpdateTodoModal from "../Modal/editModal";
import { Popconfirm, Result } from "antd";
import axiosInstance from "../../utils/axiosInstance";
const TodoList = ({
    todayTodo,
    tasks,
    setTasks,
    hideDoneTasks,
    fetchTodos,
    editIndex,
    setEditIndex,
    setTodayTodo,
}) => {
    const [editTodo, setEditTodo] = useState(null);

    const markAsDone = async (index, id, currentStatus) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the token
            const newStatus = currentStatus === "done" ? "pending" : "done";

            const response = await axiosInstance.patch(
                `/todos/${id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    },
                }
            );

            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((task, i) =>
                        task._id === id ? { ...task, status: newStatus } : task
                    )
                );
                setTodayTodo((prevTodayTodo) =>
                    prevTodayTodo.map((task) =>
                        task._id === id ? { ...task, status: newStatus } : task
                    )
                );
                toast.success("Task status updated successfully!");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status");
        }
    };

    const deleteItem = async (id) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the token
            const response = await axiosInstance.delete(`/todos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                },
            });

            if (response.status === 200) {
                toast.success("Todo deleted successfully");
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
                setTodayTodo((prevTodayTodo) => prevTodayTodo.filter((task) => task._id !== id));
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
            toast.error("Failed to delete todo");
        }
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

    const activeTasks = todayTodo.filter((task) => task.status !== "done");

    return (
        <div>

            <div className="flex justify-start bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
                {todayTodo.length === 0 ? (
                    <div className="h-full w-full">
                        <p className="w-full flex items-center justify-center pl-10 text-xl text-white pt-5">
                            <Result status={404} title={<span className="text-white font-semibold">Todos Not Available!</span>} />
                        </p>
                    </div>
                ) : activeTasks.length === 0 ? (
                    <div className="h-full w-full">
                        <p className="w-full flex items-center justify-center pl-10 text-xl text-white pt-5">
                            <Result status={404} title={<span className="text-white font-semibold">No Active Tasks Found!</span>} />
                        </p>
                    </div>
                ) : (
                    <div className="flex justify-start mb-[50px]">
                        <ul className="flex flex-row gap-2 flex-wrap items-center ml-2 mt-2 rounded-lg w-full">
                            {activeTasks.map((task, index) => (
                                <li
                                    key={index}
                                    className={`my-1 p-4 rounded-lg self-start font-bold w-fit px-2 shadow-lg font-mono
                                ${task.priority === "High"
                                            ? "bg-red-400"
                                            : task.priority === "Medium"
                                                ? "bg-yellow-300"
                                                : task.priority === "Low"
                                                    ? "bg-green-400"
                                                    : "bg-blue-400"
                                        }`}
                                >
                                    <div className="flex flex-col justify-start items-start">
                                        <div className="flex flex-col gap-1 items-start">
                                            <p className="text-xl">{task.text}</p>
                                            <p className="text-base text-gray-700">{task.description}</p>
                                            {task.time ? (
                                                <p className="text-base text-gray-600">
                                                    <span className="text-md mr-1">🕐</span>
                                                    {formatTime(task.time)}
                                                </p>
                                            ) : (
                                                <p className="text-base text-gray-600">No deadline set</p>
                                            )}
                                            <p className="text-base text-gray-700 mb-1">
                                                Priority: {task.priority || "Not set"}
                                            </p>
                                        </div>
                                        <p className="text-base text-gray-700 my-1">
                                            Category: {task.category || "Not Set"}
                                        </p>
                                        <p className="bg-white p-2 mt-2 text-center text-gray-700 rounded">
                                            Status: {task.status}
                                        </p>
                                        <div className="text-center mt-3">
                                            <button
                                                className="bg-white px-2 rounded text-blue-400 font-bold text-base"
                                                onClick={() => setEditTodo(task)}
                                            >
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </button>
                                            <Popconfirm onConfirm={() => deleteItem(task._id)} title="Are you sure you want to delete the Todo?">
                                                <button className="bg-white px-2 rounded text-red-400 font-bold ml-1 text-base">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </Popconfirm>
                                            <button
                                                className="bg-white px-2 rounded text-green-600 font-bold ml-1 text-base"
                                                onClick={() => markAsDone(index, task._id, task.status)}
                                            >
                                                {task.status === "done" ? (
                                                    <i className="fa-solid fa-rotate-left"></i>
                                                ) : (
                                                    <i className="fa-regular fa-circle-check"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {editTodo && (
                    <UpdateTodoModal
                        todo={editTodo}
                        setEditTodo={setEditTodo}
                        setTasks={setTasks}
                        setTodayTodo={setTodayTodo}
                    />
                )}
            </div>
        </div>
    );
};

export default TodoList;
