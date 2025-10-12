const EmployeeAccount = require('../../models/EmployeeAccount');
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/tokenCreation');
/**
 * @desc Logs in an admin/employee
 * @route POST /api/auth/login
 * @access Public
 */
const admin_login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if account exists
        const user = await EmployeeAccount.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({ message: 'Sorry, account does not exist' });
        }

        // Compare passwords using bcrypt
        const password_compare = await bcrypt.compare(password, user.password);
        if (!password_compare) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Convert Mongoose document to plain object and remove password
        const adminObj = user.toObject();
        const { password: _, ...employee } = adminObj;
        
        console.log('employee in the controller', employee);
        generateToken(res, employee)

        // Send success response
        return res.status(200).json({
            message: 'Login successful',
            employee
        });

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
