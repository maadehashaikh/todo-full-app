import React, { useContext, useState } from "react";
import { Modal, Input, Select, TimePicker } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const { Option } = Select;

const UpdateTodoModal = ({ todo, setEditTodo, setTasks, setTodayTodo }) => {
    const { user } = useContext(AuthContext);
    const [updatedTodo, setUpdatedTodo] = useState({ ...todo });
    const handleChange = (name, value) => {
        setUpdatedTodo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve the token
            const response = await axiosInstance.put(
                `/todos/update/${todo._id}`,
                {
                    ...updatedTodo,
                    user: user.id, // Include the user ID in the payload
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Todo updated successfully!");
                // Update the tasks and todayTodo state
                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t._id === todo._id ? response.data.todo : t
                    )
                );
                setTodayTodo((prevTodayTodo) =>
                    prevTodayTodo.map((t) =>
                        t._id === todo._id ? response.data.todo : t
                    )
                );
                setEditTodo(null); // Close the modal
            }
        } catch (error) {
            toast.error("Failed to update todo");
        }
    };

    const parseTimeToDayjs = (timeString) => {
        // Convert "HH:mm" to dayjs object
        return dayjs(timeString, "HH:mm");
    };

    const formatDayjsToTimeString = (dayjsTime) => {
        // Convert dayjs object to "HH:mm" string
        return dayjsTime.format("HH:mm");
    };

    return (
        <Modal
            title={
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#000" }}>
                    Update Todo
                </div>
            }
            visible={true}
            onCancel={() => setEditTodo(null)}
            onOk={handleSubmit}
            okText={<span style={{ fontWeight: "bold", color: "white" }}>Update</span>}
            cancelText={<span style={{ fontWeight: "bold", color: "#4A90E2" }}>Cancel</span>}
            okButtonProps={{
                style: {
                    backgroundColor: "#4A90E2",
                    border: "none",
                    fontSize: "16px",
                    padding: "5px 20px",
                    borderRadius: "5px",
                },
            }}
            cancelButtonProps={{
                style: {
                    fontSize: "16px",
                    padding: "5px 20px",
                    borderRadius: "5px",
                },
            }}
            bodyStyle={{
                padding: "20px 30px",
                backgroundColor: "#f9f9f9",
                borderRadius: "10px",
            }}
        >
            <div>
                {/* Text Input */}
                <Input
                    placeholder="Enter Todo Title"
                    value={updatedTodo.text}
                    onChange={(e) => handleChange("text", e.target.value)}
                    className="mb-4"
                    style={{
                        borderRadius: "8px",
                        fontSize: "16px",
                        padding: "10px 12px",
                        borderColor: "#4A90E2",
                    }}
                />
                {/* Description Input */}
                <Input.TextArea
                    placeholder="Enter Description"
                    value={updatedTodo.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="mb-4"
                    style={{
                        borderRadius: "8px",
                        fontSize: "16px",
                        padding: "10px 12px",
                        borderColor: "#4A90E2",
                    }}
                    rows={4}
                />
                {/* Time Picker */}
                <TimePicker
                    value={parseTimeToDayjs(updatedTodo.time)} // Convert time string to dayjs
                    onChange={(time) =>
                        handleChange("time", formatDayjsToTimeString(time)) // Convert dayjs to string
                    }
                    format="HH:mm"
                    className="mb-4 w-full"
                    style={{
                        borderRadius: "8px",
                        padding: "10px",
                        fontSize: "16px",
                        borderColor: "#4A90E2",
                    }}
                />
                {/* Priority Selector */}
                <Select
                    value={updatedTodo.priority}
                    onChange={(value) => handleChange("priority", value)}
                    className="mb-3 w-full"
                    size="large"
                    style={{
                        borderRadius: "8px",
                        fontSize: "16px",
                        borderColor: "#4A90E2",
                    }}
                    dropdownStyle={{
                        borderRadius: "8px",
                    }}
                >
                    <Option value="Low">Low</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="High">High</Option>
                </Select>
            </div>
        </Modal>
    );
};

export default UpdateTodoModal;