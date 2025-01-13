const express = require("express");
const router = express.Router();
const controller = require("../controllers/todo.controller");
const { authenticateToken } = require("../middleware");

router.post("/todos", authenticateToken, controller.createTodo); // create todo
router.get("/todos", controller.getAllTodos);
router.put("/todos/update/:id", authenticateToken, controller.updateTodo);
router.delete("/todos/deleteToday", authenticateToken, controller.deleteTodayTodo); // delete all the today todos
router.delete("/todos/:id", authenticateToken, controller.deleteTodo); // single item delete
router.get("/todos/today", authenticateToken, controller.getCurrentDateTodos);
router.get("/user/task-stats", authenticateToken, controller.getUserTaskStats);
// show only today's todo
router.get("/todos/not-today", authenticateToken, controller.getTodosExcludingCurrentDate); // show the history

router.patch("/todos/:id/status", authenticateToken, controller.updateTaskStatus);

module.exports = router;
