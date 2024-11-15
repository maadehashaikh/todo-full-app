const express = require("express");
const router = express.Router();
const controller = require("../controllers/todo.controller");

router.post("/todos", controller.createTodo); // create todo
router.get("/todos", controller.getAllTodos);
router.put("/todos/:id", controller.updateTodo);
router.delete("/todos/:id", controller.deleteTodo);
router.get("/todos/today", controller.getCurrentDateTodos); // show only today's todo
router.get("/todos/not-today", controller.getTodosExcludingCurrentDate); // show the history
router.delete("/todos/deleteAll-today", controller.deleteTodayTodo); // delete all the today todos

module.exports = router;
