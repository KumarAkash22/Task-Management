const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const transporter = require("../config/mailer");
const jwt = require("jsonwebtoken");

const createToken = (user) => jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
);

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const otp = Math.floor(
            1000 + Math.random() * 9000
        ).toString();

        const otpHash = await bcrypt.hash(otp, 10);

        await OTP.deleteMany({
            email: normalizedEmail
        });

        await OTP.create({
            email: normalizedEmail,
            otpHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: normalizedEmail,
            subject: "Your OTP",
            text: `Your OTP is ${otp}. It will expire in 5 minutes.`
        });

        res.json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("SEND OTP ERROR:", error);

        res.status(500).json({
            message: "Failed to send OTP",
            error: error.message
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "OTP not found"
            });
        }

        if (otpRecord.verified) {
            return res.status(400).json({
                message: "OTP already used"
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        const isValid = await bcrypt.compare(
            otp,
            otpRecord.otpHash
        );

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        otpRecord.verified = true;

        await otpRecord.save();

        res.json({
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "OTP verification failed"
        });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            verified: true
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Please verify your email first"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            isEmailVerified: true
        });

        await OTP.deleteMany({
            email: normalizedEmail
        });

        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Registration failed"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            token: createToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
};

module.exports = {
    sendOTP, verifyOTP, register, login
};