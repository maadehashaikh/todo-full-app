const Todo = require("../model/todo.model"); // Assuming model is in a folder named 'models'

// 1. Create a Todo
exports.createTodo = async (req, res) => {
  try {
    const { text, description, time, priority, category, } = req.body;
    const userId = req.user.id; // Extract user ID from the authenticated user
    console.log("userId", userId)
    const todo = await Todo.create({
      text,
      description,
      time,
      priority,
      category,
      status: "pending",
      userId: userId, // Associate with the user
    });

    res
      .status(201)
      .json({ message: "Todo created successfully", success: true, todo });
  } catch (error) {
    console.log("err", error)
    res.status(500).json({ message: "Error creating todo", error });
  }
};

// 2. Display Only Today's Todos for a User
exports.getCurrentDateTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todos = await Todo.find({
      userId: userId, // Filter by user ID
      date: { $gte: startOfDay.getTime(), $lt: endOfDay.getTime() },
    });

    res.status(200).json(todos);
  } catch (error) {
    console.log("err", error)
    res
      .status(500)
      .json({ message: "Error fetching current date todos", error });
  }
};

// 3. Get Todos Excluding the Current Date for a User
exports.getTodosExcludingCurrentDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todos = await Todo.find({
      user: userId, // Filter by user ID
      $or: [
        { date: { $lt: startOfDay.getTime() } },
        { date: { $gte: endOfDay.getTime() } },
      ],
    });

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching todos excluding current date",
      error: error.message,
    });
  }
};

// 4. Get All Todos for a User
exports.getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;

    const todos = await Todo.find({ user: userId }); // Filter by user ID
    const todosWithReadableDate = todos.map((todo) => {
      const readableDate = new Date(todo.date).toLocaleDateString();
      return {
        ...todo.toObject(),
        date: readableDate,
      };
    });

    res.status(200).json(todosWithReadableDate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
};


exports.getUserTaskStats = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the request
    const completedTasks = await Todo.countDocuments({ user: userId, status: "done" });
    const pendingTasks = await Todo.countDocuments({ user: userId, status: { $ne: "done" } });

    res.status(200).json({
      success: true,
      stats: {
        completed: completedTasks,
        pending: pendingTasks,
      },
    });
  } catch (error) {
    console.error("Error fetching user task stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user task stats",
      error: error.message,
    });
  }
};

// 5. Delete Only Today's Todos for a User
exports.deleteTodayTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("useId", userId)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Todo.deleteMany({
      userId: userId, // Filter by user ID
      date: { $gte: startOfDay.getTime(), $lt: endOfDay.getTime() },
    });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        message: "Todos deleted successfully",
        success: true,
      });
    }

    res.json({ message: "No todos found for today", success: false });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting current date todos",
      error: error.message,
    });
  }
};

// 6. Delete a Todo by ID for a User
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await Todo.findOneAndDelete({ _id: id, userId: userId }); // Match both ID and user

    if (result) {
      return res
        .status(200)
        .json({ message: "Todo deleted successfully", todo: result });
    } else {
      return res.status(404).json({ message: "Todo not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
};

// 7. Update Task Status for a User
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const updatedTask = await Todo.findOneAndUpdate(
      { _id: id, userId: userId }, // Match ID and user
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task status" });
  }
};

// 8. Update a Todo for a User
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, description, time, priority, category, status } = req.body;
    const userId = req.user.id;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId: userId }, // Match ID and user
      { text, description, time, priority, category, status },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found", success: false });
    }

    res.status(200).json({
      message: "Todo updated successfully",
      success: true,
      todo: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating todo", error });
  }
};
