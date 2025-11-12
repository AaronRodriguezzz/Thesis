const bcrypt = require('bcrypt'); // Ensure this is imported
const EmployeeAccount = require('../../models/EmployeeAccount');

/**
 * @desc Fetch paginated list of customers
 * @route GET /api/employees?page=1
 * @access Admin or Private
 */
const get_employees = async (req, res) => {
    try {

        const search = req.query?.search || '';

        const searchCondition = search
            ? {
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },       
                    { email: { $regex: search, $options: 'i' } },
                    { branchAssigned: { $regex: search, $options: 'i' } },
                    { role: { $regex: search, $options: 'i' } },
                    { status: { $regex: search, $options: 'i' } },
                ],
            }
        : {};

        // Fetch customers with pagination, sorted by most recent
        const employees = await EmployeeAccount.find(searchCondition)
            .select('-password') // Exclude password field
            .populate('branchAssigned')
            .sort({ createdAt: -1 })

        // Send customers and pagination info to frontend
        res.status(200).json({
            employees,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching customers.' });
    }
};


/**
 * @desc Fetch barbers in specific branch
 * @route GET /api/barbers/:branchId
 * @access Admin or Private
 */
const get_Barbers = async (req, res) => {
    
    const branchId = req.params.branchId;

    try {

        const barbers = await EmployeeAccount.find({ 
            branchAssigned: branchId, 
            role: 'Barber' 
        });

        res.status(200).json({ barbers });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching customers.' });
    }
};

/**
 * @desc Adds a new admin or employee account
 * @route POST /api/new_employees
 * @access Admin
 */
const new_admin = async (req, res) => {
    const { email,password, fullName, role, branchAssigned } = req.body;

    // Basic input validation
    if (!email || !fullName || !role || !password ) {
        res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if account already exists
        const user = await EmployeeAccount.findOne({
            $or: [{ email }, { fullName }]
        });

        if (user) {
            res.status(409).json({ message: 'Account already exists' });
        }

        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create and save new admin
        const newAdmin = new EmployeeAccount({
            fullName,
            role,
            branchAssigned: branchAssigned?.trim() ? branchAssigned : undefined,
            email,
            password: encryptedPassword,
        });

        await newAdmin.save();

        res.status(200).json({ message: 'New user added', added: true, user: newAdmin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

/**
 * @desc Updates an existing employee/admin account
 * @route PUT /api/update_employees
 * @access Admin
 */
const update_admin_account = async (req, res) => {
    const id = req.body.newData.id;
    
    try {
        const account = await EmployeeAccount.findByIdAndUpdate(
            id, 
            req.body.newData, 
            { new: true }
        ).populate('branchAssigned');

        if (!account) {
            res.status(404).json({ message: 'Account not found or update failed' });
        }

        res.status(200).json({ message: 'Update successful.', updatedInfo: account });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updatePassword = async (req,res) => {
    const { id, currentPassword, newPassword } = req.body.newData;

    if(!id || !currentPassword || !newPassword) {
        res.status(400).json({ message: 'Illegal Payload'})
    }

    try{

        const user = await EmployeeAccount.findById(id).select('password');

        if(!user){
            res.status(404).json({message: 'User does not exist'})
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if(!passwordMatch){
            res.status(400).json({message: 'User does not exist'})
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.password = encryptedPassword;  
        await user.save();

        res.status(200).json({ updated: true, message: 'Password Updated Successfully'})

    }catch(err){
        console.log(err);
        res.status(500).json({ message: err?.message || 'Internal server error'})
    }
}

/**
 * @desc Deletes an employee/admin account by ID
 * @route DELETE /api/employees/:id
 * @access Admin
 */
const delete_employee = async (req, res) => {
    const { id } = req.params;

    if(!id) res.status(404).json({message: 'Id Required'})
        
    try {
        const deletedEmployee = await EmployeeAccount.findByIdAndDelete(id);

        if (!deletedEmployee) {
            res.status(404).json({ message: 'Employee not found or already deleted' });
        }

        res.status(200).json({ message: 'Deletion successful', deleted: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err });
    }
};

module.exports = {
    get_employees,
    get_Barbers,
    new_admin,
    update_admin_account,
    delete_employee,
    updatePassword
};
