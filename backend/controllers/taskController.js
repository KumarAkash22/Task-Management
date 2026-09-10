const Task = require("../models/Task")

const createTask = async (req, res) => {
    try {
        const { title, description, priority, assignedDate, dueDate, status } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }
        const task = await Task.create({
            title,
            description: description || "",
            priority: priority || "Medium",
            assignedDate: assignedDate || new Date(),
            dueDate: dueDate || null,
            status: status || "Pending"
        });
        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        console.error("CREATE TASK ERROR:", error);

        res.status(500).json({
            message: "Task creation failed"
        });
    }
}

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.json({
            tasks
        });
    } catch (error) {
        console.error("GET TASKS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
};

module.exports = {
    createTask,
    getTasks
}