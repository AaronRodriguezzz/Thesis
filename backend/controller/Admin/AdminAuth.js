const EmployeeAccount = require('../../models/EmployeeAccount');
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/tokenCreation');
const passwordVerification = require('../../utils/passwordVerification');

/**
 * @desc Logs in an admin/employee
 * @route POST /api/auth/login
 * @access Public
 */
const admin_login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const admin = await EmployeeAccount.findOne({ email }).select("+password");

        if (!admin) {
            return res.status(404).json({ message: 'Sorry, account does not exist' });
        }

        if(!passwordVerification(password, admin.password)){
            res.status(401).json({ message: 'Invalid credential' });
        }

        const adminObj = admin.toObject();
        const { password: _, ...payload } = adminObj;
        
        const tokenName = payload.role === 'Admin' ? 'admin' : 'frontdesk'
        console.log(tokenName);
        generateToken(res, payload, tokenName)

        res.status(200).json({ message: 'Access granted', user: admin });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

/**
 * @desc Checks if the user is authenticated
 * @route GET /api/auth/check
 * @access Private
 */
const checkAuth = (req, res) => {
    if (!req.employee) {
        return res.status(401).json({ loggedIn: false, message: 'Unauthorized' });
    }

    res.status(200).json({
        loggedIn: true,
        employee: req.employee
    });
};

module.exports = {
    admin_login,
    checkAuth,
};
