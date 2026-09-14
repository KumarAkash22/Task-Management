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

const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ task });
    } catch (error) {
        console.error("GET TASK ERROR:", error);
        res.status(500).json({ message: "Failed to fetch task" });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, priority, assignedDate, dueDate, status } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, priority, assignedDate, dueDate, status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error("UPDATE TASK ERROR:", error);
        res.status(500).json({ message: "Task update failed" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("DELETE TASK ERROR:", error);
        res.status(500).json({ message: "Task deletion failed" });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
}