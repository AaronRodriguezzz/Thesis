const jwt = require("jsonwebtoken");

// Generic token verifier

const verifyEmployeeToken = (req, res, next) => {
  const adminToken = req.cookies.admin;
  const frontDeskToken = req.cookies.frontdesk;

  if (!adminToken && !frontDeskToken) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const token = adminToken || frontDeskToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["Admin", "Front Desk"].includes(decoded.role)) {
      return res.status(403).json({ message: "Access denied. Unauthorized role." });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

const verifyToken = (roleName) => {
  return (req, res, next) => {
    const token = req.cookies[roleName]; // read cookie by name (e.g. "user", "admin")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Optional: check role if you store it inside the JWT
      if (roleName === "admin" && decoded.role !== "Admin") {
        return res.status(403).json({ message: "Access denied." });
      }
      if (roleName === "frontdesk" && decoded.role !== "Front Desk") {
        return res.status(403).json({ message: "Access denied." });
      }
      if (roleName === "user" && !("role" in decoded)) {
        return res.status(403).json({ message: "Access denied." });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  };
};

module.exports = {
    verifyEmployeeToken,
    verifyToken
};
