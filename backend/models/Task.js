const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium"
        },
        assignedDate: {
            type: Date,
            default: Date.now
        },
        dueDate: {
            type: Date,
            default: null
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);