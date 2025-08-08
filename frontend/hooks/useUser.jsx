import { useAuth } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";



export const useUser = () => {
    const { user } = useAuth();

    return user;
}

export const useUserProtection = () => {
    const { user } = useAuth();

    if(user?.role === 'Admin' || user?.role === 'Front Desk' ) return <Navigate to={user?.role === 'Admin' ? '/admin/Dashboard' : '/front-desk/dashboard'} />
}

export const useCustomerPageProtection = () => {
    const { user } = useAuth();

    if(!user && !user?.role) return <Navigate to={'/login'} />
}

export const useAdminPageProtection = () => {
    const { user } = useAuth();

    if(!user && user?.role) return <Navigate to={'/admin/login'} />
}
