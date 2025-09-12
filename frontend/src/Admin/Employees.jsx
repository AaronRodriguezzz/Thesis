import React, { useEffect, useState, useMemo } from "react";
import { FaUsers, FaUserPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Pagination from "@mui/material/Pagination";
import { get_data } from "../../services/GetMethod";
import { delete_data } from "../../services/DeleteMethod";
import UpdateEmployee from "../../components/modal/UpdateEmployeeModal";
import NewEmployee from "../../components/modal/AddEmployeeModal";

const Employees = () => {
 
    const [employeeList, setEmployeeList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [paginationLimit, setPaginationLimit] = useState(1);
    const [filterValue, setFilterValue] = useState('');
    const [onUpdate, setOnUpdate] = useState(false);
    const [updatingData, setUpdatingData] = useState(null);
    const [addingEmployee, setAddingEmployee] = useState(false);

    const filteredEmployees = useMemo(() => {
        return employeeList && employeeList.filter(employee =>
            employee?.email.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee?.fullName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee?.branchAssigned.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee?.role.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employeeList, searchTerm]);


    const handle_delete = async (id) => {
        const data = await delete_data(id, '/delete_employee');

        if (data.deleted) {
            setEmployeeList(prev => prev.filter(customer => customer._id !== id));
        }
    }

    const handle_update = async (data) => {
        setOnUpdate(true);
        setUpdatingData(data);
    }


    useEffect(() => {
        const get_employees = async () => {
            const data = await get_data('/employees', page);
        
            //exclude the barber's password
            if (data) {
                setEmployeeList(data.employees);
                setPaginationLimit(data.pageCount);
            }
        };
        get_employees();
    }, [page]);

    return (
        <div>
            <main className="p-4 w-full">

                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="w-full bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="relative w-full sm:w-auto flex-grow">
                                <input 
                                    type="text"
                                    placeholder="Search employees (Name, Role, Email)..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>

                            <button 
                                className="flex items-center gap-2 bg-gray-700 py-2 px-4 text-white rounded-full tracking-tighter text-sm"
                                onClick={() => setAddingEmployee(true)}
                            > 
                                <FaUserPlus /> 
                                Add Employee 
                            </button>
                        </div>

                        <div className="w-full bg-white p-6 rounded-lg shadow">

                        <div className="flex justify-between items-center my-4 text-sm">
                           
                            <h2 className="text-xl font-semibold mb-4 tracking-tight">Employees Table</h2>

                            <Pagination
                                count={paginationLimit}
                                size="small"
                                page={page}
                                onChange={(event, value) => setPage(value)}
                            />
                        </div>

                        <div className="overflow-auto h-[550px] w-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Full Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Branch Assigned</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee._id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{employee?.fullName}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight">{employee?.email}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight text-left">{employee.branchAssigned?.name || 'N/A'}</td>
                                            <td 
                                                className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 tracking-tight" 
                                                style={employee?.role === 'Barber' ? { color: 'green' } : { color: 'blue' } }
                                            >
                                                {employee?.role}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_update(employee)}>
                                                        <FaEdit size={17} />
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-800" onClick={() => handle_delete(employee?._id)}>
                                                        <FaTrash size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
            </main>

            {onUpdate && updatingData && 
                <UpdateEmployee 
                    currentData={updatingData} 
                    onCancel={setOnUpdate} 
                    setUpdatedData={setEmployeeList}
                    route={'/update_employee'}
                />
            }

            {addingEmployee && 
                <NewEmployee 
                    setUpdatedData={setEmployeeList}
                    onCancel={setAddingEmployee} 
                    route={'/new_employee'}
                />
            }
        </div>
    );
};

export default Employees;