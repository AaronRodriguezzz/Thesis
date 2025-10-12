const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.user;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== undefined) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.user; // same cookie

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Only allow users with an admin role
        if (!decoded.role === 'Front Desk' || !decoded.role === 'Admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};


module.exports = {
    verifyToken,
    verifyAdminToken
}