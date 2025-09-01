const bcrypt = require('bcrypt'); // Ensure this is imported
const EmployeeAccount = require('../../models/EmployeeAccount');

/**
 * @desc Fetch paginated list of customers
 * @route GET /api/employees?page=1
 * @access Admin or Private
 */
const get_employees = async (req, res) => {
    try {
        // Get the current page number from the query; default to 1
        const page = parseInt(req.query.page) || 1;

        // Set how many customers to return per page
        const limit = 10;

        // Calculate how many customers to skip
        const skip = (page - 1) * limit;
 
        // Count total number of customers (for pagination calculation)
        const totalCount = await EmployeeAccount.countDocuments(); // ❗ Fixed: was mistakenly using Request

        // Fetch customers with pagination, sorted by most recent
        const employees = await EmployeeAccount.find()
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 }) // Show latest first
            .skip(skip)
            .limit(limit);

        // Calculate total pages needed (rounded up)
        const pageCount = Math.ceil(totalCount / limit);

        // Send customers and pagination info to frontend
        return res.status(200).json({
            employees,
            pageCount
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error fetching customers.' });
    }
};


/**
 * @desc Fetch barbers in specific branch
 * @route GET /api/barbers/:branchId
 * @access Admin or Private
 */
const get_Barbers = async (req, res) => {
    
    const branchId = req.params.branchId;

    if (!branchId) {
        return res.status(400).json({ message: 'Branch Missing' });
    }

    try {

        // Fetch customers with pagination, sorted by most recent
        const barbers = await EmployeeAccount.find({ 
            branchAssigned: branchId, 
            role: 'Barber' 
        });

        return res.status(200).json({ barbers });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error fetching customers.' });
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
            branchAssigned: branchAssigned?.trim() ? branchAssigned : undefined,
            email,
            password: encryptedPassword,
        });

        const adminSaved = await newAdmin.save();

        if (!adminSaved) {
            return res.status(500).json({ message: 'Adding user unsuccessful' });
        }

        return res.status(200).json({ message: 'New user added', added: true, user: adminSaved });
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

    try {
        // Build the updated data object
        const id = req.body.newData._id;


        // Update the account
        const account = await EmployeeAccount.findByIdAndUpdate(id, req.body.newData, { new: true });

        if (!account) {
            return res.status(404).json({ message: 'Account not found or update failed' });
        }

        const branchId = account.branchAssigned.toString();

        if (global.queueState[branchId]) {
            const barbers = global.queueState[branchId].barbers.map(b =>
                b._id.toString() === account._id.toString() ? account : b
            );

            global.queueState[branchId].barbers = barbers;

            // Emit updated state
            global.sendQueueUpdate({ branchId, ...global.queueState[branchId] });
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

        return res.status(200).json({ message: 'Deletion successful', deleted: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
};

module.exports = {
    get_employees,
    get_Barbers,
    new_admin,
    update_admin_account,
    delete_employee
};
