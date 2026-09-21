const express = require("express");
const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");
const authenticate = require("../middleware/auth");
const { validate, task } = require("../middleware/validate");

const router = express.Router();

router.use(authenticate);
router.post("/", validate(task), createTask);
router.get("/", getTasks);
router.get("/:id", getTask);
router.put("/:id", validate(task), updateTask);
router.delete("/:id", deleteTask);

module.exports = router;