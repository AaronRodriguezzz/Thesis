const ServiceSales = require('../../models/ServiceSales');
const ProductSales = require('../../models/SalesRecord');
const Appointment = require('../../models/Appointment');
const CustomersAccounts = require('../../models/CustomerAccount');
const monthNumberToWord = require('../../utils/monthWord')
const timeData = require('../../public/timeData');

const cardDataControls = async (req, res) => {
    const branchId = req.params.branchId

    if(!branchId){
        return res.status(400).json({ message: 'Branch ID missing'})
    }

    try{
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); 
        
        const productsSales = await ProductSales.find();
        const serviceSales = await ServiceSales.find();
        const totalCustomers = await CustomersAccounts.countDocuments();
        const appointmentsToday = await Appointment.find({ 
            createdAt: { $gte: startOfToday, $lte: endOfToday }, 
            branch: branchId
        }).countDocuments();

        const totalProductSales = productsSales?.reduce((sum, s) => sum + s.totalPrice, 0) || 0; 
        const totalServiceSales = serviceSales?.reduce((sum, s) => sum + s.price, 0) || 0

        return res.status(200).json({ 
            totalProductSales,
            totalServiceSales,
            totalCustomers,
            appointmentsToday
        })

    }catch(err){
        console.log(err)
        res.status(500).json({message: err})
    }
}

const chartsDataControls = async (req,res) => {
    try{

        const productsSales = await ProductSales.find();
        const serviceSales = await ServiceSales.find();     

        console.log(serviceSales);
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
        // console.log(productSalesAggregated, serviceSalesAggregated);

        // const aggregatedByMonth = salesData.reduce((acc, curr) => {
        //     const existing = acc.find(item => item.month === curr.month);

        //     if (existing) {
        //         existing.services += curr.services;
        //         existing.products += curr.products;
        //         existing.total += curr.services + curr.products;
        //     } else {
        //         acc.push({
        //         month: curr.month,
        //         services: curr.services,
        //         products: curr.products,
        //         total: curr.services + curr.products,
        //         });
        //     }

        //     return acc;
        // }, []);


    }catch(err){
        console.log(err)
        res.status(500).json({message: err})
    }
}

module.exports = {
    cardDataControls,
    chartsDataControls
}