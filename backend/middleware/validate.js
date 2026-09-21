const isEmail = (value) => (
    typeof value === "string"
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
);

const validate = (schema) => (req, res, next) => {
    const errors = schema(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors
        });
    }

    next();
};

const authSchemas = {
    email: (body) => {
        const errors = [];
        if (!isEmail(body.email)) errors.push("A valid email is required");
        return errors;
    },
    otp: (body) => {
        const errors = authSchemas.email(body);
        if (!/^\d{4}$/.test(body.otp || "")) errors.push("OTP must be 4 digits");
        return errors;
    },
    register: (body) => {
        const errors = authSchemas.email(body);
        if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 100) {
            errors.push("Name must be between 2 and 100 characters");
        }
        if (typeof body.password !== "string" || body.password.length < 8 || body.password.length > 128) {
            errors.push("Password must be between 8 and 128 characters");
        }
        return errors;
    },
    login: (body) => {
        const errors = authSchemas.email(body);
        if (typeof body.password !== "string" || body.password.length === 0) {
            errors.push("Password is required");
        }
        return errors;
    }
};

const task = (body) => {
    const errors = [];
    if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim().length < 1 || body.title.trim().length > 200)) {
        errors.push("Title must be between 1 and 200 characters");
    }
    if (body.description !== undefined && (typeof body.description !== "string" || body.description.length > 5000)) {
        errors.push("Description cannot exceed 5000 characters");
    }
    if (body.priority !== undefined && !["High", "Medium", "Low"].includes(body.priority)) {
        errors.push("Invalid priority");
    }
    if (body.status !== undefined && !["Pending", "In Progress", "Completed"].includes(body.status)) {
        errors.push("Invalid status");
    }
    for (const field of ["assignedDate", "dueDate"]) {
        if (body[field] !== undefined && body[field] !== null && Number.isNaN(Date.parse(body[field]))) {
            errors.push(`${field} must be a valid date`);
        }
    }
    return errors;
};

module.exports = { validate, authSchemas, task };
