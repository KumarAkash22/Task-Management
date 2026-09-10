const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
    "EMAIL_PASSWORD exists:",
    !!process.env.EMAIL_PASSWORD
);

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes")

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "API is working"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});