import axios from 'axios';
import { CustomAlert } from '../components/modal/CustomAlert';

export const get_data = async (route) => {
    try {
        const response = await axios.get(`/api/${route}`, {
            withCredentials: true, // This is required to include cookies like the JWT
        });
        
        console.log(response.data);
        if (response.status === 200) {
            return response.data    
        }
    } catch (err) {
        if (err.response) {
            // Extract message or error from backend
            const message = err.response.data.message || err.response.data.error || 'Unknown error';
            CustomAlert('error', message); // show error alert
        } else {
            CustomAlert('error', 'Server Error');
        }
    }
};