const Todo = require("../model/todo.model"); // assuming model is in a folder named 'models'
const mongoose = require("mongoose");

// 1. Create a Todo
exports.createTodo = async (req, res) => {
  try {
    const { text, description, time, priority, category } = req.body;
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

// 2. displaying only today todos
exports.getCurrentDateTodos = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to 12:00 AM today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to 11:59:59.999 PM today
    // Convert both start and end of day to timestamps (milliseconds)
    const startTimestamp = startOfDay.getTime();
    const endTimestamp = endOfDay.getTime();
    // Fetch todos where the date is between the start and end of today
    const todos = await Todo.find({
      date: { $gte: startTimestamp, $lt: endTimestamp },
    });

    res.status(200).json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching current date todos", error });
  }
};

// 3. Get Todos Excluding the Current Date
exports.getTodosExcludingCurrentDate = async (req, res) => {
  try {
    // Get the start and end of today in milliseconds (timestamps)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // 12:00 AM today
    const startOfDayTimestamp = startOfDay.getTime(); // Get timestamp (in ms)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // 11:59 PM today
    const endOfDayTimestamp = endOfDay.getTime(); // Get timestamp (in ms)

    // Query to fetch todos created before today or after today
    const todos = await Todo.find({
      $or: [
        { createdAt: { $lt: startOfDayTimestamp } }, // Before today
        { createdAt: { $gte: endOfDayTimestamp } }, // After today
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

// 2. Get All Todos
// exports.getAllTodos = async (req, res) => {
//   try {
//     const todos = await Todo.find();
//     res.status(200).json(todos);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching todos", error });
//   }
// };

// // 3. Update a Todo by ID
// exports.updateTodo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const todo = await Todo.findByIdAndUpdate(id, updates, { new: true });
//     if (!todo) {
//       return res.status(404).json({ message: "Todo not found" });
//     }
//     res.status(200).json({ message: "Todo updated successfully", todo });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating todo", error });
//   }
// };

// // const getStartAndEndOfDayUTC = () => {
// //   const now = new Date();

// //   // Start of the day in UTC
// //   const startOfDay = new Date(
// //     Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
// //   );

// //   // End of the day in UTC
// //   const endOfDay = new Date(
// //     Date.UTC(
// //       now.getUTCFullYear(),
// //       now.getUTCMonth(),
// //       now.getUTCDate(),
// //       23,
// //       59,
// //       59,
// //       999
// //     )
// //   );

// //   return { startOfDay, endOfDay };
// // };

// // 4. Delete a Todo by ID
// // exports.deleteTodo = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const todo = await Todo.findByIdAndDelete(id);
// //     if (!todo) {
// //       return res.status(404).json({ message: "Todo not found" });
// //     }
// //     res.status(200).json({ message: "Todo deleted successfully" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error deleting todo", error });
// //   }
// // };

// // 5. Get Todos for the Current Date

// exports.deleteTodayTodo = async (req, res) => {
//   try {
//     const { startOfDay, endOfDay } = getStartAndEndOfDayUTC();

//     console.log(
//       "Deleting todos between:",
//       startOfDay.toISOString(),
//       "and",
//       endOfDay.toISOString()
//     );

//     const result = await Todo.deleteMany({
//       createdAt: { $gte: startOfDay, $lt: endOfDay },
//     });

//     if (result.deletedCount > 0) {
//       return res.status(200).json({ message: "Todos deleted successfully" });
//     }
//     res.status(404).json({ message: "No todos found for today" });
//   } catch (error) {
//     console.error("Error deleting todos:", error);
//     res
//       .status(500)
//       .json({ message: "Error deleting current date todos", error });
//   }
// };
