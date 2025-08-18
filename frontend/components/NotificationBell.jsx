import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useSocket } from "../contexts/SocketContext";

const NotificationBell = ({isOpen, onClick }) => {

  const { newNotifCount, setNewNotifCount} = useSocket();
  

  if(isOpen) setNewNotifCount(0);

  return (
    <div className="fixed top-14 right-15" onClick={onClick}>
      <IoNotificationsOutline className="text-2xl cursor-pointer" />
      
      {newNotifCount > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5"
        >
          {count > 99 ? "99+" : newNotifCount}
        </span>
      )}
    </div>
  );
}

export default NotificationBell