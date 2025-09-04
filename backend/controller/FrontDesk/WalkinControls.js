const WalkIn = require('../../models/WalkIn');


const newWalkIn = async (req, res) => {

    const { barber, additionalService } = req.body;

    try{
        const walkIn = new WalkIn({
            ...req.body, 
            additionalService: additionalService ? additionalService : undefined,
            barber: barber?.trim() ? barber : undefined 
        });

        const newWalkIn = await walkIn.save();

        if(!newWalkIn){
            return res.status(400).json({message: 'New Walk In Adding Failed'})
        }

        const branchId = req.body?.branch;

        if (global.queueState[branchId]) {
            global.queueState[branchId].walkIn = [...global.queueState[branchId].walkIn, walkIn]
        }   

        global.sendQueueUpdate(global.queueState);

        return res.status(200).json({message: 'New Walk In Added Successfully', walkIn})
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err})
    }
}   

const getWalkInByBranch = async (req,res) => {
    const branchId = req.params.branchId
    
    if(!branchId){
        return res.status(400).json({message: 'Missing branch Id'})
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    try{

        const walkIns = await WalkIn.find({ branch: branchId, status: 'Waiting', createdAt: { $gte: start, $lte: end } })
            .populate('service')
            .populate('additionalService')
            .populate('barber')
            .populate('totalAmount')
            .populate('recordedBy')


        return res.status(200).json(walkIns);
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err})
    }
}

module.exports = {
    newWalkIn,
    getWalkInByBranch
}