const Appointment = require('../../models/Appointment'); // Adjust the path if needed
const Employee = require('../../models/EmployeeAccount');
const WalkIn = require('../../models/WalkIn');

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
    const { paymentMethod, barberId } = req.body.newData;    
    const customerType = req.params.type;

    if(!paymentMethod, !barberId, !customerType){
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

        const csToFinish = await Model.findOne({ barber: barberId, status: 'Assigned' });

        const [customer, barber] = await Promise.all([
            
            await Model.findByIdAndUpdate(
                csToFinish._id,
                { status: 'Completed', paymentMethod },
                { new: true }
            ),

            await Employee.findByIdAndUpdate(
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
    completeAssignment
}