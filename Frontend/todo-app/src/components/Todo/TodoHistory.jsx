import { Result } from "antd";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const TodoHistory = () => {
    const [alltodo, setAllTodo] = useState([]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get("/todos/not-today", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            setAllTodo(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log(alltodo);
    return (
        <div className="h-[89.2vh] w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600  p-2">
            <ul className="flex flex-row gap-2 flex-wrap items-center ml-2 rounded-lg w-[99%]">
                {alltodo.length === 0 ? (
                    <div className="h-full w-full">
                        <p className=" w-full flex  items-center justify-center pl-10 text-xl text-white pt-5 ">
                            <Result status={404} title={<span className="text-white font-semibold">Todos Not Available!</span>} />
                        </p>
                    </div>
                ) : (
                    alltodo.map((todo) => (
                        <li
                            key={todo.id}
                            className={`my-1 py-2 rounded-lg self-start font-bold w-fit pr-4 pl-2 shadow-sm shadow-white   
                ${todo.status === "done" ? "bg-green-300 " : "bg-red-300"}`}
                        >
                            {/* start here */}
                            <div className="flex flex-col justify-start items-start">
                                <div className="flex flex-col gap-1 items-start">
                                    {/* Tasl's Text */}
                                    <p className="text-lg font-bold">
                                        Date : &quot;
                                        {new Date(todo.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                        &ldquo;
                                    </p>
                                    <p className="text-xl text-gray-700">{todo.text}</p>
                                    {/* Tasl's Text */}
                                    <p className="text-base text-gray-700">{todo.description}</p>
                                    {/* Task's deadline */}
                                    <p className="text-base text-gray-700">🕐{todo.time}</p>

                                    {/* Task's deadline */}
                                    <p className="text-base text-gray-700">
                                        {" "}
                                        Priority : {todo.priority}
                                    </p>
                                </div>

                                {/* Task's deadline */}
                                <p className="text-base text-gray-700">
                                    Category : {todo.category}
                                </p>

                                {/* Task's status */}
                                <p className="bg-white py-1 mt-1">Status : {todo.status}</p>
                            </div>
                            {/* ends here */}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TodoHistory;
