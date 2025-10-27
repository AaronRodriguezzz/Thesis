const updateQueueState = (branchId, newStatePart) => {
  if (!global.queueState[branchId]) {
    global.queueState[branchId] = { appointments: [], walkIns: [], barbers: [] };
  }

  global.queueState[branchId] = {
    ...global.queueState[branchId],
    ...newStatePart,
  };

  global.sendQueueUpdate(branchId, global.queueState[branchId]);
};

module.exports = { updateQueueState };