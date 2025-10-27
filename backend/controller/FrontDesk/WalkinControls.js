const WalkIn = require('../../models/WalkIn');
const { updateQueueState } = require("../../utils/updateQueueState");

const newWalkIn = async (req, res) => {
  const { branch, barber, additionalService } = req.body;
    
  try {
    const walkIn = new WalkIn({
      ...req.body,
      additionalService: additionalService || undefined,
      barber: barber?.trim() ? barber : undefined,
    });

    const saved = await walkIn.save();
    const populated = await saved.populate(["service", "additionalService", "barber", "recordedBy"]);

    if (!global.queueState[branch]) global.queueState[branch] = { appointments: [], walkIns: [], barbers: [] };

    updateQueueState(branch, {
      walkIns: [...global.queueState[branch].walkIns, populated.toObject()],
    });

    res.status(200).json({ message: "New Walk-In Added", walkIn: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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