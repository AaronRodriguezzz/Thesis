const express = require('express');
const router = express.Router();
const Employee = require('../../controller/Admin/EmployeeControls');
const { verifyToken, verifyEmployeeToken } = require('../../middleware/Auth');

router.get('/api/employees', verifyToken('admin'),  Employee.get_employees);
router.get('/api/barbers/:branchId', verifyEmployeeToken, Employee.get_Barbers);
router.post('/api/new_employee', verifyToken('admin'), Employee.new_admin);
router.put('/api/update_employee',verifyEmployeeToken, Employee.update_admin_account);
router.put('/api/update_password',verifyToken('admin'), Employee.updatePassword);
router.delete('/api/delete_employee/:id', verifyToken('admin'), Employee.delete_employee);

module.exports = router;