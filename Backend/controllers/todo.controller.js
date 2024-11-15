const Todo = require("../model/todo.model"); // assuming model is in a folder named 'models'
const mongoose = require("mongoose");

// 1. Create a Todo
exports.createTodo = async (req, res) => {
  try {
    const { text, description, time, priority, category, status } = req.body;
    const todo = await Todo.create({
      text,
      description,
      time,
      priority,
      category,
      status: "pending",
    });
    res
      .status(201)
      .json({ message: "Todo created successfully", success: true, todo });
    console.log(todo);
  } catch (error) {
    res.status(500).json({ message: "Error creating todo", error });
  }
};

// 2. Get All Todos
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos", error });
  }
};

// 3. Update a Todo by ID
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    res.status(500).json({ message: "Error updating todo", error });
  }
};

// 4. Delete a Todo by ID
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
};

// 5. Get Todos for the Current Date
exports.getCurrentDateTodos = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);
    const todos = await Todo.find({
      createdAt: { $gte: new Date(startOfDay), $lt: new Date(endOfDay) },
    });
    res.status(200).json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching current date todos", error });
  }
};

// 6. Get Todos Excluding the Current Date
exports.getTodosExcludingCurrentDate = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);
    const todos = await Todo.find({
      $or: [
        { createdAt: { $lt: new Date(startOfDay) } },
        { createdAt: { $gte: new Date(endOfDay) } },
      ],
    });
    res.status(200).json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching todos excluding current date", error });
  }
};

// exports.deleteTodayTodo = async (req, res) => {
//   try {
//     const startOfDay = new Date().setHours(0, 0, 0, 0);
//     const endOfDay = new Date().setHours(23, 59, 59, 999);
//     const result = await Todo.deleteMany({
//       createdAt: { $gte: new Date(startOfDay), $lt: new Date(endOfDay) },
//     });
//     if (result.deletedCount > 0) {
//       res.status(200).json({ message: "Todos deleted successfully" });
//     } else {
//       res.status(404).json({ message: "No todos found for today" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting current date todos", error });
//   }
// };

exports.deleteTodayTodo = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    console.log("Deleting todos between:", startOfDay, "and", endOfDay); // Add debug log

    const result = await Todo.deleteMany({
      createdAt: { $gte: new Date(startOfDay), $lt: new Date(endOfDay) },
    });

    console.log("Delete result:", result); // Check the delete result

    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Todos deleted successfully" });
    } else {
      res.status(404).json({ message: "No todos found for today" });
    }
  } catch (error) {
    console.error("Error deleting todos:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error deleting current date todos", error });
  }
};
