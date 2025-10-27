

const queueSocketHandler = (io) => {
  const queueNamespace = io.of("/queue");

  queueNamespace.on("connection", (socket) => {
    console.log("Client connected to queue");

    // ✅ When client connects, they specify their branch
    socket.on("joinBranch", (branchId) => {
      socket.join(branchId); // join a room named after the branch
      console.log(`Client joined branch room: ${branchId}`);

      // Optionally send current queue state for that branch
      if (global.queueState && global.queueState[branchId]) {
        socket.emit("queueUpdate", global.queueState[branchId]);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from queue");
    });
  });
  
  const sendQueueUpdate = (branchId, state) => {
    console.log('info', branchId, 'hi', state);
    queueNamespace.to(branchId.toString()).emit("queueUpdate", {
      branchId,
      ...state,
    });
  };

  global.sendQueueUpdate = sendQueueUpdate;
};

module.exports = queueSocketHandler;