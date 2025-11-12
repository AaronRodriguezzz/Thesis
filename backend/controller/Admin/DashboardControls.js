const ServiceSales = require('../../models/ServiceSales');
const ProductSales = require('../../models/SalesRecord');
const Appointment = require('../../models/Appointment');
const CustomersAccounts = require('../../models/CustomerAccount');
const monthNumberToWord = require('../../utils/monthWord')
const timeData = require('../../public/timeData');

const cardDataControls = async (req, res) => {
    const branchId = req.params.branchId

    try{
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); 

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const query = branchId ? { branch: branchId } : {};
        
        const totalCustomers = await CustomersAccounts.countDocuments();
        const productsSales = await ProductSales.find(query)
            .populate('products.product')  
            .populate('soldBy')       
            .populate('branch')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const serviceSales = await ServiceSales.find(query)
            .populate('service')       
            .populate('barber')
            .populate('branch')
            .populate('recordedBy')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        let appointmentQuery = { 
            scheduledDate: { $gte: startOfToday, $lte: endOfToday }, 
            status: 'Booked'
        }

        if (branchId) {
            appointmentQuery.branch = branchId;
        }            

        const appointmentsToday = await Appointment.countDocuments(appointmentQuery);

        const totalProductSales = productsSales?.reduce((sum, s) => sum + s.totalPrice, 0) || 0; 
        const servicesCompleted = serviceSales?.reduce((sum, s) => sum + 1, 0) || 0
        
        res.status(200).json({ 
            productsSales, 
            serviceSales,
            totalProductSales,
            servicesCompleted,
            totalCustomers,
            appointmentsToday
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message: err})
    }
}

const chartsDataControls = async (req,res) => {
    const branchId = req.params.branchId

    try{
        const query = branchId ? { branch: branchId } : {};

        const productsSales = await ProductSales.find(query);
        const serviceSales = await ServiceSales.find(query);     

        const productSalesAggregated = productsSales.reduce((acc, curr) => {
            const existing = acc.find(item => item.month === monthNumberToWord(new Date(curr.createdAt).getMonth()))

            if(existing) {
                existing.productTotal += curr.totalPrice
            }else{
                acc.push({
                    month: monthNumberToWord(new Date(curr.createdAt).getMonth()),
                    productTotal: curr.totalPrice
                })
            }

            return acc
        }, [])

        const serviceSalesAggregated = serviceSales.reduce((acc, curr) => {
            const existing = acc.find(item => item.month === monthNumberToWord(new Date(curr.createdAt).getMonth()))

            if(existing) {
                existing.serviceTotal += curr.price
            }else{
                acc.push({
                    month: monthNumberToWord(new Date(curr.createdAt).getMonth()),
                    serviceTotal: curr.price
                })
            }

            return acc
        }, [])

        const mergedAggregated = [];

        // First, add all product sales
        productSalesAggregated.forEach(prod => {
            mergedAggregated.push({ month: prod.month, product: prod.productTotal, service: 0});
        });

        // Then, merge service sales
        serviceSalesAggregated.forEach(service => {
            const existing = mergedAggregated.find(item => item.month === service.month);
            if (existing) {
                existing.service = service.serviceTotal;
            } else {
                mergedAggregated.push({ month: service.month, product: 0, service: service.serviceTotal });
            }
        });

        let peakHours = [];

        // Initialize peakHours with all hours
        timeData.forEach(time => {
            peakHours.push({ hour: time.hour, value: time.value, customer: 0 });
        });

        // Count customers per hour
        serviceSales.forEach(service => {
            const hour = new Date(service.createdAt).getHours();
            const existing = peakHours.find(time => time.value === hour);

            if (existing) {
                existing.customer += 1;
            }
        });


        res.status(200).json({ salesChart: mergedAggregated, peakHours })

    }catch(err){
        console.log(err)
        res.status(500).json({message: err})
    }
}

module.exports = {
    cardDataControls,
    chartsDataControls
}