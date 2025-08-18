import { useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext" 
import { appointmentTimeFormat } from "../../utils/formatDate";

const NotificationContent = ({filter, index, notification}) => {
    
    useEffect(() => {
        const timer = setTimeout(() => {
            filter(index); // remove after 2s
        }, 6000);

        // cleanup so no memory leaks
        return () => clearTimeout(timer);
    }, [filter, index]); 

    return(
        <div className="w-[350px] flex gap-x-4 rounded-md shadow-md p-2 bg-white"> 
            <div className="bg-green-400 rounded-full flex items-center">
                <span className="text-lg text-white font-semibold tracking-tighter p-2">NEW</span>
            </div>

            <div className="w-full flex justify-between items-center">
                <div className="leading-5">
                    <h2 className='text-md font-semibold text-green-400'>{notification.customer.firstName}</h2>
                    <p className="text-sm">{notification.customer.email}</p>
                    <p className="text-sm">{notification.customer.phone}</p>
                </div>
                
                <div className="leading-5">
                    <p className="text-sm">{notification.scheduledDate.split('T')[0]}</p>
                    <p className="text-sm">{appointmentTimeFormat(notification.scheduledTime)}</p>
                </div>
            </div>    
        </div>
    )
}

export default function PopUpNotification() {
    const { newNotification, newNotificationFilter } = useSocket();
    
    return (
        <div className="fixed bottom-5 right-5 flex flex-col gap-y-3 bg-transparent mx-2">
            {newNotification.map((notification, index) => (
                <NotificationContent 
                    filter={newNotificationFilter}
                    index={index}
                    notification={notification}
                />
            ))
            }
        </div>
    )
}