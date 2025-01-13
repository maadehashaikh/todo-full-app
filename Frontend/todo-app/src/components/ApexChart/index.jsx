import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const UserActivityChart = () => {
    const [stats, setStats] = useState({ completed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve the token
                const response = await axiosInstance.get("/user/task-stats", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                    },
                });

                if (response.data.success) {
                    setStats(response.data.stats);
                } else {
                    toast.error("Failed to fetch user activity data.");
                }
            } catch (error) {
                console.error("Error fetching task stats:", error);
                toast.error("Error fetching user activity data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const chartOptions = {
        chart: {
            type: "donut",
            toolbar: {
                show: true,
            },
        },
        labels: ["Completed Tasks", "Pending Tasks"],
        legend: {
            position: "bottom",
        },
        colors: ["#00E396", "#FF4560"], // Green for completed, red for pending
        plotOptions: {
            pie: {
                donut: {
                    size: "75%",
                },
            },
        },
    };

    const chartSeries = [stats.completed, stats.pending];

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">User Activity</h2>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : (
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                    height={300}
                />
            )}
            {!loading && (
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Completed: <span className="font-bold text-green-500">{stats.completed}</span>
                    </p>
                    <p className="text-gray-600">
                        Pending: <span className="font-bold text-red-500">{stats.pending}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserActivityChart;
