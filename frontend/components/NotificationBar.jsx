import React, { useState } from "react";
import { appointmentTimeFormat } from "../utils/formatDate";
import { useSocket } from "../contexts/SocketContext";
import { useFetch } from "../hooks/useFetch";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const NotificationBar = ({ isOpen, onClose }) => {
  const { notification } = useSocket();
  const [notificationLimit, setNotificationLimit] = useState(10);

  const { data, loading, error } = useFetch(
    "all_appointments",
    null,
    notificationLimit,
    [notificationLimit]
  );

  const appointments = data?.appointments || [];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
          {/* Panel */}
          <motion.div
            key="notif-panel"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-[320px] h-full bg-black/40 border border-white/10 text-white shadow-xl p-4 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <h1 className="font-semibold text-xl tracking-tight">Notifications</h1>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {loading && <p className="text-center text-gray-400">Loading...</p>}
              {error && (
                <p className="text-center text-red-400">
                  Error loading notifications
                </p>
              )}

              {/* Real-time notifications */}
              {notification &&
                notification
                  .filter((a) => a.status === "Booked")
                  .map((appointment, i) => (
                    <div
                      key={`live-${i}`}
                      className="bg-black/60 border border-white/10 p-3 rounded-lg shadow-sm hover:bg-gray-700 transition"
                    >
                      <h2 className="font-semibold text-green-400 text-sm">
                        {appointment.customer.firstName}
                      </h2>
                      <p className="truncate text-xs text-gray-300">
                        {appointment.customer.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {appointment.customer.phone}
                      </p>
                      <div className="mt-1 text-xs text-gray-400">
                        <p>{appointment.scheduledDate.split("T")[0]}</p>
                        <p>{appointmentTimeFormat(appointment.scheduledTime)}</p>
                      </div>
                    </div>
                  ))}

              {/* Fetched notifications */}
              {appointments &&
                appointments
                  .filter((a) => a.status === "Booked")
                  .map((appointment, i) => (
                    <div
                      key={`db-${i}`}
                      className="bg-black/60 border border-white/10 p-3 rounded-lg shadow-sm hover:bg-gray-700 transition"
                    >
                      <h2 className="font-semibold text-green-400 text-sm">
                        {appointment.customer.firstName}
                      </h2>
                      <p className="truncate text-xs text-gray-300">
                        {appointment.customer.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {appointment.customer.phone}
                      </p>
                      <div className="mt-1 text-xs text-gray-400">
                        <p>{appointment.scheduledDate.split("T")[0]}</p>
                        <p>{appointmentTimeFormat(appointment.scheduledTime)}</p>
                      </div>
                    </div>
                  ))}

              {!loading && !error && appointments.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  No notifications found.
                </p>
              )}
            </div>

            {/* Footer */}
            {appointments.length > 0 && (
              <button
                onClick={() => setNotificationLimit(notificationLimit + 10)}
                className="mt-3 py-2 text-center w-full bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition"
              >
                View More
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBar;
