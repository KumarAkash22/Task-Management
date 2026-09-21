const express = require("express");

const {
    sendOTP, verifyOTP, register, login
} = require("../controllers/authController");
const { validate, authSchemas } = require("../middleware/validate");

const router = express.Router();

router.post("/send-otp", validate(authSchemas.email), sendOTP);
router.post("/verify-otp", validate(authSchemas.otp), verifyOTP);
router.post("/register", validate(authSchemas.register), register);
router.post("/login", validate(authSchemas.login), login);

module.exports = router;