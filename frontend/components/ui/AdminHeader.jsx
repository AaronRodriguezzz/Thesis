import { UserCircle } from "lucide-react";
import pageTitles from "../../data/PageTitles";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/userProtectionHooks";
import { HiOutlineMegaphone } from "react-icons/hi2";
import AnnouncementModal from '../../components/modal/SendAnnouncementModal';
import { useState } from "react";

export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser();
  const currentTitle = pageTitles[location.pathname]?.title || "";
  const description = pageTitles[location.pathname]?.description || "";

  const path = location.pathname.includes("front-desk")
    ? "/front-desk/account"
    : "/admin/account";

  const [sendingAnnouncement, setSendAnnouncement] = useState(false);

  if (
    location.pathname === "/front-desk/account" ||
    location.pathname === "/admin/account"
  )
    return null;

  return (
    <div className="w-full">
      <div className="flex items-start sm:items-center justify-between px-4 lg:px-8 py-3 gap-2">
        {/* Title + Description */}
        <header>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-gray-800">
            {currentTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">{description}</p>
        </header>

        {/* Profile Display */}

        <div className="flex items-center gap-x-2"> 
          <HiOutlineMegaphone className="w-7 h-7 text-gray-700 transform -scale-x-100 hover:text-blue-500 cursor-pointer" onClick={() => setSendAnnouncement(true)}/>
          <div
            className="flex items-center justify-end gap-x-2 group cursor-pointer"
            onClick={() => navigate(path)}
          >
            <div className="rounded-full p-1.5 transition-colors">
              <UserCircle className="w-7 h-7 text-gray-700 group-hover:text-blue-500" />
            </div>
            <span className="font-medium text-gray-800 group-hover:text-blue-500 transition-colors">
              {user?.fullName}
            </span>
          </div>
        </div>
      </div>

      <AnnouncementModal isOpen={sendingAnnouncement} onClose={() => setSendAnnouncement(false)}/>
    </div>
  );
}
