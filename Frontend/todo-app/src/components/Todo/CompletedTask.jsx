import React from "react";
import { Result } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const CompletedTasks = ({ tasks, setTasks, setTodayTodo }) => {
    const completedTasks = tasks.filter((task) => task.status === "done");

    const markAsDone = async (index, id, currentStatus) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the token
            const newStatus = currentStatus === "done" ? "pending" : "done";

            const response = await axiosInstance.patch(
                `/todos/${id}/status`,
                { status: newStatus }, // Send the updated status
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    },
                }
            );

            if (response.status === 200) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
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
    return (
        <div className="flex justify-start bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            {completedTasks.length === 0 ? (
                <div className="h-full w-full">
                    <p className="w-full flex items-center justify-center pl-10 text-xl text-white pt-5">
                        <Result
                            status={404}
                            title={<span className="text-white font-semibold">No Completed Tasks!</span>}
                        />
                    </p>
                </div>
            ) : (
                <div className="flex justify-start mb-[50px]">
                    <ul className="flex flex-row gap-2 flex-wrap items-center ml-2 mt-2 rounded-lg w-full">
                        {completedTasks.map((task, index) => (
                            <li
                                key={index}
                                className="my-1 p-4 rounded-lg bg-slate-300 line-through self-start font-bold w-fit px-2 shadow-lg font-mono"
                            >
                                <div className="flex flex-col justify-start items-start">
                                    <p className="text-xl">{task.text}</p>
                                    <p className="text-base text-gray-700">{task.description}</p>
                                    <p className="text-base text-gray-700 my-1">
                                        Category: {task.category || "Not Set"}
                                    </p>
                                    <p className="bg-white p-2 mt-2 text-center text-gray-700 rounded">
                                        Status: {task.status}
                                    </p>
                                </div>
                                <button
                                    className="bg-white px-2  mt-[10px] rounded text-green-600 font-bold ml-1 text-base"
                                    onClick={() => markAsDone(index, task._id, task.status)}
                                >
                                    {task.status === "done" ? (
                                        <i className="fa-solid fa-rotate-left"></i>
                                    ) : (
                                        <i className="fa-regular fa-circle-check"></i>
                                    )}
                                </button>
                            </li>

                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
};

export default CompletedTasks;
