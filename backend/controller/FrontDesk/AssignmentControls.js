const Appointment = require('../../models/Appointment'); // Adjust the path if needed
const WalkInSales = require('../../models/WalkInSales'); // Import WalkInSales model


const assignCustomer = async (req, res) => {
    const customerType = req.params.type;
    const customer = req.body;
    
    try{
        if (customerType === 'WalkIn') {
            // Create a new WalkInSales entry
            const walkInCustomer = new WalkInSales({
                customerName: customer.name || 'Anonymous',
                service: customer.service,
                additionalServices: customer.additionalServices,
                barber: customer.barber,
                branch: customer.branch,
                totalAmount: customer.totalAmount,
                paymentMethod: customer.paymentMethod,
                recordedBy: req.user._id,
            });

            await walkInSale.save();
            res.status(201).json({ message: 'Walk-in customer assigned successfully', walkInCustomer });
        } else if (customerType === 'appointment') {
            // Handle appointment assignment logic here
            const appointment = new Appointment({
                ...customer,
                recordedBy: req.user._id, // Assuming req.user is set with the authenticated user
            });

            await appointment.save();
            res.status(201).json({ message: 'Appointment assigned successfully', appointment });
        } else {
            res.status(400).json({ message: 'Invalid customer type' });
        }
    }catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Error assigning customer', error: err.message });
    }
}