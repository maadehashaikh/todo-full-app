const express = require("express");
const router = express.Router();
const controller = require("../controllers/todo.controller");

router.post("/", controller.store); // to save in db
router.get("/", controller.todayTask); // use to fetch tasks only that are of today 
router.get("/", controller.index); // use for listing
router.get("/:id", controller.get); // use to fetch data from db
router.delete("/:id", controller.destroy); // delete from db
router.put("/:id", controller.update); // to update item from db

module.exports = router;
