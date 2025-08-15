const notificationsSocketHandler = (io) => {
  const notificationsNamespace = io.of("/notifications");
  
  notificationsNamespace.on("connection", (socket) => {
    console.log("Client connected to notifications");

    socket.on("disconnect", () => { 
      console.log("Client disconnected from notifications");
    });
  });
  // Helper function for emitting notifications
  function sendAppointmentNotification(data) {
    notificationsNamespace.emit("newAppointment", data);
  }

  // Make emit function accessible to other files
  global.sendAppointmentNotification = sendAppointmentNotification;
}

module.exports = notificationsSocketHandler;