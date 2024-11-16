const express = require("express");
const router = express.Router();
const controller = require("../controllers/todo.controller");

router.post("/todos", controller.createTodo); // create todo
router.get("/todos", controller.getAllTodos);
// router.put("/todos/:id", controller.updateTodo);
router.delete("/todos/deleteToday", controller.deleteTodayTodo); // delete all the today todos
router.delete("/todos/:id", controller.deleteTodo); // single item delete
router.get("/todos/today", controller.getCurrentDateTodos);
// show only today's todo
router.get("/todos/not-today", controller.getTodosExcludingCurrentDate); // show the history

router.patch("/todos/:id/status", controller.updateTaskStatus);

module.exports = router;
