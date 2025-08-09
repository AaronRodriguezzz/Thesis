import { useAuth } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// export const useNav = (endpoint) => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (endpoint) {
//             navigate(endpoint);
//         }
//     }, [endpoint, navigate]);
// }

export const useUser = () => {
    const { user } = useAuth();

    return user;
}

export const useUserProtection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'Admin' || user?.role === 'Front Desk') {
            navigate(user.role === 'Admin' ? '/admin/Dashboard' : '/front-desk/dashboard');
        }
    }, [user, navigate]);
}

export const useCustomerPageProtection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
}

export const useAdminPageProtection = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {   
        if(user) return navigate(user?.role === 'Admin' ? '/admin/Dashboard' : '/front-desk/dashboard')
        else if(!user) navigate('/admin/login')

    }, [user, navigate]);
}
