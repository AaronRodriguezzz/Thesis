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
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                if (user.role === "Admin") {
                    navigate("/admin/dashboard", { replace: true });
                } else if (user.role === "Front Desk") {
                    navigate("/front-desk/dashboard", { replace: true });
                }
            }
        }
    }, [user, loading]);
};

export const useLoginDisabling = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === "Admin") {
                navigate("/admin/dashboard", { replace: true });
            } else if (user.role === "Front Desk") {
                navigate("/front-desk/dashboard", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    }, [user, loading]);
};

export const useCustomerPageProtection = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    console.log(user);
    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/login", { replace: true });
            } 
        }
    }, [user, loading]);
};

export const useAdminPageProtection = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/admin/login", { replace: true });
      } else if (user && !("role" in user)) {
        console.log('user', user);
        navigate('/', { replace: true })
      }
    }
  }, [user, loading]);
};

