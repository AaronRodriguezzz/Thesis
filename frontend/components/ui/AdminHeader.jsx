import { Bell, UserCircle } from "lucide-react";
import pageTitles from "../../data/PageTitles";
import { useLocation, useNavigate} from "react-router-dom";

export default function AdminHeader() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentTitle = pageTitles[location.pathname].title || "" ; 
    const description = pageTitles[location.pathname].description || "" ; 

    if(location.pathname === '/front-desk/account' || location.pathname === '/front-desk/admin') return

    return (
        <div className="w-full flex items-center justify-between px-8">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold tracking-tighter text-gray-800">{currentTitle}</h1>
                <p className="text-xs text-gray-500 md:text-sm">{description}</p>
            </header>
            <div 
              className="flex gap-x-4" 
            >
              {/* Profile Display */}
              <div className="flex items-center gap-x-2 group cursor-pointer" onClick={() => navigate(location.pathname)}>
                <div className=" rounded-full p-1.5">
                  <UserCircle className="w-7 h-7 text-gray-700 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors">
                  Karl Retrita
                </span>
              </div>
            </div>
        </div>
    );
}