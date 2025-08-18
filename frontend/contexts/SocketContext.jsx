import { createContext, useState, useEffect, useContext } from 'react';
import { get_data } from '../services/GetMethod';
import { notificationsSocket } from '../services/SocketMethods';

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const [notification, setNotification] = useState([]);
    const [newNotification, setNewNotification] = useState([]);
    const [newNotifCount, setNewNotifCount] = useState(0);

    useEffect(() => {
            // When we connect
            notificationsSocket.on("connect", () => {
                console.log("Connected to notifications namespace");
            });
    
            // Listen for new appointments
            notificationsSocket.on("newAppointment", (data) => {
                setNotification(prev => [data, ...prev]);
                setNewNotification(prev => [data, ...prev]);
                setNewNotifCount(prev => prev + 1);
            });
    
            // Cleanup
            return () => {
                notificationsSocket.off("newAppointment");
            };
    }, []);

    const newNotificationFilter = (index) => {
        const filterNotif = newNotification.filter((_, i) => i !== index);
        setNewNotification(filterNotif);
    }
    
    return (
        <SocketContext.Provider value={{ notification, newNotification, newNotifCount, setNewNotifCount, newNotificationFilter}}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);