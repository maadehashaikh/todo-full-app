const toDo = require("../model/todo.model");

exports.store = async (req, res, next) => {
  try {
    const todo = await toDo.create(req.body);
    return res.json({
      status: 200,
      success: true,
      message: "Task Created Successfully",
      todo,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.todayTask = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of today
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of today
    const todayTodo = await toDo.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    return res.json({
      status: 200,
      success: true,
      message: "Only Today's Tasks Fetched Successfully",
      todayTodo,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's tasks",
    });
  }
};

exports.index = (req, res, next) => {
  try {
  } catch {}
};

exports.get = (req, res, next) => {
  try {
  } catch {}
};

exports.destroy = (req, res, next) => {
  try {
  } catch {}
};

exports.update = (req, res, next) => {
  try {
  } catch {}
};
