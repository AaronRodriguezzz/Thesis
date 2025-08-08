import { createContext, useState, useEffect, useContext } from 'react';
import { get_data } from '../services/GetMethod';

const UserAuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await get_data('/protected');
                setUser(res.user);

            } catch (err) {
                setUser(null);
            }
        };
        checkAuth();
    }, []);
    

    const logout = async () => {
        await axios.post('/api/logout', {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <UserAuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </UserAuthContext.Provider>
    );
};

export const useAuth = () => useContext(UserAuthContext);