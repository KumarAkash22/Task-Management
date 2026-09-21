const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "replace-with-a-long-random-secret") {
    throw new Error("JWT_SECRET is missing. Add a strong JWT_SECRET to backend/.env before starting the API.");
}

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes")

const app = express();

app.use(cors());
app.use(express.json());
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Request body must be valid JSON" });
    }
    next(error);
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "API is working"
    });
});

module.exports = app;