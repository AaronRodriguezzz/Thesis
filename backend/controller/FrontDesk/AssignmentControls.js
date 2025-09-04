const Appointment = require('../../models/Appointment'); // Adjust the path if needed
const Employee = require('../../models/EmployeeAccount');
const WalkIn = require('../../models/WalkIn');
const ServiceSales = require('../../models/ServiceSales');
const Employees = require('../../models/EmployeeAccount');

const initializeBarberAssignments = async (req,res) => {
    const branchId = req.params.branchId

    try{

        const currentHour = new Date().getHours();

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); 

        const [appointments, walkIns, barbers] = await Promise.all([
            Appointment.find({ 
                createdAt: { $gte: startOfToday, $lte: endOfToday }, 
                scheduledTime: currentHour, 
                branch: branchId
            })
                .populate('customer')
                .populate('service')
                .populate('additionalService')
                .populate('branch')
                .populate('barber'),

            WalkIn.find({ 
                branch: branchId, 
                status: 'Waiting', 
                createdAt: { $gte: startOfToday, $lte: endOfToday } 
            })
                .populate('service')
                .populate('additionalService')
                .populate('barber')
                .populate('totalAmount')
                .populate('recordedBy'),

            Employees.find({ 
                branchAssigned: branchId, 
                role: 'Barber' 
            })
        ]);

        if(!barbers){
            return res.status(400).json({message: 'No Barber for this branch'})
        }

        global.queueState[branchId] = { appointments, walkIns, barbers };
        
        global.sendQueueUpdate({branchId, appointments, walkIns, barbers });
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

const assignCustomer = async (req, res) => {
    const customerType = req.params.type;
    const customer = req.body.newData;

    console.log('Assigning customer:', customerType, customer);

    try {
        const modelMap = { 
            'Walk-In': WalkIn,
            'Appointment': Appointment
        };

        const Model = modelMap[customerType];

        if (!Model) {
            return res.status(400).json({ message: 'Invalid customer type' });
        }

        const [updatedCustomer, updatedBarber] = await Promise.all([
            Model.findByIdAndUpdate(
                 customer.id,
                { barber: customer.barberId, status: 'Assigned' },
                { new: true }
            ),
            Employee.findByIdAndUpdate(
                customer.barberId,
                { status: 'Barbering', customerTypeAssigned: customerType },
                { new: true }
            )
        ]);

        const branchId = updatedBarber.branchAssigned;

        if (global.queueState[branchId]) {
            const barbers = global.queueState[branchId].barbers.map(b =>
                b._id === updatedBarber._id ? updatedBarber : b
            );

            global.queueState[branchId].barbers = barbers;

            if(customerType === 'Walk-In'){
                const walkIn = global.queueState[branchId].walkIn.filter(w => 
                    w._id !== updatedCustomer._id
                );  

                global.queueState[branchId].walkIn = walkIn
            }
            
            // Emit updated state
            global.sendQueueUpdate({ branchId, ...global.queueState[branchId] });
        }


        if (!updatedCustomer || !updatedBarber) {
            return res.status(404).json({ message: 'Assigning Customer Error' });
        }

        return res.status(200).json({
            message: 'Customer Assigned Successfully',
            updatedInfo: updatedCustomer
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error assigning customer',
            error: err.message
        });
    }
};



const completeAssignment = async (req, res) => {
    const { paymentMethod, barberId, recordedBy } = req.body.newData;    
    const customerType = req.params.type;

    if(!paymentMethod || !barberId || !customerType || !recordedBy){
        return res.status(400).json({ message: 'Invalid Payload'})
    }

    console.log(req.body.newData);

    try {

        const modelMap = { 
            'Walk-In': WalkIn,
            'Appointment': Appointment
        };

        const Model = modelMap[customerType];
        if (!Model) {
            return res.status(400).json({ message: 'Invalid customer type' });
        }

        const csToFinish = await Model.findOne({ barber: barberId, status: 'Assigned' });

        if(customerType === 'Appointment'){
            csToFinish.populate('customer')
        }

        console.log(csToFinish);

        const sales = new ServiceSales({
            service: csToFinish.service,
            additionalService: csToFinish?.additionalService.trim() ? csToFinish.additionalService : undefined,
            customer: csToFinish.customer?.firstName || csToFinish.customerName || null,
            barber: barberId,
            branch: csToFinish.branch,
            dateOfSale: new Date(),
            price: csToFinish.totalAmount,
            paymentMethod,
            recordedBy
        })

        await sales.save();

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

        

        return res.status(200).json({ message: 'Service Completed Successfully', updatedInfo: customer });
        

    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Error completing assignment', error: err.message });
    }
}

module.exports = {
    assignCustomer,
    completeAssignment,
    initializeBarberAssignments
}