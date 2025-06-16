const bcrypt = require('bcrypt'); // Ensure this is imported
const EmployeeAccount = require('../../models/EmployeeAccount');

/**
 * @desc Adds a new admin or employee account
 * @route POST /api/new_employees
 * @access Admin
 */
const new_admin = async (req, res) => {
    const { email,password, fullName, role, branchAssigned } = req.body;

    // Basic input validation
    if (!email || !fullName || !role || !password || !branchAssigned) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if account already exists
        const user = await EmployeeAccount.findOne({
            $or: [{ email }, { fullName }]
        });

        if (user) {
            return res.status(409).json({ message: 'Account already exists' });
        }

        // Hash the password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create and save new admin
        const newAdmin = new EmployeeAccount({
            fullName,
            role,
            branchAssigned,
            email,
            password: encryptedPassword,
        });

        const adminSave = await newAdmin.save();

        if (!adminSave) {
            return res.status(500).json({ message: 'Adding user unsuccessful' });
        }

        return res.status(201).json({ message: 'New user added', added: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
};

/**
 * @desc Updates an existing employee/admin account
 * @route PUT /api/update_employees
 * @access Admin
 */
const update_admin_account = async (req, res) => {
    const { id, email, fullName, role } = req.body;

    // Basic input validation
    if (!id || !email || !fullName || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        // Build the updated data object
        const updateData = { email, fullName, role };

        // Update the account
        const account = await EmployeeAccount.findByIdAndUpdate(id, updateData, { new: true });

        if (!account) {
            return res.status(404).json({ message: 'Account not found or update failed' });
        }

        return res.status(200).json({ message: 'Update successful', updatedInfo: account });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc Deletes an employee/admin account by ID
 * @route DELETE /api/employees/:id
 * @access Admin
 */
const delete_employee = async (req, res) => {
    const { id } = req.params;

    if(!id) return res.status(404).json({message: 'Id Required'})
        
    try {
        const deletedEmployee = await EmployeeAccount.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found or already deleted' });
        }

        return res.status(200).json({ message: 'Deletion successful' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
};

module.exports = {
    new_admin,
    update_admin_account,
    delete_employee
};
