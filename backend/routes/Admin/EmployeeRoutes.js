const express = require('express');
const router = express.Router();
const Employee = require('../../controller/Admin/EmployeeControls');

router.get('/api/employees', Employee.get_employees);
router.get('/api/barbers/:branchId', Employee.get_Barbers);
router.post('/api/new_employee', Employee.new_admin);
router.put('/api/update_employee', Employee.update_admin_account);
router.delete('/api/delete_employee/:id', Employee.delete_employee);

module.exports = router;