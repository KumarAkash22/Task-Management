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
        const { search, status, priority, sortDueDate } = req.query;
        const filter = {};
        const validStatuses = ["Pending", "In Progress", "Completed"];
        const validPriorities = ["High", "Medium", "Low"];

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.title = { $regex: escapedSearch, $options: "i" };
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid task status filter" });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ message: "Invalid task priority filter" });
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        let tasksQuery = Task.find(filter);

        if (sortDueDate === "asc" || sortDueDate === "desc") {
            tasksQuery = Task.aggregate([
                { $match: filter },
                {
                    $addFields: {
                        dueDateMissing: {
                            $cond: [{ $eq: ["$dueDate", null] }, 1, 0]
                        }
                    }
                },
                {
                    $sort: {
                        dueDateMissing: 1,
                        dueDate: sortDueDate === "asc" ? 1 : -1,
                        createdAt: -1
                    }
                },
                { $project: { dueDateMissing: 0 } }
            ]);
        } else {
            tasksQuery = tasksQuery.sort({ createdAt: -1 });
        }

        const tasks = await tasksQuery;

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