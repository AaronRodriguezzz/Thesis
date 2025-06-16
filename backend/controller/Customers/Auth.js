const UserAccount = require('../../models/CustomerAccount');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @desc Logs in a user
 * @route POST /api/user/login
 */
const user_login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await UserAccount.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Sorry, account does not exist' });
        }

        // Compare the password
        const password_compare = await bcrypt.compare(password, user.password);

        if (!password_compare) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Remove password from user object
        const userObj = user.toObject();
        const { password: _, ...userAccount } = userObj;

        // Create JWT token
        const token = jwt.sign(
            { user: userAccount },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Store token in cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({ message: 'Log In Successful', token });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

/**
 * @desc Logs out the user
 * @route POST /api/user/logout
 */
const user_logout = (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Logout error' });
    }
};

/**
 * @desc Registers a new user
 * @route POST /api/user/register
 */
const account_registration = async (req, res) => {
    console.log(req.body);

    const {
        email,
        lastName,
        firstName,
        phone,
        password
    } = req.body;


    try {
        // Check if account exists
        const existingUser = await UserAccount.findOne({
            $or: [{ email }]
        });

        if (existingUser) {
            return res.status(404).json({ message: 'Account already exists' });
        }

        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new UserAccount({
            firstName,
            lastName,
            phone,
            email,
            password: encryptedPassword,
        });

        const userSave = await newUser.save();

        if (!userSave) {
            return res.status(500).json({ message: 'Adding user unsuccessful' });
        }

        return res.status(200).json({ message: 'New user added', added: true });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc Updates an existing user's profile
 * @route PUT /api/auth/update_user
 */
const update_account = async (req, res) => {
    const { id, email, lastName, firstName, phone } = req.body;

    try {
        const updateData = { email, lastName, firstName, phone };

        const account = await UserAccount.findByIdAndUpdate(id, updateData, { new: true });

        if (!account) {
            return res.status(404).json({ message: 'Updating Failed' });
        }

        return res.status(200).json({ message: 'Updating Successful', updatedInfo: account });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc Verifies user's login session
 * @route GET /api/auth/user_check
 */
const checkAuth = (req, res) => {
    res.status(200).json({ loggedIn: true, user: req.employee });
};

module.exports = {
    user_login,
    user_logout,
    account_registration,
    checkAuth,
    update_account
};
