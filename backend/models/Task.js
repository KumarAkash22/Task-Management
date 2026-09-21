const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
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

taskSchema.index({ owner: 1, createdAt: -1 });
taskSchema.index({ owner: 1, status: 1, priority: 1 });

module.exports = mongoose.model("Task", taskSchema);