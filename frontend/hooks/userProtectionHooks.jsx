import { useAuth } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    const { user, loading} = useAuth();
    
    useEffect(() => {
        if(loading) return;
        if (user && user?.role !== undefined) {
            navigate(user?.role === 'Admin' ? '/admin/Dashboard' : '/front-desk/dashboard');
        }
    }, [user, loading, navigate]);
}

export const useCustomerPageProtection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.pathname || '/'
    const { user, loading } = useAuth();

    useEffect(() => {
        if(loading) return;
        if (user && user?.role === undefined) {
            navigate(from);
        }else {
            navigate('/login');
        }
        
    }, [user, loading, navigate]);
}

export const useLoginDisabling = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if(loading) return;
        if(user && user?.role === undefined){
            navigate('/');
        }else if(user && user?.role !== undefined){
            navigate(user?.role === 'Admin' ? '/admin/dashboard' : '/front-desk/dashboard')
        }
    },[navigate, user, loading])
}

export const useAdminPageProtection = () => {
    const navigate = useNavigate();
    const { user, loading} = useAuth();

    useEffect(() => {   
        if(loading) return;
        if(!user) return navigate('/admin/login')
        if(user && user?.role === undefined) return navigate('/');

    }, [user, navigate]);
}
