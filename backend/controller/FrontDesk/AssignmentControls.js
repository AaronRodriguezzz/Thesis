const Appointment = require('../../models/Appointment'); // Adjust the path if needed
const Employee = require('../../models/EmployeeAccount');
const WalkIn = require('../../models/WalkIn');
const ServiceSales = require('../../models/ServiceSales');
const Employees = require('../../models/EmployeeAccount');
const { updateQueueState } = require("../../utils/updateQueueState");

const initializeBarberAssignments = async (req, res) => {
    const branchId = req.params.branchId;
    
    try {
        const today = new Date();
        const start = new Date(today.setHours(0, 0, 0, 0));
        const end = new Date(today.setHours(23, 59, 59, 999));

        const [appointments, walkIns, barbers] = await Promise.all([
            Appointment.find({ branch: branchId, createdAt: { $gte: start, $lte: end } })
                .populate("customer service additionalService branch barber"),
            WalkIn.find({ branch: branchId, status: "Waiting", createdAt: { $gte: start, $lte: end } })
                .populate("service additionalService barber recordedBy"),
            Employees.find({ branchAssigned: branchId, role: "Barber" }),
        ]);

        updateQueueState(branchId, { appointments, walkIns, barbers });
        res.status(200).json({ branchId, appointments, walkIns, barbers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const assignCustomer = async (req, res) => {
  const { type: customerType } = req.params;
  const customer = req.body.newData;

  const modelMap = { "Walk-In": WalkIn, Appointment };
  const Model = modelMap[customerType];
  
  if (!Model) return res.status(400).json({ message: "Invalid customer type" });

  try {

    const [updatedCustomer, updatedBarber] = await Promise.all([
      Model.findByIdAndUpdate(customer.id, { barber: customer.barberId, status: "Assigned" }, { new: true }),
      Employee.findByIdAndUpdate(customer.barberId, { status: "Barbering", customerTypeAssigned: customerType }, { new: true }),
    ]);

    const branchId = updatedBarber.branchAssigned;
    const { barbers, appointments, walkIns } = global.queueState[branchId];

    updateQueueState(branchId, {

      barbers: barbers.map(b => (b._id.equals(updatedBarber._id) ? updatedBarber : b)),
      appointments: customerType === "Appointment"
        ? appointments.filter(a => !a._id.equals(updatedCustomer._id))
        : appointments,
      walkIns: customerType === "Walk-In"
        ? walkIns.filter(w => !w._id.equals(updatedCustomer._id))
        : walkIns,

    });

    res.status(200).json({ message: "Customer Assigned Successfully", updatedInfo: updatedCustomer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error assigning customer", error: err.message });
  }
};

const updateBarberStatus = async (req, res) => {

    try {
        const id = req.body.newData?._id;


        if (!id) {
            return res.status(400).json({ message: "Barber ID missing" });
        }

        // Update the employee account
        const updatedBarber = await Employees.findByIdAndUpdate(
            id,
            req.body.newData,
            { new: true }
        );

        if (!updatedBarber) {
            return res.status(404).json({ message: "Account not found or update failed" });
        }

        const branchId = updatedBarber.branchAssigned;

        // Ensure queue state for branch exists
        if (!global.queueState[branchId]) {
            global.queueState[branchId] = {
                barbers: [],
                appointments: [],
                walkIns: [],
            };
        }

        const currentQueue = global.queueState[branchId];

        const updatedBarbers = currentQueue.barbers.map((b) =>
            b._id.equals(updatedBarber._id) ? updatedBarber : b
        );

        updateQueueState(branchId, {
            ...currentQueue,
            barbers: updatedBarbers,
        });

        return res.status(200).json({
            message: "Update successful.",
            updatedInfo: updatedBarber,
        });
    } catch (err) {
        console.error("Error updating barber:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


const completeAssignment = async (req, res) => {
    const { paymentMethod, barberId, recordedBy } = req.body.newData;    
    const customerType = req.params.type;

    if(!paymentMethod || !barberId || !customerType || !recordedBy){
        return res.status(400).json({ message: 'Invalid Payload'})
    }
    
    try {

        const modelMap = { 
            'Walk-In': WalkIn,
            'Appointment': Appointment
        };

        const Model = modelMap[customerType];

        if (!Model) {
            return res.status(400).json({ message: 'Invalid customer type' });
        }

        let csToFinish = await Model.findOne({ barber: barberId, status: 'Assigned' });

        if (customerType === 'Appointment') {
            csToFinish = await csToFinish.populate('customer');
        }

        const [customer, barber] = await Promise.all([
            
            Model.findByIdAndUpdate(
                csToFinish._id,
                { status: 'Completed', paymentMethod },
                { new: true }
            ),

            Employee.findByIdAndUpdate(
                barberId,
                { status: 'Available', customerTypeAssigned: '' },
                { new: true }
            )
        ]);

        if (!customer && !barber) {
            return res.status(404).json({ message: 'Completing Service Error' });
        }   

        const sales = new ServiceSales({
            service: csToFinish.service,
            additionalService: csToFinish?.additionalService ? csToFinish.additionalService : undefined,
            customer: csToFinish.customer?.firstName || csToFinish.customerName || null,
            barber: barberId,
            branch: csToFinish.branch,
            dateOfSale: new Date(),
            price: csToFinish.totalAmount,
            paymentMethod,
            recordedBy
        })

        await sales.save();

        const branchId = barber.branchAssigned;

        if (!global.queueState[branchId]) {
            global.queueState[branchId] = {
                barbers: [],
                appointments: [],
                walkIns: [],
            };
        }

        const currentQueue = global.queueState[branchId];

        const updatedBarbers = currentQueue.barbers.map((b) =>
            b._id.equals(barber._id) ? barber : b
        );

        updateQueueState(branchId, {
            ...currentQueue,
            barbers: updatedBarbers,
        });

        return res.status(200).json({ message: 'Service Completed Successfully', updatedInfo: customer });
        

    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Error completing assignment', error: err.message });
    }
}

module.exports = {
    assignCustomer,
    completeAssignment,
    initializeBarberAssignments,
    updateBarberStatus
}


// const assignCustomer = async (req, res) => {
//     const customerType = req.params.type;
//     const customer = req.body.newData;


//     try {
//         const modelMap = { 
//             'Walk-In': WalkIn,
//             'Appointment': Appointment
//         };

//         const Model = modelMap[customerType];

//         if (!Model) {
//             return res.status(400).json({ message: 'Invalid customer type' });
//         }

//         const [updatedCustomer, updatedBarber] = await Promise.all([
//             Model.findByIdAndUpdate(
//                 customer.id,
//                 { barber: customer.barberId, status: 'Assigned' },
//                 { new: true }
//             ),
//             Employee.findByIdAndUpdate(
//                 customer.barberId,
//                 { status: 'Barbering', customerTypeAssigned: customerType },
//                 { new: true }
//             )
//         ]);

//         const branchId = updatedBarber.branchAssigned;
        

//         if (global.queueState[branchId]) {
//             const barbers = global.queueState[branchId].barbers.map(b =>
//                 b._id === updatedBarber._id ? updatedBarber : b
//             );

//             global.queueState[branchId].barbers = barbers;

//             if(customerType === 'Walk-In'){
//                 const walkIn = global.queueState[branchId].walkIns?.filter(w => 
//                     w._id !== updatedCustomer._id
//                 );  

//                 global.queueState[branchId].walkIns = walkIn
//             }else if(customerType === 'Appointment'){
//                 const appointments = global.queueState[branchId].appointment?.filter(a =>
//                     a._id !== updatedCustomer._id
//                 );

//                 global.queueState[branchId].appointments = appointments
//             }

//             console.log('after assigning', global.queueState[branchId].walkIns);
            
//             // Emit updated state
//             global.sendQueueUpdate({ branchId, ...global.queueState[branchId] });
//         }


//         if (!updatedCustomer || !updatedBarber) {
//             return res.status(404).json({ message: 'Assigning Customer Error' });
//         }

//         return res.status(200).json({
//             message: 'Customer Assigned Successfully',
//             updatedInfo: updatedCustomer
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: 'Error assigning customer',
//             error: err.message
//         });
//     }
// };


// const initializeBarberAssignments = async (req,res) => {
//     const branchId = req.params.branchId

//     try{

//         const startOfToday = new Date();
//         startOfToday.setHours(0, 0, 0, 0);

//         const endOfToday = new Date();
//         endOfToday.setHours(23, 59, 59, 999); 

//         const [appointments, walkIns, barbers] = await Promise.all([
//             Appointment.find({ 
//                 createdAt: { $gte: startOfToday, $lte: endOfToday }, 
//                 branch: branchId
//             })
//                 .populate('customer')
//                 .populate('service')
//                 .populate('additionalService')
//                 .populate('branch')
//                 .populate('barber'),

//             WalkIn.find({ 
//                 branch: branchId, 
//                 status: 'Waiting', 
//                 createdAt: { $gte: startOfToday, $lte: endOfToday } 
//             })
//                 .populate('service')
//                 .populate('additionalService')
//                 .populate('barber')
//                 .populate('recordedBy'),

//             Employees.find({ 
//                 branchAssigned: branchId, 
//                 role: 'Barber' 
//             })
//         ]);

//         if(!barbers){
//             return res.status(400).json({message: 'No Barber for this branch'})
//         }

//         global.queueState[branchId] = { appointments, walkIns, barbers };
//         global.sendQueueUpdate(branchId, global.queueState[branchId]);

//         return res.status(200).json({branchId, appointments, walkIns, barbers });
        
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({message: err.message});
//     }
// }