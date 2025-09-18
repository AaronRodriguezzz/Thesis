const UserAccount = require('../../models/CustomerAccount');
const bcrypt = require('bcrypt');
const generateToken = require('../../utils/tokenCreation');
const { send_verification_code } = require('../../Services/EmailService');
const passwordVerification = require('../../utils/passwordVerification');

/**
 * @desc Logs in a user
 * @route POST /api/user/login
 */
const user_login = async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: 'Invalid Input' });
    }

    try {
        const user = await UserAccount.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'Sorry, account does not exist' });
        }

        if(!passwordVerification(password, user.password)){
            res.status(401).json({ message: 'Invalid credentials' });
        }

        generateToken(res, user)

        return res.status(200).json({ message: 'Log In Successful', user });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

const googleLogin = async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return res.status(400).json({ message: "Invalid Payload" });
    }

    try {

        const googleRes = await fetch( "https://www.googleapis.com/oauth2/v3/userinfo",
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const { email, family_name, given_name } = await googleRes.json();

        let user = await UserAccount.findOne({ email });
        
        if (!user) {
        user = await UserAccount.create({
            email,
            lastName: family_name,
            firstName: given_name,
        });
        }

        generateToken(res, user);
        return res.status(200).json({ message: "Log In Successful", user });
    } catch (err) {
        console.error("Google login error:", err);
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
        const existingUser = await UserAccount.findOne({ email });

        if (existingUser) {
            return res.status(404).json({ message: 'Account already exists' });
        }

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

        const { password: _pw, ...securedUser } = userSave._doc;

        return res.status(200).json({ message: 'New user added', added: true, user: securedUser});

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
    const { _id, email, lastName, firstName, phone, address } = req.body.newData;
    console.log(req.body.newData);  

    try {
        const updateData = { email, lastName, firstName, phone, address };

        const account = await UserAccount.findByIdAndUpdate(_id, updateData, { new: true });

        if (!account) {
            return res.status(404).json({ message: 'Updating Failed' });
        }

        return res.status(200).json({ message: 'Updating Successful', updatedInfo: account });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updatePassword = async (req,res) => {
    const { id, currentPassword, newPassword } = req.body.newData;

    if(!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Illegal Payload'})
    }

    try{

        const user = await UserAccount.findById(id).select('password');

        if(!user){
            return res.status(404).json({message: 'User does not exist'})
        }


        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if(!passwordMatch){
            return res.status(400).json({message: 'User does not exist'})
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.password = encryptedPassword;  
        await user.save();

        return res.status(200).json({ updated: true, message: 'Password Updated Successfully'})

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: err?.message || 'Internal server error'})
    }
}

const send_code = async (req,res) => {

    const { email } = req.body;
    
    if(!email) {
        return res.status(400).json({ message: 'Payload Empty'})
    }

    try{

        const emailExist = await UserAccount.findOne({ email })

        if(!emailExist) {
            return res.status(404).json({message: 'User does not exist'})
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString();

        await send_verification_code(email,code);

        return res.status(200).json({code, message: 'Verification Code Sent'})
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: err?.message || 'Internal server error'})
    }
}

const forget_password = async (req,res) => {
    const { email, password } = req.body.newData;

    if(!email || !password) {
        return res.status(400).json({ message: 'Payload Empty'})
    }

    console.log( req.body.newData)
    try{
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await UserAccount.findOneAndUpdate(
            { email: email }, 
            { $set: { password: encryptedPassword } },
        );

        if(!user){
            return res.status(400).json({message: 'Error Update'})
        }

        return res.status(200).json({ updated: true })

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: err?.message || 'Internal server error'})
    }
}

/**
 * @desc Verifies user's login session
 * @route GET /api/auth/user_check
 */
const checkAuth = (req, res) => {
    res.status(200).json({ loggedIn: true, user: req.employee });
};


module.exports = {
    user_login,
    googleLogin,
    user_logout,
    account_registration,
    checkAuth,
    update_account,
    updatePassword,
    send_code,
    forget_password
};
