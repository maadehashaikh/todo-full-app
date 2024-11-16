import axios from "axios";
import React, { useState, useEffect } from "react";

const TodoHistory = () => {
  const [alltodo, setAllTodo] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8082/api//todos/not-today"
      );
      console.log(response.data);
      setAllTodo(response.data); // Set the fetched data into state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(alltodo);
  return (
    <div className="h-[89.2vh] w-screen bg-purple-500 p-2">
      <ul className="flex flex-row gap-2 flex-wrap items-center ml-2 rounded-lg w-[99%]">
        {alltodo.length === 0 ? (
          <p>No todos available</p>
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
                    Date : "
                    {new Date(todo.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    "
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
