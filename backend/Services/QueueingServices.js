
const queueSocketHandler = (io) => {
  const queueNamespace = io.of("/queue");

  queueNamespace.on("connection", (socket) => {
    console.log("Client connected to queue");

    socket.on("disconnect", () => {
      console.log("Client disconnected from queue");
    });
  });

  // Helper function for emitting queue updates
  function sendQueueUpdate(data) {
    queueNamespace.emit("queueUpdate",data );
  }

  // Make emit function accessible to other files
  global.sendQueueUpdate = sendQueueUpdate;
}

module.exports = queueSocketHandler;