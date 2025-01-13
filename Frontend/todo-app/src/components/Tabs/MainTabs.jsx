import { Tabs } from "antd";
import { FileDoneOutlined, HistoryOutlined, CheckCircleOutlined } from "@ant-design/icons";
import TodoList from "../Todo/TodoList";
import TodoHistory from "../Todo/TodoHistory";
import CompletedTasks from "../Todo/CompletedTask";

const { TabPane } = Tabs;

const MainTabs = ({
    todayTodo,
    tasks,
    setTasks,
    hideDoneTasks,
    fetchTodos,
    editIndex,
    setEditIndex,
    setTodayTodo,
}) => {
    return (
        <div className="w-full bg-gray-50">
            <Tabs
                defaultActiveKey="1"
                centered
                tabBarGutter={50}
                tabBarStyle={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8" }}
            >
                <TabPane
                    tab={
                        <span className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200">
                            <FileDoneOutlined className="mr-2 text-xl" />
                            <span className="text-lg font-semibold">Today's Tasks</span>
                        </span>
                    }
                    key="1"
                >
                    <TodoList
                        todayTodo={todayTodo}
                        setTodayTodo={setTodayTodo}
                        tasks={tasks}
                        setTasks={setTasks}
                        hideDoneTasks={hideDoneTasks}
                        fetchTodos={fetchTodos}
                        editIndex={editIndex}
                        setEditIndex={setEditIndex}
                    />
                </TabPane>
                <TabPane
                    tab={
                        <span className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200">
                            <HistoryOutlined className="mr-2 text-xl" />
                            <span className="text-lg font-semibold">Task History</span>
                        </span>
                    }
                    key="2"
                >
                    <TodoHistory />
                </TabPane>
                <TabPane
                    tab={
                        <span className="flex items-center text-gray-700 hover:text-blue-500 transition duration-200">
                            <CheckCircleOutlined className="mr-2 text-xl" />
                            <span className="text-lg font-semibold">Completed Tasks</span>
                        </span>
                    }
                    key="3"
                >
                    <CompletedTasks tasks={tasks} setTasks={setTasks} setTodayTodo={setTodayTodo} />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default MainTabs;
