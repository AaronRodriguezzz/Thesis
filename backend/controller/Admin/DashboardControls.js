const Appointment = require('../../models/Appointment');
const Sales = require('../../models/SalesRecord');
const Customers = require('../../models/CustomerAccount');
const WalkIn = require('../../models/WalkIn');

const dashboardCardsData = async (req,res) => {
    try{
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const [customers, appointments, sales, walkIn] = await Promise.all([
            Customers.find({ status: 'Active'}), 
            Appointment.find({updatedAt: { 
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }})
            .populate('service')
            .populate('additionalService'),
            Sales.find(),
            WalkIn.find({updatedAt: { 
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }})
        ])

        let monthlyRevenue = 0;

        monthlyRevenue += appointments
        .filter(a => a.status !== 'Finished')
        .reduce((sum, b) => sum + (b.totalAmount), 0);

        monthlyRevenue += walkIn
        .filter(a => a.status !== 'Finished')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);


        let productRevenue = 0;
        productRevenue = sales.reduce((sum, b) => sum + (b.totalPrice || 0), 0);


        return res.status(200).json({ 
            customers: customers.length, 
            appointmentsThisMonth: appointments.length,
            monthlyRevenue,
            productRevenue
        })

        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'Error'})
    }
}

const graphData = async (req,res) => {

    try{
         const appointmentByStatus = await Appointment.aggregate([
            {
                $group: {
                    _id: "$status",    
                    total: { $sum: 1 }     
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id", 
                    total: 1
                }
            }
        ]);

        const revenueByBranch = await Appointment.aggregate([
            {   
                $match: { status: 'Completed' }
            },
            {
                $group: {
                    _id: "$branch",
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "branches",           
                    localField: "_id",           
                    foreignField: "_id",         
                    as: "branchInfo"
                }
            },
            {
                $unwind: "$branchInfo"     
            },
            {
                $project: {
                    _id: 0,
                    branch: "$branchInfo.name",  
                    totalRevenue: 1
                }
            }
        ]);


        const walkInRevenue = await WalkIn.aggregate([
            {   
                $match: { status: 'Completed' }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },                    
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",  
                    totalRevenue: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);

        const appointmentRevenue = await WalkIn.aggregate([
            {   
                $match: { status: 'Completed' }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },                    
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",  
                    totalRevenue: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);
        
        const combined = [...walkInRevenue, ...appointmentRevenue];

        const mergedRevenue = combined.reduce((acc, curr) => {
            const existing = acc.find(item => item.date === curr.date);

            if (existing) {
                existing.totalRevenue += curr.totalRevenue;
            } else {
                acc.push({ ...curr });
            }
            return acc;
        }, []);        

        console.log(mergedRevenue);
        

        return res.status(200).json({
            appointmentByStatus,
            revenueByBranch,
            totalRevenue: mergedRevenue
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err})
    }
}

module.exports = {
    dashboardCardsData,
    graphData
}