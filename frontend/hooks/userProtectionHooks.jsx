import { useAuth } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useUser = () => {
    const { user } = useAuth();
    
    return user;
}

export const useUserProtection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.pathname || '/'
    const { user, loading } = useAuth();

    useEffect(() => {
        console.log(user);
        if (!loading && user) {
            // Redirect based on role
            if (user.role === "Admin" || user.role === "Front Desk") {
                navigate(user?.role === 'Admin' ? '/admin/Dashboard' : '/front-desk/dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [user, loading, navigate]);
};

export const useLoginDisabling = () =>{
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if(!loading && user){
            console.log(user);
            if(user && user.role === undefined) {
                navigate("/", { replace: true });
            }
            else if(user.role === "Admin" || user.role === "Front Desk"){
                navigate(user.role === 'Admin' ? '/admin/Dashboard' : '/front-desk/dashboard', { replace: true });
            }
        }
    },[user, loading, navigate])
}

export const useCustomerPageProtection = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
        // Not logged in → login
            if (!user) {
                navigate("/login", { replace: true });
            }
            // Admin trying to access customer page → redirect to admin dashboard
            else if (user.role === "Admin" || user.role === "Front Desk") {
                navigate(user?.role === 'Admin' ? '/admin/Dashboard' : '/front-desk/dashboard', { replace: true });
            }
        }
    }, [user, loading, navigate]);
};


export const useAdminPageProtection = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    
    useEffect(() => {
        if (!loading) {
        // Not logged in → admin login
            if (!user) {
                navigate("/admin/login", { replace: true });
            }
            // Non-admin → redirect home
            else if (user.role !== "Admin" && user.role !== "Front Desk") {
                navigate("/", { replace: true });
            }
        }
    }, [user, loading, navigate]);
};


