import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const UserAuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/protected", { withCredentials: true });
                setUser(res.data.user);
            } catch (err) {
                // Token invalid or missing
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        const interval = setInterval(checkAuth, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const logout = async (role) => {
        try {
            const res = await axios.post(`/api/logout/${role}`, {}, { withCredentials: true });
            
            if (res.status === 200) {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    };

    return (
        <UserAuthContext.Provider value={{ user, setUser, loading, logout }}>
        {children}
        </UserAuthContext.Provider>
    );
};

export const useAuth = () => useContext(UserAuthContext);
