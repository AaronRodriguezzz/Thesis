const jwt = require("jsonwebtoken");

const generateToken = (res, payload, role) => {
    console.log(role);
    
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );

    res.cookie(role, token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

module.exports = generateToken;
