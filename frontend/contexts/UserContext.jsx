import { createContext, useState, useEffect, useContext } from 'react';
import { get_data } from '../services/GetMethod';
import axios from 'axios';

const UserAuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setLoading(true)
                const res = await axios.get('/api/protected', { withCredentials: true });
                console.log('hello', res.data.user);
                setUser(res.data.user);

            } catch (err) {
                console.log('hello', err)
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    

    const logout = async () => {
        const response = await axios.post('/api/logout', {}, { withCredentials: true });
        
        if(response.status === 200){
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