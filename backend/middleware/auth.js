const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const authorization = req.get("Authorization");
    const token = authorization && authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.sub };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authenticate;
