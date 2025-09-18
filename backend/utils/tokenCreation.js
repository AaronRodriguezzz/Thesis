const jwt = require("jsonwebtoken");

const generateToken = (res, payload) => {
    console.log(payload);
    const user = payload.toObject ? payload.toObject() : { ...payload };
    delete user.password;

    const token = jwt.sign(
        user, 
        process.env.JWT_SECRET, 
        { expiresIn: "1d" }
    );

    res.cookie('user', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
};

module.exports = generateToken;
