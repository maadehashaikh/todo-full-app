import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import TodoForm from "./TodoForm";
import MainTabs from "../Tabs/MainTabs";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const DailyTodos = () => {
    const [tasks, setTasks] = useState([]);
    const [todayTodo, setTodayTodo] = useState([]);
    const [hideDoneTasks, setHideDoneTasks] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const { user, isAuthenticated } = useContext(AuthContext);

    const fetchTodos = async () => {
        if (!isAuthenticated) return;
        try {
            const token = localStorage.getItem("token"); // Retrieve the token
            const response = await axiosInstance.get("/todos/today", {
                headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const CurrentDateTodo = async () => {
        if (!isAuthenticated) return;
        try {
            const token = localStorage.getItem("token"); // Retrieve the token
            const response = await axiosInstance.get("/todos/today", {
                headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
            });
            setTodayTodo(response.data);
        } catch (err) {
            console.error("Error fetching today's todos:", err);
        }
    };

    const clearAllTasks = async () => {
        if (!isAuthenticated) return;

        try {
            const token = localStorage.getItem("token"); // Retrieve the token
            const response = await axiosInstance.delete("todos/deleteToday", {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                },
            });

            if (response.data.success) {
                toast.success(`${response.data.message}`);
                fetchTodos(); // Re-fetch all todos
                CurrentDateTodo(); // Re-fetch today's todos
            } else {
                toast.error(`${response.data.message}`);
            }
        } catch (err) {
            console.error("Error clearing tasks:", err);
            toast.error("Failed to clear tasks");
        }
    };


    const handleCheckboxChange = (event) => {
        setHideDoneTasks(event.target.checked);
    };

    useEffect(() => {
        fetchTodos();
        CurrentDateTodo();
    }, [isAuthenticated]);

    console.log("todayTodo", todayTodo)

    return (
        <div>
            <TodoForm
                fetchTodos={fetchTodos}
                CurrentDateTodo={CurrentDateTodo}
                clearAllTasks={clearAllTasks}
                hideDoneTasks={hideDoneTasks}
                handleCheckboxChange={handleCheckboxChange}
            />
            <MainTabs
                todayTodo={todayTodo}
                setTodayTodo={setTodayTodo}
                tasks={tasks}
                setTasks={setTasks}
                hideDoneTasks={hideDoneTasks}
                fetchTodos={fetchTodos}
                editIndex={editIndex} // Pass editIndex to TodoList
                setEditIndex={setEditIndex} // Pass setEditIndex to TodoList
            />
        </div>
    );
};

export default DailyTodos;
